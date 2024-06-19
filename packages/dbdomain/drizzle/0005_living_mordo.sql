CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner" integer NOT NULL,
	"api_key" text,
	"disabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_apiKey_owner" ON "api_keys" ("owner");