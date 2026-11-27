import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
const payload = await getPayload({ config })
const adapter = payload.db as unknown as {
  schema: unknown
  drizzle: unknown
  schemaName?: string
  tablesFilter?: string[]
  requireDrizzleKit: () => Promise<{ pushSchema: (...a: unknown[]) => Promise<{ statements?: unknown[] }> }>
}
const { pushSchema } = await adapter.requireDrizzleKit()
const { statements } = await pushSchema(adapter.schema, adapter.drizzle, adapter.schemaName ? [adapter.schemaName] : undefined, adapter.tablesFilter, undefined)
console.log('DIFF_STATEMENTS:')
for (const statement of statements ?? []) {
  console.log(typeof statement === 'string' ? statement : JSON.stringify(statement))
}
process.exit(0)
