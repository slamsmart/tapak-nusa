import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE \`users\` ADD \`avatar\` text;`)
  } catch (error) {
    // Dev environments (payload dev push) can add the column before this
    // migration runs; the duplicate-column failure is then safe to ignore.
    const message = error instanceof Error ? error.message : String(error)
    if (!/duplicate column/i.test(message)) throw error
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`avatar\`;`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!/no such column/i.test(message)) throw error
  }
}
