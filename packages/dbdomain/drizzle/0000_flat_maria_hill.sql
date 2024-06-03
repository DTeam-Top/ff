CREATE TABLE `commissions` (
	`id` integer PRIMARY KEY NOT NULL,
	`flow_id` integer NOT NULL,
	`payment_id` integer NOT NULL,
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
	`input` blob NOT NULL,
	`creator` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trace_payments` (
	`id` integer PRIMARY KEY NOT NULL,
	`trace` integer NOT NULL,
	`amount` integer NOT NULL,
	`payment_tx` text NOT NULL,
	`payment_ts` integer,
	`commission_paid` integer
);
--> statement-breakpoint
CREATE TABLE `traces` (
	`id` integer PRIMARY KEY NOT NULL,
	`cast` text NOT NULL,
	`flow_id` integer NOT NULL,
	`parent_cast` text,
	`caster` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_commissions_flow` ON `commissions` (`flow_id`);--> statement-breakpoint
CREATE INDEX `idx_commissions_fid` ON `commissions` (`fid`);--> statement-breakpoint
CREATE INDEX `idx_commissions_payment` ON `commissions` (`payment_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_flow_name` ON `flows` (`name`);--> statement-breakpoint
CREATE INDEX `idx_flow_creator` ON `flows` (`creator`);--> statement-breakpoint
CREATE INDEX `idx_tp_trace` ON `trace_payments` (`trace`);--> statement-breakpoint
CREATE INDEX `idx_traces_flow` ON `traces` (`flow_id`);--> statement-breakpoint
CREATE INDEX `idx_traces_cast` ON `traces` (`cast`);