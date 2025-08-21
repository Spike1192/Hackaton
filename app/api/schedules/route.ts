import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { schedules, courses, subjects, teachers, classrooms, levels } from '@/lib/db/schema';
import { eq, desc, and, or, lt, gt } from 'drizzle-orm';

// GET /api/schedules - Obtener todos los horarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const academicYear = searchParams.get('academicYear');
    const courseId = searchParams.get('courseId');
    const teacherId = searchParams.get('teacherId');
    const classroomId = searchParams.get('classroomId');
    
    let query = db
      .select({
        id: schedules.id,
        courseId: schedules.courseId,
        subjectId: schedules.subjectId,
        teacherId: schedules.teacherId,
        classroomId: schedules.classroomId,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        academicYear: schedules.academicYear,
        semester: schedules.semester,
        isActive: schedules.isActive,
        createdAt: schedules.createdAt,
        updatedAt: schedules.updatedAt,
        // Información relacionada
        courseName: courses.name,
        subjectName: subjects.name,
        teacherFirstName: teachers.firstName,
        teacherLastName: teachers.lastName,
        classroomName: classrooms.name,
      })
      .from(schedules)
      .leftJoin(courses, eq(schedules.courseId, courses.id))
      .leftJoin(subjects, eq(schedules.subjectId, subjects.id))
      .leftJoin(teachers, eq(schedules.teacherId, teachers.id))
      .leftJoin(classrooms, eq(schedules.classroomId, classrooms.id));
    
    const conditions = [];
    
    if (active !== null) {
      conditions.push(eq(schedules.isActive, active === 'true'));
    }
    
    if (academicYear) {
      conditions.push(eq(schedules.academicYear, academicYear));
    }
    
    if (courseId) {
      conditions.push(eq(schedules.courseId, parseInt(courseId)));
    }
    
    if (teacherId) {
      conditions.push(eq(schedules.teacherId, parseInt(teacherId)));
    }
    
    if (classroomId) {
      conditions.push(eq(schedules.classroomId, parseInt(classroomId)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const allSchedules = await query.orderBy(schedules.dayOfWeek, schedules.startTime);
    
    return NextResponse.json(allSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Crear un nuevo horario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      courseId,
      subjectId,
      teacherId,
      classroomId,
      dayOfWeek,
      startTime,
      endTime,
      academicYear,
      semester,
    } = body;

    // Validaciones básicas
    if (!courseId || !subjectId || !teacherId || !classroomId || !dayOfWeek || !startTime || !endTime || !academicYear) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el día de la semana esté entre 1 y 7
    if (dayOfWeek < 1 || dayOfWeek > 7) {
      return NextResponse.json(
        { error: 'El día de la semana debe estar entre 1 (Lunes) y 7 (Domingo)' },
        { status: 400 }
      );
    }

    // Validar que la hora de inicio sea menor que la de fin
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'La hora de inicio debe ser menor que la hora de fin' },
        { status: 400 }
      );
    }

    // Verificar conflictos de salón
    const classroomConflict = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.classroomId, classroomId),
          eq(schedules.dayOfWeek, dayOfWeek),
          eq(schedules.academicYear, academicYear),
          eq(schedules.isActive, true),
          or(
            and(lt(schedules.startTime, startTime), gt(schedules.endTime, startTime)),
            and(lt(schedules.startTime, endTime), gt(schedules.endTime, endTime)),
            and(eq(schedules.startTime, startTime), eq(schedules.endTime, endTime))
          )
        )
      );

    if (classroomConflict.length > 0) {
      return NextResponse.json(
        { error: 'El salón ya está ocupado en este horario' },
        { status: 409 }
      );
    }

    // Verificar conflictos de profesor
    const teacherConflict = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.teacherId, teacherId),
          eq(schedules.dayOfWeek, dayOfWeek),
          eq(schedules.academicYear, academicYear),
          eq(schedules.isActive, true),
          or(
            and(lt(schedules.startTime, startTime), gt(schedules.endTime, startTime)),
            and(lt(schedules.startTime, endTime), gt(schedules.endTime, endTime)),
            and(eq(schedules.startTime, startTime), eq(schedules.endTime, endTime))
          )
        )
      );

    if (teacherConflict.length > 0) {
      return NextResponse.json(
        { error: 'El profesor ya tiene clase en este horario' },
        { status: 409 }
      );
    }

    const newSchedule = await db.insert(schedules).values({
      courseId: parseInt(courseId),
      subjectId: parseInt(subjectId),
      teacherId: parseInt(teacherId),
      classroomId: parseInt(classroomId),
      dayOfWeek: parseInt(dayOfWeek),
      startTime,
      endTime,
      academicYear,
      semester: semester || 'Primer Semestre',
    }).returning();

    return NextResponse.json(newSchedule[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating schedule:', error);
    
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'El curso, materia, profesor o salón especificado no existe' },
        { status: 400 }
      );
    }
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un horario con esta configuración' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
