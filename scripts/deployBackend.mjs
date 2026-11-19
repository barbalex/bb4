// backend-image deploy: rsync backend/ to the server, rebuild the db and
// caddy images and recreate those containers. use this when the Dockerfiles
// or compose stack change; use npm run deploy for app-only deploys.
//
// postgres stays within major 14: patch/minor upgrades are compatible with
// the existing data volume. a major upgrade needs a dump/restore migration,
// not just an image bump.
//
// usage: npm run deploy:backend
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

try {
  sshCapture('true')
} catch {
  console.error(`could not reach ${SERVER} with ssh key auth — run ssh-copy-id ${SERVER} once`)
  process.exit(1)
}

const remoteDir =
  process.env.BB_DEPLOY_DIR ??
  sshCapture(
    'docker inspect bb_app --format "{{ index .Config.Labels \\"com.docker.compose.project.working_dir\\" }}" 2>/dev/null',
  ) ??
  '/root/bb'

console.log(`==> deploying backend images to ${SERVER}:${remoteDir}`)
run('rsync', ['-az', '--delete', '--exclude', '.env*', '--exclude', '.DS_Store', `${root}/backend/`, `${SERVER}:${remoteDir}/`])

try {
  sshCapture(`test -f ${remoteDir}/.env`)
} catch {
  console.error(`error: ${remoteDir}/.env missing on the server — restore it first`)
  process.exit(1)
}

const rev = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
console.log(`==> deploying ${rev}, rebuilding db + caddy images`)
run('ssh', [
  ...sshOpts,
  SERVER,
  `cd ${remoteDir} && docker compose build db caddy && docker compose up -d db caddy --wait --wait-timeout ${WAIT_TIMEOUT}`,
])

console.log(`==> checking containers and public site`)
const containers = sshCapture(`docker ps --filter name=bb_ --format "{{.Names}}: {{.Status}}"`)
console.log(containers)
let ok = false
try {
  const res = await fetch('https://blue-borders.ch/events/2024/')
  const body = res.status === 200 ? await res.text() : ''
  ok = res.status === 200 && body.includes('Lampedusa')
} catch {}
console.log(`    ${ok ? 'ok  ' : 'FAIL'}  blue-borders.ch events`)
if (!ok) {
  console.error(`error: site check failed — check: ssh ${SERVER} 'cd ${remoteDir} && docker compose logs --tail 50'`)
  process.exit(1)
}
console.log(`==> backend deploy complete (${rev})`)
