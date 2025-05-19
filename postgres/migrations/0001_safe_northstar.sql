CREATE TABLE "telegram_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"forwarded" boolean DEFAULT false,
	"keyword" text,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "telegram_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_settings_key_unique" UNIQUE("key")
);
