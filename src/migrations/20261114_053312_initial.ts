import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`admins_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	\`refresh_count\` numeric,
  	\`refreshed_at\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_sessions_order_idx\` ON \`admins_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`admins_sessions_parent_id_idx\` ON \`admins_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`admins\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
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
  await db.run(sql`CREATE INDEX \`admins_updated_at_idx\` ON \`admins\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`admins_created_at_idx\` ON \`admins\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`admins_email_idx\` ON \`admins\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`admins_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_rels_order_idx\` ON \`admins_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_parent_idx\` ON \`admins_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_path_idx\` ON \`admins_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_admins_id_idx\` ON \`admins_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`_h_folders_id\` integer,
  	\`prefix\` text DEFAULT '',
  	\`_objectkey\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`original_filename\` text,
  	\`original_url\` text,
  	\`original_mime_type\` text,
  	\`original_filesize\` numeric,
  	\`original_width\` numeric,
  	\`original_height\` numeric,
  	\`original_prefix\` text,
  	\`original__objectkey\` text,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`_h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`media__h_folders_idx\` ON \`media\` (\`_h_folders_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_original_original_filename_idx\` ON \`media\` (\`original_filename\`);`)
  await db.run(sql`CREATE TABLE \`media_rels\` (
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
  await db.run(sql`CREATE INDEX \`media_rels_order_idx\` ON \`media_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_parent_idx\` ON \`media_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_path_idx\` ON \`media_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_tags_id_idx\` ON \`media_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_admins_id_idx\` ON \`media_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_media_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_alt\` text NOT NULL,
  	\`version__h_folders_id\` integer,
  	\`version_prefix\` text DEFAULT '',
  	\`version__objectkey\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version_url\` text,
  	\`version_thumbnail_u_r_l\` text,
  	\`version_filename\` text,
  	\`version_mime_type\` text,
  	\`version_filesize\` numeric,
  	\`version_width\` numeric,
  	\`version_height\` numeric,
  	\`version_original_filename\` text,
  	\`version_original_url\` text,
  	\`version_original_mime_type\` text,
  	\`version_original_filesize\` numeric,
  	\`version_original_width\` numeric,
  	\`version_original_height\` numeric,
  	\`version_original_prefix\` text,
  	\`version_original__objectkey\` text,
  	\`version_focal_x\` numeric,
  	\`version_focal_y\` numeric,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version__h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_media_v_parent_idx\` ON \`_media_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_version_version__h_folders_idx\` ON \`_media_v\` (\`version__h_folders_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_version_version_updated_at_idx\` ON \`_media_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_version_version_created_at_idx\` ON \`_media_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_version_version_filename_idx\` ON \`_media_v\` (\`version_filename\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_version_original_version_original_filename_idx\` ON \`_media_v\` (\`version_original_filename\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_created_at_idx\` ON \`_media_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_updated_at_idx\` ON \`_media_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_media_v_rels\` (
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
  await db.run(sql`CREATE INDEX \`_media_v_rels_order_idx\` ON \`_media_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_parent_idx\` ON \`_media_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_path_idx\` ON \`_media_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_tags_id_idx\` ON \`_media_v_rels\` (\`tags_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_admins_id_idx\` ON \`_media_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`folders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_h_folders_id\` integer,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`_h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`folders__h_folders_idx\` ON \`folders\` (\`_h_folders_id\`);`)
  await db.run(sql`CREATE INDEX \`folders_updated_at_idx\` ON \`folders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`folders_created_at_idx\` ON \`folders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`folders_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`folders_rels_order_idx\` ON \`folders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_parent_idx\` ON \`folders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_path_idx\` ON \`folders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_admins_id_idx\` ON \`folders_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_folders_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__h_folders_id\` integer,
  	\`version_name\` text NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version__h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_folders_v_parent_idx\` ON \`_folders_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_version_version__h_folders_idx\` ON \`_folders_v\` (\`version__h_folders_id\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_version_version_updated_at_idx\` ON \`_folders_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_version_version_created_at_idx\` ON \`_folders_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_created_at_idx\` ON \`_folders_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_updated_at_idx\` ON \`_folders_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_folders_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_folders_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_order_idx\` ON \`_folders_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_parent_idx\` ON \`_folders_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_path_idx\` ON \`_folders_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_admins_id_idx\` ON \`_folders_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_h_tags_id\` integer,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`_h_tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tags__h_tags_idx\` ON \`tags\` (\`_h_tags_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_updated_at_idx\` ON \`tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tags_created_at_idx\` ON \`tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tags_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tags_rels_order_idx\` ON \`tags_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_parent_idx\` ON \`tags_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_path_idx\` ON \`tags_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_admins_id_idx\` ON \`tags_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_tags_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__h_tags_id\` integer,
  	\`version_name\` text NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version__h_tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tags_v_parent_idx\` ON \`_tags_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_version_version__h_tags_idx\` ON \`_tags_v\` (\`version__h_tags_id\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_version_version_updated_at_idx\` ON \`_tags_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_version_version_created_at_idx\` ON \`_tags_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_created_at_idx\` ON \`_tags_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_updated_at_idx\` ON \`_tags_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_tags_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tags_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_order_idx\` ON \`_tags_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_parent_idx\` ON \`_tags_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_path_idx\` ON \`_tags_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_admins_id_idx\` ON \`_tags_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`provinces\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`island\` text NOT NULL,
  	\`region\` text NOT NULL,
  	\`map_x\` numeric NOT NULL,
  	\`map_y\` numeric NOT NULL,
  	\`tone\` text NOT NULL,
  	\`status\` text DEFAULT 'open' NOT NULL,
  	\`score\` numeric,
  	\`intro\` text NOT NULL,
  	\`order\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`provinces_slug_idx\` ON \`provinces\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`provinces_updated_at_idx\` ON \`provinces\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`provinces_created_at_idx\` ON \`provinces\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`provinces_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`provinces_rels_order_idx\` ON \`provinces_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_parent_idx\` ON \`provinces_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_path_idx\` ON \`provinces_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`provinces_rels_admins_id_idx\` ON \`provinces_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_provinces_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text NOT NULL,
  	\`version_name\` text NOT NULL,
  	\`version_island\` text NOT NULL,
  	\`version_region\` text NOT NULL,
  	\`version_map_x\` numeric NOT NULL,
  	\`version_map_y\` numeric NOT NULL,
  	\`version_tone\` text NOT NULL,
  	\`version_status\` text DEFAULT 'open' NOT NULL,
  	\`version_score\` numeric,
  	\`version_intro\` text NOT NULL,
  	\`version_order\` numeric NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_provinces_v_parent_idx\` ON \`_provinces_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_version_version_slug_idx\` ON \`_provinces_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_version_version_updated_at_idx\` ON \`_provinces_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_version_version_created_at_idx\` ON \`_provinces_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_created_at_idx\` ON \`_provinces_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_updated_at_idx\` ON \`_provinces_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_provinces_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_provinces_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_order_idx\` ON \`_provinces_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_parent_idx\` ON \`_provinces_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_path_idx\` ON \`_provinces_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_provinces_v_rels_admins_id_idx\` ON \`_provinces_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`culture_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`province_id\` integer NOT NULL,
  	\`label\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`source\` text NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`credit\` text NOT NULL,
  	\`order\` numeric NOT NULL,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`culture_cards_province_idx\` ON \`culture_cards\` (\`province_id\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_image_idx\` ON \`culture_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`culture_cards_slug_idx\` ON \`culture_cards\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_updated_at_idx\` ON \`culture_cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_created_at_idx\` ON \`culture_cards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`culture_cards_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_order_idx\` ON \`culture_cards_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_parent_idx\` ON \`culture_cards_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_path_idx\` ON \`culture_cards_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`culture_cards_rels_admins_id_idx\` ON \`culture_cards_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_culture_cards_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_province_id\` integer NOT NULL,
  	\`version_label\` text NOT NULL,
  	\`version_title\` text NOT NULL,
  	\`version_text\` text NOT NULL,
  	\`version_source\` text NOT NULL,
  	\`version_image_id\` integer NOT NULL,
  	\`version_credit\` text NOT NULL,
  	\`version_order\` numeric NOT NULL,
  	\`version_slug\` text NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_cards\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_province_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_parent_idx\` ON \`_culture_cards_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_version_version_province_idx\` ON \`_culture_cards_v\` (\`version_province_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_version_version_image_idx\` ON \`_culture_cards_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_version_version_slug_idx\` ON \`_culture_cards_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_version_version_updated_at_idx\` ON \`_culture_cards_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_version_version_created_at_idx\` ON \`_culture_cards_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_created_at_idx\` ON \`_culture_cards_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_updated_at_idx\` ON \`_culture_cards_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_culture_cards_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_culture_cards_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_order_idx\` ON \`_culture_cards_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_parent_idx\` ON \`_culture_cards_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_path_idx\` ON \`_culture_cards_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_culture_cards_v_rels_admins_id_idx\` ON \`_culture_cards_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`quiz_questions_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`quiz_questions_options_order_idx\` ON \`quiz_questions_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_options_parent_id_idx\` ON \`quiz_questions_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`quiz_questions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`province_id\` integer NOT NULL,
  	\`prompt\` text NOT NULL,
  	\`answer\` numeric NOT NULL,
  	\`explanation\` text NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`credit\` text NOT NULL,
  	\`order\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`province_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`quiz_questions_province_idx\` ON \`quiz_questions\` (\`province_id\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_image_idx\` ON \`quiz_questions\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_updated_at_idx\` ON \`quiz_questions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_created_at_idx\` ON \`quiz_questions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`quiz_questions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_order_idx\` ON \`quiz_questions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_parent_idx\` ON \`quiz_questions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_path_idx\` ON \`quiz_questions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`quiz_questions_rels_admins_id_idx\` ON \`quiz_questions_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_quiz_questions_v_version_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_quiz_questions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_options_order_idx\` ON \`_quiz_questions_v_version_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_options_parent_id_idx\` ON \`_quiz_questions_v_version_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_quiz_questions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_province_id\` integer NOT NULL,
  	\`version_prompt\` text NOT NULL,
  	\`version_answer\` numeric NOT NULL,
  	\`version_explanation\` text NOT NULL,
  	\`version_image_id\` integer NOT NULL,
  	\`version_credit\` text NOT NULL,
  	\`version_order\` numeric NOT NULL,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`quiz_questions\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_province_id\`) REFERENCES \`provinces\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_parent_idx\` ON \`_quiz_questions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_version_province_idx\` ON \`_quiz_questions_v\` (\`version_province_id\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_version_image_idx\` ON \`_quiz_questions_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_version_updated_at_idx\` ON \`_quiz_questions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_version_version_created_at_idx\` ON \`_quiz_questions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_created_at_idx\` ON \`_quiz_questions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_updated_at_idx\` ON \`_quiz_questions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_quiz_questions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_quiz_questions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_order_idx\` ON \`_quiz_questions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_parent_idx\` ON \`_quiz_questions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_path_idx\` ON \`_quiz_questions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_quiz_questions_v_rels_admins_id_idx\` ON \`_quiz_questions_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`culture_entries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`province\` text,
  	\`category\` text,
  	\`summary\` text,
  	\`image_id\` integer,
  	\`image_attribution\` text,
  	\`source_extract\` text,
  	\`source_title\` text,
  	\`source_u_r_l\` text,
  	\`source_publisher\` text,
  	\`scraped_at\` text,
  	\`verification_notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`culture_entries_slug_idx\` ON \`culture_entries\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_image_idx\` ON \`culture_entries\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`culture_entries_source_u_r_l_idx\` ON \`culture_entries\` (\`source_u_r_l\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_updated_at_idx\` ON \`culture_entries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_created_at_idx\` ON \`culture_entries\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries__status_idx\` ON \`culture_entries\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`culture_entries_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_order_idx\` ON \`culture_entries_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_parent_idx\` ON \`culture_entries_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_path_idx\` ON \`culture_entries_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`culture_entries_rels_admins_id_idx\` ON \`culture_entries_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`_culture_entries_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_province\` text,
  	\`version_category\` text,
  	\`version_summary\` text,
  	\`version_image_id\` integer,
  	\`version_image_attribution\` text,
  	\`version_source_extract\` text,
  	\`version_source_title\` text,
  	\`version_source_u_r_l\` text,
  	\`version_source_publisher\` text,
  	\`version_scraped_at\` text,
  	\`version_verification_notes\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`culture_entries\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_parent_idx\` ON \`_culture_entries_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version_slug_idx\` ON \`_culture_entries_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version_image_idx\` ON \`_culture_entries_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version_source_u_r_l_idx\` ON \`_culture_entries_v\` (\`version_source_u_r_l\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version_updated_at_idx\` ON \`_culture_entries_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version_created_at_idx\` ON \`_culture_entries_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_version_version__status_idx\` ON \`_culture_entries_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_created_at_idx\` ON \`_culture_entries_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_updated_at_idx\` ON \`_culture_entries_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_published_locale_idx\` ON \`_culture_entries_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_latest_idx\` ON \`_culture_entries_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_culture_entries_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_culture_entries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_order_idx\` ON \`_culture_entries_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_parent_idx\` ON \`_culture_entries_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_path_idx\` ON \`_culture_entries_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_culture_entries_v_rels_admins_id_idx\` ON \`_culture_entries_v_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
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
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_admins_id_idx\` ON \`payload_preferences_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_llm_instructions\` (
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`entity_slug\` text NOT NULL,
  	\`entity_type\` text NOT NULL,
  	\`additional_instructions\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_entity_slug_idx\` ON \`payload_llm_instructions\` (\`entity_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_updated_at_idx\` ON \`payload_llm_instructions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_created_at_idx\` ON \`payload_llm_instructions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_llm_instructions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text NOT NULL,
  	\`path\` text NOT NULL,
  	\`admins_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_llm_instructions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_order_idx\` ON \`payload_llm_instructions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_parent_idx\` ON \`payload_llm_instructions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_path_idx\` ON \`payload_llm_instructions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_llm_instructions_rels_admins_id_idx\` ON \`payload_llm_instructions_rels\` (\`admins_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`admins_sessions\`;`)
  await db.run(sql`DROP TABLE \`admins\`;`)
  await db.run(sql`DROP TABLE \`admins_rels\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_rels\`;`)
  await db.run(sql`DROP TABLE \`_media_v\`;`)
  await db.run(sql`DROP TABLE \`_media_v_rels\`;`)
  await db.run(sql`DROP TABLE \`folders\`;`)
  await db.run(sql`DROP TABLE \`folders_rels\`;`)
  await db.run(sql`DROP TABLE \`_folders_v\`;`)
  await db.run(sql`DROP TABLE \`_folders_v_rels\`;`)
  await db.run(sql`DROP TABLE \`tags\`;`)
  await db.run(sql`DROP TABLE \`tags_rels\`;`)
  await db.run(sql`DROP TABLE \`_tags_v\`;`)
  await db.run(sql`DROP TABLE \`_tags_v_rels\`;`)
  await db.run(sql`DROP TABLE \`provinces\`;`)
  await db.run(sql`DROP TABLE \`provinces_rels\`;`)
  await db.run(sql`DROP TABLE \`_provinces_v\`;`)
  await db.run(sql`DROP TABLE \`_provinces_v_rels\`;`)
  await db.run(sql`DROP TABLE \`culture_cards\`;`)
  await db.run(sql`DROP TABLE \`culture_cards_rels\`;`)
  await db.run(sql`DROP TABLE \`_culture_cards_v\`;`)
  await db.run(sql`DROP TABLE \`_culture_cards_v_rels\`;`)
  await db.run(sql`DROP TABLE \`quiz_questions_options\`;`)
  await db.run(sql`DROP TABLE \`quiz_questions\`;`)
  await db.run(sql`DROP TABLE \`quiz_questions_rels\`;`)
  await db.run(sql`DROP TABLE \`_quiz_questions_v_version_options\`;`)
  await db.run(sql`DROP TABLE \`_quiz_questions_v\`;`)
  await db.run(sql`DROP TABLE \`_quiz_questions_v_rels\`;`)
  await db.run(sql`DROP TABLE \`culture_entries\`;`)
  await db.run(sql`DROP TABLE \`culture_entries_rels\`;`)
  await db.run(sql`DROP TABLE \`_culture_entries_v\`;`)
  await db.run(sql`DROP TABLE \`_culture_entries_v_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`payload_llm_instructions\`;`)
  await db.run(sql`DROP TABLE \`payload_llm_instructions_rels\`;`)
}
