CREATE TABLE `commissions` (
	`id` integer PRIMARY KEY NOT NULL,
	`flow_id` integer NOT NULL,
	`fid` integer NOT NULL,
	`commission` integer NOT NULL,
	`created_at` integer NOT NULL,
	`withdrawn_tx` text,
	`withdrawn_at` integer
);
--> statement-breakpoint
CREATE TABLE `flows` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cover` text NOT NULL,
	`input` blob,
	`creator` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trace_payments` (
	`id` integer PRIMARY KEY NOT NULL,
	`trace` text,
	`payment_tx` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `traces` (
	`id` integer PRIMARY KEY NOT NULL,
	`cast` text,
	`flow_id` integer NOT NULL,
	`parent_cast` integer,
	`caster` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_commissions_flow` ON `commissions` (`flow_id`);--> statement-breakpoint
CREATE INDEX `idx_commissions_fid` ON `commissions` (`fid`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_flow_name` ON `flows` (`name`);--> statement-breakpoint
CREATE INDEX `idx_flow_creator` ON `flows` (`creator`);--> statement-breakpoint
CREATE INDEX `idx_tp_trace` ON `trace_payments` (`trace`);--> statement-breakpoint
CREATE INDEX `idx_traces_flow` ON `traces` (`flow_id`);--> statement-breakpoint
CREATE INDEX `idx_traces_cast` ON `traces` (`cast`);