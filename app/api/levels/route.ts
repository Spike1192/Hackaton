import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { levels } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/levels - Obtener todos los niveles
export async function GET() {
  try {
    const allLevels = await db.select().from(levels).orderBy(desc(levels.createdAt));
    return NextResponse.json(allLevels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/levels - Crear un nuevo nivel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'El nombre del nivel es requerido' },
        { status: 400 }
      );
    }

    const newLevel = await db.insert(levels).values({
      name,
      description,
    }).returning();

    return NextResponse.json(newLevel[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating level:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'El nombre del nivel ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
