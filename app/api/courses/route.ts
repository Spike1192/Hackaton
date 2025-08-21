import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, levels, classrooms } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/courses - Obtener todos los cursos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const academicYear = searchParams.get('academicYear');
    
    let query = db
      .select({
        id: courses.id,
        name: courses.name,
        levelId: courses.levelId,
        classroomId: courses.classroomId,
        academicYear: courses.academicYear,
        totalStudents: courses.totalStudents,
        requiredHoursPerWeek: courses.requiredHoursPerWeek,
        isActive: courses.isActive,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        levelName: levels.name,
        classroomName: classrooms.name,
      })
      .from(courses)
      .leftJoin(levels, eq(courses.levelId, levels.id))
      .leftJoin(classrooms, eq(courses.classroomId, classrooms.id));
    
    if (active !== null) {
      query = query.where(eq(courses.isActive, active === 'true'));
    }
    
    if (academicYear) {
      query = query.where(eq(courses.academicYear, academicYear));
    }
    
    const allCourses = await query.orderBy(desc(courses.createdAt));
    
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Crear un nuevo curso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      levelId,
      classroomId,
      academicYear,
      totalStudents,
      requiredHoursPerWeek,
    } = body;

    // Validaciones básicas
    if (!name || !academicYear) {
      return NextResponse.json(
        { error: 'El nombre del curso y año académico son requeridos' },
        { status: 400 }
      );
    }

    const newCourse = await db.insert(courses).values({
      name,
      levelId: levelId ? parseInt(levelId) : undefined,
      classroomId: classroomId ? parseInt(classroomId) : undefined,
      academicYear,
      totalStudents: totalStudents || 0,
      requiredHoursPerWeek: requiredHoursPerWeek || 30,
    }).returning();

    return NextResponse.json(newCourse[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'El nivel o salón especificado no existe' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
