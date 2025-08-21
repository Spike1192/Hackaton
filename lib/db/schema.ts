import { pgTable, serial, varchar, text, integer, boolean, timestamp, time, date, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabla de niveles educativos
export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  requiredHoursPerWeek: integer('required_hours_per_week').notNull().default(30),
  maxHoursPerDay: integer('max_hours_per_day').notNull().default(6),
  breakStartTime: time('break_start_time'),
  breakEndTime: time('break_end_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla de materias/subjects
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).unique(),
  description: text('description'),
  hoursPerWeek: integer('hours_per_week').default(0),
  maxHoursPerWeek: integer('max_hours_per_week').default(4), // Máximo 4 horas por semana por curso
  color: varchar('color', { length: 7 }).default('#3B82F6'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla de profesores
export const teachers = pgTable('teachers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  identificationNumber: varchar('identification_number', { length: 20 }).unique(),
  hireDate: date('hire_date'),
  maxHoursPerWeek: integer('max_hours_per_week').default(40),
  minHoursPerWeek: integer('min_hours_per_week').default(20),
  maxHoursPerDay: integer('max_hours_per_day').default(4), // Máximo 4 horas por día
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('teachers_email_idx').on(table.email),
  activeIdx: index('teachers_active_idx').on(table.isActive),
}));

// Tabla de salones/classrooms
export const classrooms = pgTable('classrooms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  floor: integer('floor').default(1),
  capacity: integer('capacity').default(30),
  building: varchar('building', { length: 50 }).default('Principal'),
  roomType: varchar('room_type', { length: 50 }).default('Regular'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  activeIdx: index('classrooms_active_idx').on(table.isActive),
}));

// Tabla de cursos
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  levelId: integer('level_id').references(() => levels.id),
  classroomId: integer('classroom_id').references(() => classrooms.id),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  totalStudents: integer('total_students').default(0),
  requiredHoursPerWeek: integer('required_hours_per_week').default(30),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  activeIdx: index('courses_active_idx').on(table.isActive),
  academicYearIdx: index('courses_academic_year_idx').on(table.academicYear),
}));

// Tabla de estudiantes
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  identificationNumber: varchar('identification_number', { length: 20 }).unique(),
  birthDate: date('birth_date'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  emergencyPhone: varchar('emergency_phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relación profesor-materia con niveles permitidos
export const teacherSubjects = pgTable('teacher_subjects', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  allowedLevels: text('allowed_levels'), // JSON array de IDs de niveles permitidos
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueTeacherSubject: uniqueIndex('unique_teacher_subject').on(table.teacherId, table.subjectId),
}));

// Relación curso-estudiante
export const courseStudents = pgTable('course_students', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  enrollmentDate: date('enrollment_date').defaultNow(),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  uniqueCourseStudent: uniqueIndex('unique_course_student').on(table.courseId, table.studentId),
}));

// Tabla principal de horarios
export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  subjectId: integer('subject_id').references(() => subjects.id),
  teacherId: integer('teacher_id').references(() => teachers.id),
  classroomId: integer('classroom_id').references(() => classrooms.id),
  dayOfWeek: integer('day_of_week').notNull(), // 1=Lunes, 7=Domingo
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  academicYear: varchar('academic_year', { length: 9 }).notNull(),
  semester: varchar('semester', { length: 20 }).default('Primer Semestre'),
  isBreak: boolean('is_break').default(false), // Indica si es un descanso
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  courseIdx: index('schedules_course_idx').on(table.courseId),
  teacherIdx: index('schedules_teacher_idx').on(table.teacherId),
  classroomIdx: index('schedules_classroom_idx').on(table.classroomId),
  dayTimeIdx: index('schedules_day_time_idx').on(table.dayOfWeek, table.startTime, table.endTime),
  academicYearIdx: index('schedules_academic_year_idx').on(table.academicYear),
  uniqueScheduleSlot: uniqueIndex('unique_schedule_slot').on(
    table.classroomId, 
    table.dayOfWeek, 
    table.startTime, 
    table.endTime, 
    table.academicYear
  ),
}));

// Tabla de conflictos de horarios
export const scheduleConflicts = pgTable('schedule_conflicts', {
  id: serial('id').primaryKey(),
  scheduleId: integer('schedule_id').references(() => schedules.id, { onDelete: 'cascade' }),
  conflictType: varchar('conflict_type', { length: 50 }).notNull(),
  conflictDescription: text('conflict_description').notNull(),
  severity: varchar('severity', { length: 20 }).default('warning'),
  isResolved: boolean('is_resolved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

// Tabla de configuración del sistema
export const systemConfig = pgTable('system_config', {
  id: serial('id').primaryKey(),
  configKey: varchar('config_key', { length: 100 }).notNull().unique(),
  configValue: text('config_value'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Tabla para restricciones de materias por nivel
export const subjectLevelRestrictions = pgTable('subject_level_restrictions', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
  levelId: integer('level_id').references(() => levels.id, { onDelete: 'cascade' }),
  maxHoursPerWeek: integer('max_hours_per_week').default(4),
  isRequired: boolean('is_required').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueSubjectLevel: uniqueIndex('unique_subject_level').on(table.subjectId, table.levelId),
}));

// Relaciones
export const levelsRelations = relations(levels, ({ many }) => ({
  courses: many(courses),
  subjectRestrictions: many(subjectLevelRestrictions),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  teacherSubjects: many(teacherSubjects),
  schedules: many(schedules),
  levelRestrictions: many(subjectLevelRestrictions),
}));

export const teachersRelations = relations(teachers, ({ many }) => ({
  teacherSubjects: many(teacherSubjects),
  schedules: many(schedules),
}));

export const classroomsRelations = relations(classrooms, ({ many }) => ({
  courses: many(courses),
  schedules: many(schedules),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  level: one(levels, {
    fields: [courses.levelId],
    references: [levels.id],
  }),
  classroom: one(classrooms, {
    fields: [courses.classroomId],
    references: [classrooms.id],
  }),
  courseStudents: many(courseStudents),
  schedules: many(schedules),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  courseStudents: many(courseStudents),
}));

export const teacherSubjectsRelations = relations(teacherSubjects, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherSubjects.teacherId],
    references: [teachers.id],
  }),
  subject: one(subjects, {
    fields: [teacherSubjects.subjectId],
    references: [subjects.id],
  }),
}));

export const courseStudentsRelations = relations(courseStudents, ({ one }) => ({
  course: one(courses, {
    fields: [courseStudents.courseId],
    references: [courses.id],
  }),
  student: one(students, {
    fields: [courseStudents.studentId],
    references: [students.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  course: one(courses, {
    fields: [schedules.courseId],
    references: [courses.id],
  }),
  subject: one(subjects, {
    fields: [schedules.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [schedules.teacherId],
    references: [teachers.id],
  }),
  classroom: one(classrooms, {
    fields: [schedules.classroomId],
    references: [classrooms.id],
  }),
  conflicts: many(scheduleConflicts),
}));

export const scheduleConflictsRelations = relations(scheduleConflicts, ({ one }) => ({
  schedule: one(schedules, {
    fields: [scheduleConflicts.scheduleId],
    references: [schedules.id],
  }),
}));

export const subjectLevelRestrictionsRelations = relations(subjectLevelRestrictions, ({ one }) => ({
  subject: one(subjects, {
    fields: [subjectLevelRestrictions.subjectId],
    references: [subjects.id],
  }),
  level: one(levels, {
    fields: [subjectLevelRestrictions.levelId],
    references: [levels.id],
  }),
}));
