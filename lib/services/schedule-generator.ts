import { db } from '../db';
import { 
  schedules, 
  courses, 
  subjects, 
  teachers, 
  classrooms, 
  levels, 
  teacherSubjects,
  subjectLevelRestrictions,
  scheduleConflicts
} from '../db/schema';
import { eq, and, or, lt, gt, count, sql } from 'drizzle-orm';

export interface ScheduleConstraints {
  maxHoursPerDay: number;
  minHoursPerWeek: number;
  maxHoursPerWeek: number;
  breakDuration: number;
  classDuration: number;
}

export interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export class ScheduleGenerator {
  private constraints: ScheduleConstraints;
  private academicYear: string;

  constructor(academicYear: string, constraints: ScheduleConstraints) {
    this.academicYear = academicYear;
    this.constraints = constraints;
  }

  // Generar horario para un curso específico
  async generateCourseSchedule(courseId: number): Promise<any[]> {
    try {
      // Obtener información del curso
      const course = await db
        .select({
          id: courses.id,
          name: courses.name,
          levelId: courses.levelId,
          classroomId: courses.classroomId,
          requiredHoursPerWeek: courses.requiredHoursPerWeek,
          levelName: levels.name,
          levelRequiredHours: levels.requiredHoursPerWeek,
          levelMaxHoursPerDay: levels.maxHoursPerDay,
          levelBreakStart: levels.breakStartTime,
          levelBreakEnd: levels.breakEndTime,
        })
        .from(courses)
        .leftJoin(levels, eq(courses.levelId, levels.id))
        .where(eq(courses.id, courseId))
        .limit(1);

      if (!course[0]) {
        throw new Error('Curso no encontrado');
      }

      const courseInfo = course[0];

      // Obtener materias disponibles para el nivel
      const availableSubjects = await db
        .select({
          id: subjects.id,
          name: subjects.name,
          maxHoursPerWeek: subjectLevelRestrictions.maxHoursPerWeek,
          isRequired: subjectLevelRestrictions.isRequired,
        })
        .from(subjectLevelRestrictions)
        .leftJoin(subjects, eq(subjectLevelRestrictions.subjectId, subjects.id))
        .where(eq(subjectLevelRestrictions.levelId, courseInfo.levelId));

      // Obtener profesores disponibles para cada materia
      const teacherAssignments = await this.getAvailableTeachers(availableSubjects, courseInfo.levelId);

      // Generar slots de horario
      const scheduleSlots = this.generateScheduleSlots(courseInfo);

      // Asignar materias a slots
      const schedule = await this.assignSubjectsToSlots(
        courseInfo,
        availableSubjects,
        teacherAssignments,
        scheduleSlots
      );

      return schedule;
    } catch (error) {
      console.error('Error generando horario:', error);
      throw error;
    }
  }

  // Obtener profesores disponibles para cada materia
  private async getAvailableTeachers(subjects: any[], levelId: number) {
    const teacherAssignments: any[] = [];

    for (const subject of subjects) {
      const teachers = await db
        .select({
          id: teachers.id,
          firstName: teachers.firstName,
          lastName: teachers.lastName,
          maxHoursPerWeek: teachers.maxHoursPerWeek,
          minHoursPerWeek: teachers.minHoursPerWeek,
          maxHoursPerDay: teachers.maxHoursPerDay,
        })
        .from(teacherSubjects)
        .leftJoin(teachers, eq(teacherSubjects.teacherId, teachers.id))
        .where(
          and(
            eq(teacherSubjects.subjectId, subject.id),
            eq(teachers.isActive, true),
            sql`${teacherSubjects.allowedLevels}::jsonb @> '[${levelId}]'::jsonb`
          )
        );

      if (teachers.length > 0) {
        teacherAssignments.push({
          subjectId: subject.id,
          subjectName: subject.name,
          teachers: teachers,
        });
      }
    }

    return teacherAssignments;
  }

  // Generar slots de horario para un curso
  private generateScheduleSlots(courseInfo: any): ScheduleSlot[] {
    const slots: ScheduleSlot[] = [];
    const daysOfWeek = [1, 2, 3, 4, 5]; // Lunes a Viernes
    const startHour = 8; // 8:00 AM
    const endHour = 14; // 2:00 PM

    for (const day of daysOfWeek) {
      let currentHour = startHour;
      
      while (currentHour < endHour) {
        // Verificar si es hora de descanso
        const isBreak = this.isBreakTime(currentHour, courseInfo.levelBreakStart, courseInfo.levelBreakEnd);
        
        if (isBreak) {
          slots.push({
            dayOfWeek: day,
            startTime: `${currentHour.toString().padStart(2, '0')}:00:00`,
            endTime: `${currentHour.toString().padStart(2, '0')}:10:00`,
            isBreak: true,
          });
          currentHour += 1; // Avanzar 1 hora después del descanso
        } else {
          slots.push({
            dayOfWeek: day,
            startTime: `${currentHour.toString().padStart(2, '0')}:00:00`,
            endTime: `${(currentHour + 1).toString().padStart(2, '0')}:00:00`,
            isBreak: false,
          });
          currentHour += 1;
        }
      }
    }

    return slots;
  }

  // Verificar si es hora de descanso
  private isBreakTime(hour: number, breakStart: string, breakEnd: string): boolean {
    if (!breakStart || !breakEnd) return false;
    
    const breakStartHour = parseInt(breakStart.split(':')[0]);
    const breakEndHour = parseInt(breakEnd.split(':')[0]);
    
    return hour >= breakStartHour && hour < breakEndHour;
  }

  // Asignar materias a slots de horario
  private async assignSubjectsToSlots(
    courseInfo: any,
    subjects: any[],
    teacherAssignments: any[],
    slots: ScheduleSlot[]
  ): Promise<any[]> {
    const schedule: any[] = [];
    const subjectHours: { [key: number]: number } = {};
    const teacherHours: { [key: number]: number } = {};

    // Inicializar contadores
    subjects.forEach(subject => {
      subjectHours[subject.id] = 0;
    });

    teacherAssignments.forEach(assignment => {
      assignment.teachers.forEach((teacher: any) => {
        teacherHours[teacher.id] = 0;
      });
    });

    // Filtrar slots que no son descanso
    const classSlots = slots.filter(slot => !slot.isBreak);

    // Asignar materias requeridas primero
    const requiredSubjects = subjects.filter(subject => subject.isRequired);
    const optionalSubjects = subjects.filter(subject => !subject.isRequired);

    // Asignar materias requeridas
    for (const subject of requiredSubjects) {
      const maxHours = Math.min(subject.maxHoursPerWeek, 4); // Máximo 4 horas por semana
      let assignedHours = 0;

      while (assignedHours < maxHours && classSlots.length > 0) {
        const slot = classSlots.shift();
        if (!slot) break;

        const teacher = this.selectBestTeacher(teacherAssignments, subject.id, teacherHours, slot.dayOfWeek);
        if (!teacher) continue;

        schedule.push({
          courseId: courseInfo.id,
          subjectId: subject.id,
          teacherId: teacher.id,
          classroomId: courseInfo.classroomId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          academicYear: this.academicYear,
          isBreak: false,
        });

        subjectHours[subject.id]++;
        teacherHours[teacher.id]++;
        assignedHours++;
      }
    }

    // Asignar materias opcionales si hay slots disponibles
    for (const subject of optionalSubjects) {
      const maxHours = Math.min(subject.maxHoursPerWeek, 4);
      let assignedHours = 0;

      while (assignedHours < maxHours && classSlots.length > 0) {
        const slot = classSlots.shift();
        if (!slot) break;

        const teacher = this.selectBestTeacher(teacherAssignments, subject.id, teacherHours, slot.dayOfWeek);
        if (!teacher) continue;

        schedule.push({
          courseId: courseInfo.id,
          subjectId: subject.id,
          teacherId: teacher.id,
          classroomId: courseInfo.classroomId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          academicYear: this.academicYear,
          isBreak: false,
        });

        subjectHours[subject.id]++;
        teacherHours[teacher.id]++;
        assignedHours++;
      }
    }

    // Agregar slots de descanso
    const breakSlots = slots.filter(slot => slot.isBreak);
    for (const slot of breakSlots) {
      schedule.push({
        courseId: courseInfo.id,
        subjectId: null,
        teacherId: null,
        classroomId: courseInfo.classroomId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        academicYear: this.academicYear,
        isBreak: true,
      });
    }

    return schedule;
  }

  // Seleccionar el mejor profesor para una materia y horario
  private selectBestTeacher(
    teacherAssignments: any[],
    subjectId: number,
    teacherHours: { [key: number]: number },
    dayOfWeek: number
  ): any | null {
    const assignment = teacherAssignments.find(a => a.subjectId === subjectId);
    if (!assignment) return null;

    // Filtrar profesores que no excedan sus límites
    const availableTeachers = assignment.teachers.filter((teacher: any) => {
      const dailyHours = this.getTeacherDailyHours(teacher.id, dayOfWeek);
      const weeklyHours = teacherHours[teacher.id] || 0;
      
      return dailyHours < teacher.maxHoursPerDay && 
             weeklyHours < teacher.maxHoursPerWeek;
    });

    if (availableTeachers.length === 0) return null;

    // Seleccionar el profesor con menos horas asignadas
    return availableTeachers.reduce((best: any, current: any) => {
      const bestHours = teacherHours[best.id] || 0;
      const currentHours = teacherHours[current.id] || 0;
      return currentHours < bestHours ? current : best;
    });
  }

  // Obtener horas diarias de un profesor
  private async getTeacherDailyHours(teacherId: number, dayOfWeek: number): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(schedules)
      .where(
        and(
          eq(schedules.teacherId, teacherId),
          eq(schedules.dayOfWeek, dayOfWeek),
          eq(schedules.academicYear, this.academicYear),
          eq(schedules.isActive, true)
        )
      );

    return result[0]?.count || 0;
  }

  // Validar restricciones de descanso entre niveles
  async validateBreakConflicts(courseId: number): Promise<any[]> {
    const course = await db
      .select({
        id: courses.id,
        levelId: courses.levelId,
        levelName: levels.name,
        levelBreakStart: levels.breakStartTime,
        levelBreakEnd: levels.breakEndTime,
      })
      .from(courses)
      .leftJoin(levels, eq(courses.levelId, levels.id))
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course[0]) return [];

    const courseInfo = course[0];
    const conflicts: any[] = [];

    // Obtener todos los cursos con horarios de descanso diferentes
    const otherCourses = await db
      .select({
        id: courses.id,
        name: courses.name,
        levelId: courses.levelId,
        levelName: levels.name,
        levelBreakStart: levels.breakStartTime,
        levelBreakEnd: levels.breakEndTime,
      })
      .from(courses)
      .leftJoin(levels, eq(courses.levelId, levels.id))
      .where(
        and(
          eq(courses.isActive, true),
          eq(courses.academicYear, this.academicYear),
          sql`${courses.id} != ${courseId}`
        )
      );

    for (const otherCourse of otherCourses) {
      if (this.hasBreakConflict(courseInfo, otherCourse)) {
        conflicts.push({
          courseId: courseInfo.id,
          courseName: courseInfo.levelName,
          conflictingCourseId: otherCourse.id,
          conflictingCourseName: otherCourse.name,
          conflictType: 'break_overlap',
          description: `Los descansos de ${courseInfo.levelName} y ${otherCourse.levelName} se solapan`,
        });
      }
    }

    return conflicts;
  }

  // Verificar si hay conflicto de descansos
  private hasBreakConflict(course1: any, course2: any): boolean {
    if (!course1.levelBreakStart || !course1.levelBreakEnd || 
        !course2.levelBreakStart || !course2.levelBreakEnd) {
      return false;
    }

    const start1 = course1.levelBreakStart;
    const end1 = course1.levelBreakEnd;
    const start2 = course2.levelBreakStart;
    const end2 = course2.levelBreakEnd;

    // Verificar si los horarios se solapan
    return (start1 < end2 && start2 < end1);
  }

  // Guardar horario generado en la base de datos
  async saveSchedule(scheduleData: any[]): Promise<any[]> {
    try {
      const savedSchedules = await db.insert(schedules).values(scheduleData).returning();
      
      // Verificar y registrar conflictos
      await this.checkAndRecordConflicts(savedSchedules);
      
      return savedSchedules;
    } catch (error) {
      console.error('Error guardando horario:', error);
      throw error;
    }
  }

  // Verificar y registrar conflictos
  private async checkAndRecordConflicts(schedules: any[]): Promise<void> {
    for (const schedule of schedules) {
      if (schedule.isBreak) continue;

      // Verificar conflictos de profesor
      const teacherConflicts = await this.checkTeacherConflicts(schedule);
      if (teacherConflicts.length > 0) {
        await this.recordConflicts(schedule.id, teacherConflicts);
      }

      // Verificar conflictos de salón
      const classroomConflicts = await this.checkClassroomConflicts(schedule);
      if (classroomConflicts.length > 0) {
        await this.recordConflicts(schedule.id, classroomConflicts);
      }
    }
  }

  // Verificar conflictos de profesor
  private async checkTeacherConflicts(schedule: any): Promise<any[]> {
    const conflicts = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.teacherId, schedule.teacherId),
          eq(schedules.dayOfWeek, schedule.dayOfWeek),
          eq(schedules.academicYear, schedule.academicYear),
          eq(schedules.isActive, true),
          sql`${schedules.id} != ${schedule.id}`,
          or(
            and(
              sql`${schedules.startTime} < ${schedule.endTime}`,
              sql`${schedules.endTime} > ${schedule.startTime}`
            )
          )
        )
      );

    return conflicts.map(conflict => ({
      conflictType: 'teacher_overlap',
      conflictDescription: `El profesor ya tiene clase en este horario`,
      severity: 'error',
    }));
  }

  // Verificar conflictos de salón
  private async checkClassroomConflicts(schedule: any): Promise<any[]> {
    const conflicts = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.classroomId, schedule.classroomId),
          eq(schedules.dayOfWeek, schedule.dayOfWeek),
          eq(schedules.academicYear, schedule.academicYear),
          eq(schedules.isActive, true),
          sql`${schedules.id} != ${schedule.id}`,
          or(
            and(
              sql`${schedules.startTime} < ${schedule.endTime}`,
              sql`${schedules.endTime} > ${schedule.startTime}`
            )
          )
        )
      );

    return conflicts.map(conflict => ({
      conflictType: 'classroom_overlap',
      conflictDescription: `El salón ya está ocupado en este horario`,
      severity: 'error',
    }));
  }

  // Registrar conflictos en la base de datos
  private async recordConflicts(scheduleId: number, conflicts: any[]): Promise<void> {
    for (const conflict of conflicts) {
      await db.insert(scheduleConflicts).values({
        scheduleId,
        conflictType: conflict.conflictType,
        conflictDescription: conflict.conflictDescription,
        severity: conflict.severity,
      });
    }
  }
}
