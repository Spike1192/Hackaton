import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teachers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/teachers/[id] - Obtener un profesor específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const teacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id))
      .limit(1);

    if (teacher.length === 0) {
      return NextResponse.json(
        { error: 'Profesor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher[0]);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/teachers/[id] - Actualizar un profesor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

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
      isActive,
    } = body;

    // Verificar si el profesor existe
    const existingTeacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id))
      .limit(1);

    if (existingTeacher.length === 0) {
      return NextResponse.json(
        { error: 'Profesor no encontrado' },
        { status: 404 }
      );
    }

    const updatedTeacher = await db
      .update(teachers)
      .set({
        firstName,
        lastName,
        email,
        phone,
        identificationNumber,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        maxHoursPerWeek,
        minHoursPerWeek,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(teachers.id, id))
      .returning();

    return NextResponse.json(updatedTeacher[0]);
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    
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

// DELETE /api/teachers/[id] - Eliminar un profesor (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar si el profesor existe
    const existingTeacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id))
      .limit(1);

    if (existingTeacher.length === 0) {
      return NextResponse.json(
        { error: 'Profesor no encontrado' },
        { status: 404 }
      );
    }

    // Soft delete - marcar como inactivo
    const deletedTeacher = await db
      .update(teachers)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(teachers.id, id))
      .returning();

    return NextResponse.json(deletedTeacher[0]);
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
