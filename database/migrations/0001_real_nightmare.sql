ALTER TABLE "schedules" DROP CONSTRAINT "schedules_subject_id_subjects_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_classrooms_active";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_courses_active";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_courses_academic_year";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_schedules_course";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_schedules_teacher";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_schedules_classroom";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_schedules_day_time";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_schedules_academic_year";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_teachers_email";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_teachers_active";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "classrooms_active_idx" ON "classrooms" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_active_idx" ON "courses" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "courses_academic_year_idx" ON "courses" ("academic_year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_course_idx" ON "schedules" ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_teacher_idx" ON "schedules" ("teacher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_classroom_idx" ON "schedules" ("classroom_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_day_time_idx" ON "schedules" ("day_of_week","start_time","end_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_academic_year_idx" ON "schedules" ("academic_year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teachers_email_idx" ON "teachers" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teachers_active_idx" ON "teachers" ("is_active");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
