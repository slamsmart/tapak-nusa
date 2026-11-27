import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	\`refresh_count\` numeric,
  	\`refreshed_at\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`verified\` integer DEFAULT false,
  	\`otp_hash\` text,
  	\`otp_expires\` text,
  	\`otp_attempts\` numeric,
  	\`otp_next_resend\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`users_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_rels_order_idx\` ON \`users_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_parent_idx\` ON \`users_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_path_idx\` ON \`users_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_admins_id_idx\` ON \`users_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_users_id_idx\` ON \`users_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`admins_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`admins_rels_users_id_idx\` ON \`admins_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`media_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`media_rels_users_id_idx\` ON \`media_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_media_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_users_id_idx\` ON \`_media_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`folders_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`folders_rels_users_id_idx\` ON \`folders_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_folders_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_users_id_idx\` ON \`_folders_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`tags_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`tags_rels_users_id_idx\` ON \`tags_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_tags_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_users_id_idx\` ON \`_tags_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`provinces_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_users_id_idx\` ON \`provinces_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_provinces_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_users_id_idx\` ON \`_provinces_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`culture_cards_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_users_id_idx\` ON \`culture_cards_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_culture_cards_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_users_id_idx\` ON \`_culture_cards_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`quiz_questions_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_users_id_idx\` ON \`quiz_questions_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_quiz_questions_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_users_id_idx\` ON \`_quiz_questions_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`culture_entries_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_users_id_idx\` ON \`culture_entries_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`_culture_entries_v_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_users_id_idx\` ON \`_culture_entries_v_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_preferences_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_llm_instructions_rels\` ADD \`users_id\` integer REFERENCES users(id);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_users_id_idx\` ON \`payload_llm_instructions_rels\` (\`users_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`users_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_admins_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_admins_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`admins_rels\`;`)
  await db.run(sql`DROP TABLE \`admins_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_admins_rels\` RENAME TO \`admins_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`admins_rels_order_idx\` ON \`admins_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_parent_idx\` ON \`admins_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_path_idx\` ON \`admins_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_admins_id_idx\` ON \`admins_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_media_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`tags_id\` integer,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media_rels\`("id", "order", "parent_id", "path", "tags_id", "admins_id") SELECT "id", "order", "parent_id", "path", "tags_id", "admins_id" FROM \`media_rels\`;`)
  await db.run(sql`DROP TABLE \`media_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_media_rels\` RENAME TO \`media_rels\`;`)
  await db.run(sql`CREATE INDEX \`media_rels_order_idx\` ON \`media_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_parent_idx\` ON \`media_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_path_idx\` ON \`media_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_tags_id_idx\` ON \`media_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_admins_id_idx\` ON \`media_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__media_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`tags_id\` integer,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_media_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__media_v_rels\`("id", "order", "parent_id", "path", "tags_id", "admins_id") SELECT "id", "order", "parent_id", "path", "tags_id", "admins_id" FROM \`_media_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_media_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__media_v_rels\` RENAME TO \`_media_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_order_idx\` ON \`_media_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_parent_idx\` ON \`_media_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_path_idx\` ON \`_media_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_tags_id_idx\` ON \`_media_v_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_admins_id_idx\` ON \`_media_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_folders_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_folders_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`folders_rels\`;`)
  await db.run(sql`DROP TABLE \`folders_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_folders_rels\` RENAME TO \`folders_rels\`;`)
  await db.run(sql`CREATE INDEX \`folders_rels_order_idx\` ON \`folders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_parent_idx\` ON \`folders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_path_idx\` ON \`folders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_admins_id_idx\` ON \`folders_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__folders_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_folders_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__folders_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_folders_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_folders_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__folders_v_rels\` RENAME TO \`_folders_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_order_idx\` ON \`_folders_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_parent_idx\` ON \`_folders_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_path_idx\` ON \`_folders_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_admins_id_idx\` ON \`_folders_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_tags_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_tags_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`tags_rels\`;`)
  await db.run(sql`DROP TABLE \`tags_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_tags_rels\` RENAME TO \`tags_rels\`;`)
  await db.run(sql`CREATE INDEX \`tags_rels_order_idx\` ON \`tags_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_parent_idx\` ON \`tags_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_path_idx\` ON \`tags_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_admins_id_idx\` ON \`tags_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__tags_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tags_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__tags_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_tags_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_tags_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__tags_v_rels\` RENAME TO \`_tags_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_order_idx\` ON \`_tags_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_parent_idx\` ON \`_tags_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_path_idx\` ON \`_tags_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_admins_id_idx\` ON \`_tags_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_provinces_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_provinces_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`provinces_rels\`;`)
  await db.run(sql`DROP TABLE \`provinces_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_provinces_rels\` RENAME TO \`provinces_rels\`;`)
  await db.run(sql`CREATE INDEX \`provinces_rels_order_idx\` ON \`provinces_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_parent_idx\` ON \`provinces_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_path_idx\` ON \`provinces_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_admins_id_idx\` ON \`provinces_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__provinces_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_provinces_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__provinces_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_provinces_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_provinces_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__provinces_v_rels\` RENAME TO \`_provinces_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_order_idx\` ON \`_provinces_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_parent_idx\` ON \`_provinces_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_path_idx\` ON \`_provinces_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_admins_id_idx\` ON \`_provinces_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_culture_cards_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_culture_cards_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`culture_cards_rels\`;`)
  await db.run(sql`DROP TABLE \`culture_cards_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_culture_cards_rels\` RENAME TO \`culture_cards_rels\`;`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_order_idx\` ON \`culture_cards_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_parent_idx\` ON \`culture_cards_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_path_idx\` ON \`culture_cards_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_admins_id_idx\` ON \`culture_cards_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__culture_cards_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_culture_cards_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__culture_cards_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_culture_cards_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_culture_cards_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__culture_cards_v_rels\` RENAME TO \`_culture_cards_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_order_idx\` ON \`_culture_cards_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_parent_idx\` ON \`_culture_cards_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_path_idx\` ON \`_culture_cards_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_admins_id_idx\` ON \`_culture_cards_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_quiz_questions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_quiz_questions_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`quiz_questions_rels\`;`)
  await db.run(sql`DROP TABLE \`quiz_questions_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_quiz_questions_rels\` RENAME TO \`quiz_questions_rels\`;`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_order_idx\` ON \`quiz_questions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_parent_idx\` ON \`quiz_questions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_path_idx\` ON \`quiz_questions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_admins_id_idx\` ON \`quiz_questions_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__quiz_questions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_quiz_questions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__quiz_questions_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_quiz_questions_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_quiz_questions_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__quiz_questions_v_rels\` RENAME TO \`_quiz_questions_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_order_idx\` ON \`_quiz_questions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_parent_idx\` ON \`_quiz_questions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_path_idx\` ON \`_quiz_questions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_admins_id_idx\` ON \`_quiz_questions_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_culture_entries_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_culture_entries_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`culture_entries_rels\`;`)
  await db.run(sql`DROP TABLE \`culture_entries_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_culture_entries_rels\` RENAME TO \`culture_entries_rels\`;`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_order_idx\` ON \`culture_entries_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_parent_idx\` ON \`culture_entries_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_path_idx\` ON \`culture_entries_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_admins_id_idx\` ON \`culture_entries_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__culture_entries_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_culture_entries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__culture_entries_v_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`_culture_entries_v_rels\`;`)
  await db.run(sql`DROP TABLE \`_culture_entries_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__culture_entries_v_rels\` RENAME TO \`_culture_entries_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_order_idx\` ON \`_culture_entries_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_parent_idx\` ON \`_culture_entries_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_path_idx\` ON \`_culture_entries_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_admins_id_idx\` ON \`_culture_entries_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	\`media_id\` integer,
  	\`folders_id\` integer,
  	\`tags_id\` integer,
  	\`provinces_id\` integer,
  	\`culture_cards_id\` integer,
  	\`quiz_questions_id\` integer,
  	\`culture_entries_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`provinces_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`culture_cards_id\`) REFERENCES \`culture_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`quiz_questions_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`culture_entries_id\`) REFERENCES \`culture_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "media_id", "folders_id", "tags_id", "provinces_id", "culture_cards_id", "quiz_questions_id", "culture_entries_id") SELECT "id", "order", "parent_id", "path", "admins_id", "media_id", "folders_id", "tags_id", "provinces_id", "culture_cards_id", "quiz_questions_id", "culture_entries_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_admins_id_idx\` ON \`payload_locked_documents_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`folders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_provinces_id_idx\` ON \`payload_locked_documents_rels\` (\`provinces_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_culture_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`culture_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_quiz_questions_id_idx\` ON \`payload_locked_documents_rels\` (\`quiz_questions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_culture_entries_id_idx\` ON \`payload_locked_documents_rels\` (\`culture_entries_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_preferences_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_preferences_rels\` RENAME TO \`payload_preferences_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_admins_id_idx\` ON \`payload_preferences_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_llm_instructions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_llm_instructions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_llm_instructions_rels\`("id", "order", "parent_id", "path", "admins_id") SELECT "id", "order", "parent_id", "path", "admins_id" FROM \`payload_llm_instructions_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_llm_instructions_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_llm_instructions_rels\` RENAME TO \`payload_llm_instructions_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_order_idx\` ON \`payload_llm_instructions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_parent_idx\` ON \`payload_llm_instructions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_path_idx\` ON \`payload_llm_instructions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_admins_id_idx\` ON \`payload_llm_instructions_rels\` (\`admins_id\`);`)
}
