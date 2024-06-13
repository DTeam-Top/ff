ALTER TABLE "flows" ADD COLUMN "seller" varchar(42) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_flow_seller" ON "flows" ("seller");