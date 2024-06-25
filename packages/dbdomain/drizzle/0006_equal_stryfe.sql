ALTER TABLE "traces" RENAME COLUMN "cast" TO "cast_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_traces_cast";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_traces_cast" ON "traces" ("cast_id");