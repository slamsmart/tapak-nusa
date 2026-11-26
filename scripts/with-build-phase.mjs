import { spawnSync } from 'node:child_process'

// Windows shell (cmd.exe) cannot parse `VAR=value command` prefixes inside
// package.json scripts, so the OpenNext build pipeline needs this wrapper to
// export the build phase. `next build` itself only sets NEXT_PHASE partway
// through, while the Payload binding fallback and the dev-server init in
// next.config need to see it before any module loads — otherwise every build
// process spins up a remote preview session that the build does not need.
process.env.NEXT_PHASE = 'phase-production-build'
process.env.OPENNEXT_BUILD = 'true'
process.env.NODE_ENV = 'production'
// Exported so every process the build spawns (including `payload` CLI runs by
// OpenNext's patch step) can detect the production build, since NEXT_PHASE only
// reaches processes spawned directly by the wrapper.
const [, , ...args] = process.argv
const command = args.shift()
if (!command) {
  process.exit(1)
}

const result = spawnSync(command, args, { stdio: 'inherit', shell: true })

if (result.status === 0 && (command.includes('opennextjs-cloudflare') || args.includes('opennextjs-cloudflare'))) {
  spawnSync('node scripts/patch-opennext.mjs', { stdio: 'inherit', shell: true })
}

process.exit(result.status ?? 1)
