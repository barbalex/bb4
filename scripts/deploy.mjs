// deploys the static site: builds all pages against the local dev database
// and rsyncs them to the vermehrung server, where the vermehrung caddy
// serves them (see ~/Documents/GitHub/vermehrung backend/caddy/Caddyfile).
// no containers of our own anymore - caddy serves file changes immediately.
//
// usage: npm run deploy
// overrides for testing: BB_DEPLOY_SERVER=user@host BB_DEPLOY_DIR=/path
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SERVER = process.env.BB_DEPLOY_SERVER ?? 'root@139.162.172.14'
const remoteDir = process.env.BB_DEPLOY_DIR ?? '/root/bb'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const run = (cmd, args, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, { stdio: 'inherit', ...opts })
}

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
run('rsync', ['-az', '--delete', `${root}/dist/`, `${SERVER}:${remoteDir}/dist/`])

const rev = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()

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
  console.error(`error: probes failed (until the dns A records point at ${SERVER}, this is expected)`)
}

console.log(`==> deploy complete (${rev})`)
