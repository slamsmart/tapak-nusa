import fs from 'node:fs'
import path from 'node:path'

const polyfillCode = `// Workerd polyfill for MessagePort and MessageChannel required by undici / payload
if (typeof globalThis.MessagePort === 'undefined') {
  globalThis.MessagePort = class MessagePort extends EventTarget {};
}
if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = new globalThis.MessagePort();
      this.port2 = new globalThis.MessagePort();
    }
  };
}
`

const polyfillPath = path.resolve('.open-next/cloudflare/polyfill.js')
fs.mkdirSync(path.dirname(polyfillPath), { recursive: true })
fs.writeFileSync(polyfillPath, polyfillCode, 'utf8')

// Patch .open-next/worker.js
const workerPath = path.resolve('.open-next/worker.js')
if (fs.existsSync(workerPath)) {
  let workerContent = fs.readFileSync(workerPath, 'utf8')
  if (!workerContent.includes('polyfill.js')) {
    workerContent = 'import "./cloudflare/polyfill.js";\n' + workerContent
    fs.writeFileSync(workerPath, workerContent, 'utf8')
    console.log('Patched .open-next/worker.js with MessagePort polyfill')
  }
}

// Patch .open-next/server-functions/default/handler.mjs
const handlerPath = path.resolve('.open-next/server-functions/default/handler.mjs')
if (fs.existsSync(handlerPath)) {
  let handlerContent = fs.readFileSync(handlerPath, 'utf8')
  if (!handlerContent.includes('MessagePort')) {
    handlerContent = polyfillCode + handlerContent
    fs.writeFileSync(handlerPath, handlerContent, 'utf8')
    console.log('Patched .open-next/server-functions/default/handler.mjs with MessagePort polyfill')
  }
}
