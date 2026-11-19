// one-command production deploy: lint + build locally, rsync the compose
// stack and the build output to the server, rebuild and restart only the
// app container, then probe the public sites (pattern borrowed from the
// ps project's deploy-backend.sh).
//
// the server's .env (db password, firebase keys) is server-local and is
// never synced or deleted. db data lives in docker volumes and is never
// touched — only the app image is rebuilt and recreated. caddy and db
// keep running, so downtime is limited to the app container restart.
//
// first-time setup needs passwordless ssh to the server:
//   ssh-copy-id root@172.238.96.134
//
// usage: npm run deploy
// overrides for testing: BB_DEPLOY_SERVER=user@host BB_DEPLOY_DIR=/path
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SERVER = process.env.BB_DEPLOY_SERVER ?? 'root@172.238.96.134'
const WAIT_TIMEOUT = 120
const sshOpts = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10']

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const run = (cmd, args) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { stdio: 'inherit' })
}

const sshCapture = (command) =>
  execFileSync('ssh', [...sshOpts, SERVER, command], {
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
    timeout: 30_000,
  }).trim()

// fail fast with setup instructions when key auth does not work yet
try {
  sshCapture('true')
} catch {
  console.error(
    `could not reach ${SERVER} with ssh key auth.\n` +
      `if you have never deployed from this machine, run:\n` +
      `  ssh-copy-id ${SERVER}\n` +
      `(once; it asks for the server password)`,
  )
  process.exit(1)
}

// where does the compose stack live on the server? ask the running app
// container for its compose working dir; fall back to BB_DEPLOY_DIR, then
// to the conventional /root/bb4
const detectDir = () => {
  const detected = sshCapture(
    'docker inspect bb_app --format "{{ index .Config.Labels \\"com.docker.compose.project.working_dir\\" }}" 2>/dev/null',
  )
  return (
    process.env.BB_DEPLOY_DIR ?? detected ?? '/root/bb4'
  )
}

console.log(`==> building (lint + client + ssg + server)`)
run('npm', ['run', 'build'])

const remoteDir = detectDir()
console.log(`==> deploying to ${SERVER}:${remoteDir}`)

// compose stack: docker-compose.yml, db/, caddy/, app/{Dockerfile,.dockerignore}.
// --delete mirrors deletions but never touches the server's .env
run('rsync', [
  '-az',
  '--delete',
  '--exclude',
  '.env*',
  '--exclude',
  '.DS_Store',
  `${root}/backend/`,
  `${SERVER}:${remoteDir}/`,
])

// build output + manifests go into the app build context (backend/app)
run('rsync', [
  '-az',
  '--delete',
  `${root}/dist/`,
  `${SERVER}:${remoteDir}/app/dist/`,
])
run('rsync', [
  '-az',
  '--delete',
  `${root}/server/`,
  `${SERVER}:${remoteDir}/app/server/`,
])
run('rsync', [
  '-az',
  `${root}/package.json`,
  `${root}/package-lock.json`,
  `${SERVER}:${remoteDir}/app/`,
])

try {
  sshCapture(`test -f ${remoteDir}/.env`)
} catch {
  console.error(`error: ${remoteDir}/.env missing on the server — restore it first`)
  process.exit(1)
}

const rev = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
}).trim()
console.log(`==> deploying ${rev}, rebuilding and restarting the app container`)
run('ssh', [
  ...sshOpts,
  SERVER,
  `cd ${remoteDir} && docker compose build app && docker compose up -d app --wait --wait-timeout ${WAIT_TIMEOUT}`,
])

console.log(`==> probing public sites`)
let failed = false
const probe = async (url, label) => {
  let ok = false
  try {
    const res = await fetch(url)
    const body = res.status === 200 ? await res.text() : ''
    ok = res.status === 200 && body.includes('Lampedusa')
  } catch {}
  console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${label}`)
  if (!ok) failed = true
}
await probe('https://blue-borders.ch/events/2024/', 'blue-borders.ch events')
await probe('https://mediterranean-migration.com/events/2024/', 'mediterranean-migration.com events')
if (failed) {
  console.error(`error: probes failed — check: ssh ${SERVER} 'cd ${remoteDir} && docker compose logs app --tail 100'`)
  process.exit(1)
}

console.log(`==> deploy complete (${rev})
rollback: git checkout <previous-rev> && npm run deploy`)
