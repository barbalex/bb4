// deploys the static site: builds all pages against the local dev database,
// rsyncs the output and the caddy stack to the server, and makes sure caddy
// runs the current config. the server's .env (ACME config) is server-local
// and never synced or deleted.
//
// usage: npm run deploy
// overrides for testing: BB_DEPLOY_SERVER=user@host BB_DEPLOY_DIR=/path
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SERVER = process.env.BB_DEPLOY_SERVER ?? 'root@172.238.96.134'
const WAIT_TIMEOUT = 60
const sshOpts = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10']

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const run = (cmd, args, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { stdio: 'inherit', ...opts })
}

const sshCapture = (command) =>
  execFileSync('ssh', [...sshOpts, SERVER, command], {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
    timeout: 30_000,
  }).trim()

try {
  sshCapture('true')
} catch {
  console.error(`could not reach ${SERVER} with ssh key auth — run ssh-copy-id ${SERVER} once`)
  process.exit(1)
}

const remoteDir =
  process.env.BB_DEPLOY_DIR ??
  sshCapture(
    'docker inspect bb_caddy --format "{{ index .Config.Labels \\"com.docker.compose.project.working_dir\\" }}" 2>/dev/null',
  ) ??
  '/root/bb'

// the build needs the dev database connection (pages are prerendered from it)
const readEnv = (key) =>
  readFileSync(path.join(root, '.env'), 'utf8')
    .split('\n')
    .find((line) => line.startsWith(`${key}=`))
    ?.slice(key.length + 1)
    .trim()

const dbConnection = process.env.PG_CONNECTIONSTRING_DEV ?? readEnv('PG_CONNECTIONSTRING_DEV')
if (!dbConnection) {
  console.error('error: PG_CONNECTIONSTRING_DEV missing (checked env and .env)')
  process.exit(1)
}

console.log(`==> building static pages from the dev database`)
run(
  'npm',
  ['run', 'build'],
  {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PG_CONNECTIONSTRING_DEV: dbConnection,
    },
  },
)

// qwik 1.20's SSG emits the idle-prefetch script with a bare module
// specifier (import("q-XYZ.js")) which fails to resolve in the browser;
// rewrite it to the build base
console.log(`==> fixing bare chunk specifiers in the preload scripts`)
run('bash', [
  '-c',
  `grep -rl 'import("q-' ${root}/dist --include='*.html' | xargs -r sed -i 's|import("q-|import("/build/q-|g'`,
])

console.log(`==> deploying to ${SERVER}:${remoteDir}`)
run('rsync', ['-az', '--delete', '--exclude', '.env*', '--exclude', '.DS_Store', `${root}/backend/`, `${SERVER}:${remoteDir}/`])
run('rsync', ['-az', '--delete', `${root}/dist/`, `${SERVER}:${remoteDir}/dist/`])

try {
  sshCapture(`test -f ${remoteDir}/.env`)
} catch {
  console.error(`error: ${remoteDir}/.env missing on the server — restore it first`)
  process.exit(1)
}

const rev = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
console.log(`==> deploying ${rev}, ensuring caddy runs the current config`)
run('ssh', [
  ...sshOpts,
  SERVER,
  `cd ${remoteDir} && docker compose build caddy && docker compose up -d caddy --wait --wait-timeout ${WAIT_TIMEOUT}`,
])

console.log(`==> probing public sites`)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let failed = false
const probe = async (url, label) => {
  let ok = false
  for (let attempt = 1; attempt <= 5 && !ok; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      const body = res.status === 200 ? await res.text() : ''
      ok = res.status === 200 && body.includes('Lampedusa')
    } catch {}
    if (!ok && attempt < 5) await sleep(3000)
  }
  console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${label}`)
  if (!ok) failed = true
}
await probe('https://blue-borders.ch/events/2024/', 'blue-borders.ch events')
await probe('https://mediterranean-migration.com/events/2024/', 'mediterranean-migration.com events')
if (failed) {
  console.error(`error: probes failed — check: ssh ${SERVER} 'cd ${remoteDir} && docker compose logs caddy --tail 50'`)
  process.exit(1)
}

console.log(`==> deploy complete (${rev})`)
