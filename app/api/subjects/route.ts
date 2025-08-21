import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/subjects - Obtener todas las materias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = db.select().from(subjects);
    
    if (active !== null) {
      query = query.where(eq(subjects.isActive, active === 'true'));
    }
    
    const allSubjects = await query.orderBy(desc(subjects.createdAt));
    
    return NextResponse.json(allSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/subjects - Crear una nueva materia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      code,
      description,
      hoursPerWeek,
      color,
    } = body;

    // Validaciones básicas
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre de la materia es requerido' },
        { status: 400 }
      );
    }

    const newSubject = await db.insert(subjects).values({
      name,
      code,
      description,
      hoursPerWeek: hoursPerWeek || 0,
      color: color || '#3B82F6',
    }).returning();

    return NextResponse.json(newSubject[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating subject:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El código de la materia ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
