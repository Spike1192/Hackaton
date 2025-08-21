const { Pool } = require('pg');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'talento_tech_db',
});

async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Insertar niveles educativos
    console.log('📚 Insertando niveles educativos...');
    await pool.query(`
      INSERT INTO levels (name, description) VALUES
      ('Preescolar', 'Educación preescolar para niños de 3 a 5 años'),
      ('Primaria', 'Educación primaria de 1° a 6° grado'),
      ('Bachillerato', 'Educación secundaria de 7° a 11° grado')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insertar materias básicas
    console.log('📖 Insertando materias...');
    await pool.query(`
      INSERT INTO subjects (name, code, description, hours_per_week, color) VALUES
      ('Matemáticas', 'MATH', 'Matemáticas básicas y avanzadas', 5, '#EF4444'),
      ('Lengua y Literatura', 'LANG', 'Comunicación y literatura', 4, '#3B82F6'),
      ('Ciencias Naturales', 'SCI', 'Biología, química y física', 4, '#10B981'),
      ('Ciencias Sociales', 'SOC', 'Historia y geografía', 3, '#F59E0B'),
      ('Educación Artística', 'ART', 'Arte, música y expresión', 2, '#8B5CF6'),
      ('Educación Física', 'PE', 'Deportes y actividad física', 2, '#06B6D4'),
      ('Inglés', 'ENG', 'Idioma inglés', 3, '#84CC16'),
      ('Tecnología', 'TECH', 'Informática y tecnología', 2, '#6366F1')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Insertar profesores de ejemplo
    console.log('👨‍🏫 Insertando profesores...');
    await pool.query(`
      INSERT INTO teachers (first_name, last_name, email, phone, identification_number, max_hours_per_week, min_hours_per_week) VALUES
      ('María', 'Pérez', 'maria.perez@talentotech.edu', '3001234567', '12345678', 25, 20),
      ('Juan', 'García', 'juan.garcia@talentotech.edu', '3002345678', '23456789', 25, 20),
      ('Ana', 'Ramírez', 'ana.ramirez@talentotech.edu', '3003456789', '34567890', 25, 20),
      ('Carlos', 'López', 'carlos.lopez@talentotech.edu', '3004567890', '45678901', 25, 20)
      ON CONFLICT (email) DO NOTHING;
    `);

    // Insertar salones
    console.log('🏫 Insertando salones...');
    await pool.query(`
      INSERT INTO classrooms (name, floor, capacity, building, room_type) VALUES
      ('Salón 101', 1, 25, 'Principal', 'Regular'),
      ('Salón 201', 2, 30, 'Principal', 'Regular'),
      ('Salón 205', 2, 30, 'Principal', 'Regular'),
      ('Salón 302', 3, 25, 'Principal', 'Regular'),
      ('Salón 303', 3, 25, 'Principal', 'Regular'),
      ('Laboratorio', 1, 20, 'Principal', 'Laboratorio'),
      ('Gimnasio', 1, 50, 'Deportes', 'Gimnasio')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Obtener IDs para crear cursos
    const levelsResult = await pool.query('SELECT id FROM levels ORDER BY id LIMIT 3');
    const classroomsResult = await pool.query('SELECT id FROM classrooms ORDER BY id LIMIT 4');

    // Insertar cursos de ejemplo
    console.log('📚 Insertando cursos...');
    await pool.query(`
      INSERT INTO courses (name, level_id, classroom_id, academic_year, total_students, required_hours_per_week) VALUES
      ('Preescolar A', $1, $2, '2024-2025', 20, 25),
      ('1° Primaria', $3, $4, '2024-2025', 25, 30),
      ('5° Primaria', $3, $5, '2024-2025', 23, 30),
      ('11° Bachillerato', $6, $7, '2024-2025', 18, 30)
      ON CONFLICT DO NOTHING;
    `, [
      levelsResult.rows[0]?.id, classroomsResult.rows[0]?.id,
      levelsResult.rows[1]?.id, classroomsResult.rows[1]?.id,
      classroomsResult.rows[2]?.id,
      levelsResult.rows[2]?.id, classroomsResult.rows[3]?.id
    ]);

    // Insertar configuración del sistema
    console.log('⚙️ Insertando configuración del sistema...');
    await pool.query(`
      INSERT INTO system_config (config_key, config_value, description) VALUES
      ('school_name', 'Talento Tech', 'Nombre de la institución'),
      ('academic_year', '2024-2025', 'Año académico actual'),
      ('max_hours_per_day', '8', 'Máximo de horas por día para un profesor'),
      ('max_hours_per_week', '40', 'Máximo de horas por semana para un profesor'),
      ('min_hours_per_week', '20', 'Mínimo de horas por semana para un profesor'),
      ('break_duration', '10', 'Duración del descanso en minutos'),
      ('class_duration', '50', 'Duración estándar de una clase en minutos')
      ON CONFLICT (config_key) DO NOTHING;
    `);

    console.log('✅ Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed()
  .then(() => {
    console.log('Seed completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error en seed:', error);
    process.exit(1);
  });
