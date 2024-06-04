CREATE TABLE IF NOT EXISTS "commissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"flow_id" uuid NOT NULL,
	"payment_id" integer NOT NULL,
	"fid" integer NOT NULL,
	"commission" integer NOT NULL,
	"created_at" bigint NOT NULL,
	"withdrawn_tx" text,
	"withdrawn_at" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"cover" text NOT NULL,
	"input" jsonb NOT NULL,
	"creator" integer NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trace_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"trace" integer NOT NULL,
	"amount" integer NOT NULL,
	"payment_tx" text NOT NULL,
	"payment_ts" bigint,
	"commission_paid" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "traces" (
	"id" serial PRIMARY KEY NOT NULL,
	"cast" text NOT NULL,
	"flow_id" uuid NOT NULL,
	"parent_cast" text,
	"caster" integer NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commissions_flow" ON "commissions" ("flow_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commissions_fid" ON "commissions" ("fid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commissions_payment" ON "commissions" ("payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_flow_name" ON "flows" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_flow_creator" ON "flows" ("creator");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tp_trace" ON "trace_payments" ("trace");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_traces_flow" ON "traces" ("flow_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_traces_cast" ON "traces" ("cast");