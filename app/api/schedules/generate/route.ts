import { NextRequest, NextResponse } from 'next/server';
import { ScheduleGenerator } from '@/lib/services/schedule-generator';

// POST /api/schedules/generate - Generar horario automáticamente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, academicYear } = body;

    if (!courseId || !academicYear) {
      return NextResponse.json(
        { error: 'courseId y academicYear son requeridos' },
        { status: 400 }
      );
    }

    // Configuración de restricciones
    const constraints = {
      maxHoursPerDay: 4,
      minHoursPerWeek: 20,
      maxHoursPerWeek: 25,
      breakDuration: 10,
      classDuration: 50,
    };

    // Crear generador de horarios
    const generator = new ScheduleGenerator(academicYear, constraints);

    // Generar horario para el curso
    const scheduleData = await generator.generateCourseSchedule(courseId);

    if (scheduleData.length === 0) {
      return NextResponse.json(
        { error: 'No se pudo generar un horario válido para este curso' },
        { status: 400 }
      );
    }

    // Validar conflictos de descanso
    const breakConflicts = await generator.validateBreakConflicts(courseId);

    // Guardar horario en la base de datos
    const savedSchedules = await generator.saveSchedule(scheduleData);

    return NextResponse.json({
      message: 'Horario generado exitosamente',
      schedules: savedSchedules,
      breakConflicts,
      totalClasses: scheduleData.filter(s => !s.isBreak).length,
      totalBreaks: scheduleData.filter(s => s.isBreak).length,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error generando horario:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET /api/schedules/generate/validate/:courseId - Validar restricciones para un curso
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const academicYear = searchParams.get('academicYear');

    if (!courseId || !academicYear) {
      return NextResponse.json(
        { error: 'courseId y academicYear son requeridos' },
        { status: 400 }
      );
    }

    const constraints = {
      maxHoursPerDay: 4,
      minHoursPerWeek: 20,
      maxHoursPerWeek: 25,
      breakDuration: 10,
      classDuration: 50,
    };

    const generator = new ScheduleGenerator(academicYear, constraints);
    const breakConflicts = await generator.validateBreakConflicts(parseInt(courseId));

    return NextResponse.json({
      courseId: parseInt(courseId),
      academicYear,
      breakConflicts,
      hasConflicts: breakConflicts.length > 0,
    });

  } catch (error: any) {
    console.error('Error validando restricciones:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
