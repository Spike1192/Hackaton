import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/subjects/[id] - Obtener una materia específica
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

    const subject = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (subject.length === 0) {
      return NextResponse.json(
        { error: 'Materia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(subject[0]);
  } catch (error) {
    console.error('Error fetching subject:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/subjects/[id] - Actualizar una materia
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
      name,
      code,
      description,
      hoursPerWeek,
      color,
      isActive,
    } = body;

    // Verificar si la materia existe
    const existingSubject = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (existingSubject.length === 0) {
      return NextResponse.json(
        { error: 'Materia no encontrada' },
        { status: 404 }
      );
    }

    const updatedSubject = await db
      .update(subjects)
      .set({
        name,
        code,
        description,
        hoursPerWeek,
        color,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, id))
      .returning();

    return NextResponse.json(updatedSubject[0]);
  } catch (error: any) {
    console.error('Error updating subject:', error);
    
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

// DELETE /api/subjects/[id] - Eliminar una materia (soft delete)
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

    // Verificar si la materia existe
    const existingSubject = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1);

    if (existingSubject.length === 0) {
      return NextResponse.json(
        { error: 'Materia no encontrada' },
        { status: 404 }
      );
    }

    // Soft delete - marcar como inactiva
    const deletedSubject = await db
      .update(subjects)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(subjects.id, id))
      .returning();

    return NextResponse.json(deletedSubject[0]);
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
