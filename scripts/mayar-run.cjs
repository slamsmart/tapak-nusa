// Launcher for the globally installed Mayar CLI on this machine.
//
// Why this exists: auth.mayar.id sits behind Cloudflare, which 403-challenges
// HTTP requests that carry no User-Agent header. Node's https module sends
// none by default, so `mayar login` and every API call can fail with
// "Invalid response from server: <!DOCTYPE html>" (a Cloudflare challenge
// page). This shim injects a User-Agent into every https request before
// loading the CLI.
//
// Usage: node scripts/mayar-run.cjs <mayar args...>
const path = require('path')
const os = require('os')

const UA = 'mayar-cli/1.2.0 (node)'

function wrapRequest(mod) {
  const original = mod.request
  const wrap = function (first, ...rest) {
    if (first && typeof first === 'object' && !Array.isArray(first)) {
      first.headers = { 'User-Agent': UA, ...(first.headers || {}) }
      return original.call(mod, first, ...rest)
    }
    // String/URL first arg: options object may be the next non-function arg.
    const optsIdx = rest.findIndex((r) => r && typeof r === 'object')
    if (optsIdx !== -1) {
      rest[optsIdx].headers = { 'User-Agent': UA, ...(rest[optsIdx].headers || {}) }
      return original.call(mod, first, ...rest)
    }
    return original.call(mod, first, { headers: { 'User-Agent': UA } }, ...rest)
  }
  return wrap
}

const https = require('https')
const patchedRequest = wrapRequest(https)
https.request = patchedRequest
https.get = patchedRequest

const cliEntry = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  'npm',
  'node_modules',
  'mayar',
  'bin',
  'mayar.js',
)
require(cliEntry)
