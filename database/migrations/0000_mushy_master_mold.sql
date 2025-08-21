CREATE TABLE IF NOT EXISTS "classrooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"floor" integer DEFAULT 1,
	"capacity" integer DEFAULT 30,
	"building" varchar(50) DEFAULT 'Principal',
	"room_type" varchar(50) DEFAULT 'Regular',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "classrooms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_students" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"student_id" integer,
	"enrollment_date" date DEFAULT now(),
	"status" varchar(20) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"level_id" integer,
	"classroom_id" integer,
	"academic_year" varchar(9) NOT NULL,
	"total_students" integer DEFAULT 0,
	"required_hours_per_week" integer DEFAULT 30,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "levels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedule_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_id" integer,
	"conflict_type" varchar(50) NOT NULL,
	"conflict_description" text NOT NULL,
	"severity" varchar(20) DEFAULT 'warning',
	"is_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer,
	"subject_id" integer,
	"teacher_id" integer,
	"classroom_id" integer,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"semester" varchar(20) DEFAULT 'Primer Semestre',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"identification_number" varchar(20),
	"birth_date" date,
	"email" varchar(255),
	"phone" varchar(20),
	"address" text,
	"emergency_contact" varchar(255),
	"emergency_phone" varchar(20),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "students_identification_number_unique" UNIQUE("identification_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20),
	"description" text,
	"hours_per_week" integer DEFAULT 0,
	"color" varchar(7) DEFAULT '#3B82F6',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subjects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_config_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacher_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" integer,
	"subject_id" integer,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"identification_number" varchar(20),
	"hire_date" date,
	"max_hours_per_week" integer DEFAULT 40,
	"min_hours_per_week" integer DEFAULT 20,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "teachers_email_unique" UNIQUE("email"),
	CONSTRAINT "teachers_identification_number_unique" UNIQUE("identification_number")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_classrooms_active" ON "classrooms" ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_course_student" ON "course_students" ("course_id","student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_courses_active" ON "courses" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_courses_academic_year" ON "courses" ("academic_year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_schedules_course" ON "schedules" ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_schedules_teacher" ON "schedules" ("teacher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_schedules_classroom" ON "schedules" ("classroom_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_schedules_day_time" ON "schedules" ("day_of_week","start_time","end_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_schedules_academic_year" ON "schedules" ("academic_year");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_schedule_slot" ON "schedules" ("classroom_id","day_of_week","start_time","end_time","academic_year");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_teacher_subject" ON "teacher_subjects" ("teacher_id","subject_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_teachers_email" ON "teachers" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_teachers_active" ON "teachers" ("is_active");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_students" ADD CONSTRAINT "course_students_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_students" ADD CONSTRAINT "course_students_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_conflicts" ADD CONSTRAINT "schedule_conflicts_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
