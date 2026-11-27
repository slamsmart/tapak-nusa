import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`provinces\` ADD \`latitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`provinces\` ADD \`longitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`provinces\` DROP COLUMN \`map_x\`;`)
  await db.run(sql`ALTER TABLE \`provinces\` DROP COLUMN \`map_y\`;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` ADD \`version_latitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` ADD \`version_longitude\` numeric;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` DROP COLUMN \`version_map_x\`;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` DROP COLUMN \`version_map_y\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`provinces\` ADD \`map_x\` numeric NOT NULL;`)
  await db.run(sql`ALTER TABLE \`provinces\` ADD \`map_y\` numeric NOT NULL;`)
  await db.run(sql`ALTER TABLE \`provinces\` DROP COLUMN \`latitude\`;`)
  await db.run(sql`ALTER TABLE \`provinces\` DROP COLUMN \`longitude\`;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` ADD \`version_map_x\` numeric NOT NULL;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` ADD \`version_map_y\` numeric NOT NULL;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` DROP COLUMN \`version_latitude\`;`)
  await db.run(sql`ALTER TABLE \`_provinces_v\` DROP COLUMN \`version_longitude\`;`)
}
