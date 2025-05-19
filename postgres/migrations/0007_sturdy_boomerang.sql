ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "telegram_logs" ALTER COLUMN "forwarded" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "telegram_messages" ALTER COLUMN "processed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "access_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");