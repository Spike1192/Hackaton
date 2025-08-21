import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { classrooms } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/classrooms - Obtener todos los salones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    let query = db.select().from(classrooms);
    
    if (active !== null) {
      query = query.where(eq(classrooms.isActive, active === 'true'));
    }
    
    const allClassrooms = await query.orderBy(desc(classrooms.createdAt));
    
    return NextResponse.json(allClassrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/classrooms - Crear un nuevo salón
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      floor,
      capacity,
      building,
      roomType,
    } = body;

    // Validaciones básicas
    if (!name) {
      return NextResponse.json(
        { error: 'El nombre del salón es requerido' },
        { status: 400 }
      );
    }

    const newClassroom = await db.insert(classrooms).values({
      name,
      floor: floor || 1,
      capacity: capacity || 30,
      building: building || 'Principal',
      roomType: roomType || 'Regular',
    }).returning();

    return NextResponse.json(newClassroom[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating classroom:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El nombre del salón ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
