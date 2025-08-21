CREATE TABLE IF NOT EXISTS "subject_level_restrictions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer,
	"level_id" integer,
	"max_hours_per_week" integer DEFAULT 4,
	"is_required" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "levels" ADD COLUMN "required_hours_per_week" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "levels" ADD COLUMN "max_hours_per_day" integer DEFAULT 6 NOT NULL;--> statement-breakpoint
ALTER TABLE "levels" ADD COLUMN "break_start_time" time;--> statement-breakpoint
ALTER TABLE "levels" ADD COLUMN "break_end_time" time;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "is_break" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "max_hours_per_week" integer DEFAULT 4;--> statement-breakpoint
ALTER TABLE "teacher_subjects" ADD COLUMN "allowed_levels" text;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "max_hours_per_day" integer DEFAULT 4;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_subject_level" ON "subject_level_restrictions" ("subject_id","level_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subject_level_restrictions" ADD CONSTRAINT "subject_level_restrictions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subject_level_restrictions" ADD CONSTRAINT "subject_level_restrictions_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
