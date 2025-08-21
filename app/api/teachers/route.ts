import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teachers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/teachers - Obtener todos los profesores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = db.select().from(teachers);
    
    if (active !== null) {
      query = query.where(eq(teachers.isActive, active === 'true'));
    }
    
    const allTeachers = await query.orderBy(desc(teachers.createdAt));
    
    return NextResponse.json(allTeachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Crear un nuevo profesor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      identificationNumber,
      hireDate,
      maxHoursPerWeek,
      minHoursPerWeek,
    } = body;

    // Validaciones básicas
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Nombre, apellido y email son requeridos' },
        { status: 400 }
      );
    }

    const newTeacher = await db.insert(teachers).values({
      firstName,
      lastName,
      email,
      phone,
      identificationNumber,
      hireDate: hireDate ? new Date(hireDate) : undefined,
      maxHoursPerWeek: maxHoursPerWeek || 40,
      minHoursPerWeek: minHoursPerWeek || 20,
    }).returning();

    return NextResponse.json(newTeacher[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating teacher:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El email o número de identificación ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
