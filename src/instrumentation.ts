// Workerd polyfill for MessagePort and MessageChannel required by undici / payload.
// Generated worker types (worker-configuration.d.ts) already declare these globals,
// so @ts-expect-error directives become unused-expect-error build failures. Write
// through a Record<string, unknown> cast and instantiate via a local ctor type.
function ensureMessagePortGlobals() {
  const runtime = globalThis as unknown as Record<string, unknown>
  if (typeof globalThis.MessagePort === 'undefined') {
    const MessagePort = class MessagePort extends EventTarget {}
    runtime.MessagePort = MessagePort
  }
  if (typeof globalThis.MessageChannel === 'undefined') {
    runtime.MessageChannel = class MessageChannel {
      port1: unknown
      port2: unknown
      constructor() {
        const Port = globalThis.MessagePort as unknown as new () => EventTarget
        this.port1 = new Port()
        this.port2 = new Port()
      }
    }
  }
}

ensureMessagePortGlobals()
