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

async function verifyDatabase() {
  try {
    console.log('🔍 Verificando la base de datos...\n');

    // Verificar tablas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Verificar datos en cada tabla
    const tables = [
      'levels', 'subjects', 'teachers', 'classrooms', 
      'courses', 'system_config'
    ];

    console.log('\n📊 Datos en cada tabla:');
    
    for (const table of tables) {
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = countResult.rows[0].count;
      console.log(`  - ${table}: ${count} registros`);
      
      // Mostrar algunos datos de ejemplo
      if (count > 0) {
        const sampleResult = await pool.query(`SELECT * FROM ${table} LIMIT 2`);
        console.log(`    Ejemplos: ${sampleResult.rows.map(row => {
          if (table === 'teachers') {
            return `${row.first_name} ${row.last_name}`;
          } else if (table === 'subjects') {
            return row.name;
          } else if (table === 'levels') {
            return row.name;
          } else if (table === 'classrooms') {
            return row.name;
          } else if (table === 'courses') {
            return row.name;
          } else {
            return JSON.stringify(row).substring(0, 50) + '...';
          }
        }).join(', ')}`);
      }
    }

    // Verificar relaciones
    console.log('\n🔗 Verificando relaciones...');
    
    // Profesores con materias asignadas
    const teacherSubjectsResult = await pool.query(`
      SELECT COUNT(*) as count FROM teacher_subjects
    `);
    console.log(`  - Profesores con materias: ${teacherSubjectsResult.rows[0].count} asignaciones`);

    // Cursos con estudiantes
    const courseStudentsResult = await pool.query(`
      SELECT COUNT(*) as count FROM course_students
    `);
    console.log(`  - Cursos con estudiantes: ${courseStudentsResult.rows[0].count} asignaciones`);

    // Horarios
    const schedulesResult = await pool.query(`
      SELECT COUNT(*) as count FROM schedules
    `);
    console.log(`  - Horarios: ${schedulesResult.rows[0].count} registros`);

    console.log('\n✅ Verificación completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

verifyDatabase()
  .then(() => {
    console.log('\n🎉 ¡La base de datos está completamente configurada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en la verificación:', error);
    process.exit(1);
  });
