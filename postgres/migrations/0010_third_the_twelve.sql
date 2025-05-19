ALTER TABLE "categories" ADD COLUMN "type" text DEFAULT 'pdf' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_audio_cat_idx" ON "user_audio_access" USING btree ("user_id","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_pdf_cat_idx" ON "user_pdf_access" USING btree ("user_id","category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_video_cat_idx" ON "user_video_access" USING btree ("user_id","category_id");