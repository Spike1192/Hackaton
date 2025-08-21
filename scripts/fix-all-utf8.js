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

async function fixAllUTF8Data() {
  try {
    console.log('🔧 Corrigiendo TODOS los datos con codificación UTF-8...\n');

    // Configurar client_encoding
    await pool.query("SET client_encoding TO 'UTF8'");
    console.log('✅ Client encoding configurado a UTF-8');

    // Lista completa de correcciones
    const corrections = [
      // Profesores
      { table: 'teachers', column: 'first_name', old: 'MarÃ­a', new: 'María' },
      { table: 'teachers', column: 'first_name', old: 'Ana', new: 'Ana' },
      { table: 'teachers', column: 'last_name', old: 'PÃ©rez', new: 'Pérez' },
      { table: 'teachers', column: 'last_name', old: 'GarcÃ­a', new: 'García' },
      { table: 'teachers', column: 'last_name', old: 'RamÃ­rez', new: 'Ramírez' },
      { table: 'teachers', column: 'last_name', old: 'LÃ³pez', new: 'López' },
      
      // Materias
      { table: 'subjects', column: 'name', old: 'MatemÃ¡ticas', new: 'Matemáticas' },
      { table: 'subjects', column: 'name', old: 'InglÃ©s', new: 'Inglés' },
      { table: 'subjects', column: 'name', old: 'TecnologÃ­a', new: 'Tecnología' },
      { table: 'subjects', column: 'description', old: 'MatemÃ¡ticas bÃ¡sicas y avanzadas', new: 'Matemáticas básicas y avanzadas' },
      { table: 'subjects', column: 'description', old: 'ComunicaciÃ³n y literatura', new: 'Comunicación y literatura' },
      { table: 'subjects', column: 'description', old: 'BiologÃ­a, quÃ­mica y fÃ­sica', new: 'Biología, química y física' },
      { table: 'subjects', column: 'description', old: 'Historia y geografÃ­a', new: 'Historia y geografía' },
      { table: 'subjects', column: 'description', old: 'Arte, mÃºsica y expresiÃ³n', new: 'Arte, música y expresión' },
      { table: 'subjects', column: 'description', old: 'Deportes y actividad fÃ­sica', new: 'Deportes y actividad física' },
      { table: 'subjects', column: 'description', old: 'Idioma inglÃ©s', new: 'Idioma inglés' },
      { table: 'subjects', column: 'description', old: 'InformÃ¡tica y tecnologÃ­a', new: 'Informática y tecnología' },
      
      // Niveles educativos
      { table: 'levels', column: 'description', old: 'EducaciÃ³n preescolar para niÃ±os de 3 a 5 aÃ±os', new: 'Educación preescolar para niños de 3 a 5 años' },
      { table: 'levels', column: 'description', old: 'EducaciÃ³n primaria de 1Â° a 6Â° grado', new: 'Educación primaria de 1° a 6° grado' },
      { table: 'levels', column: 'description', old: 'EducaciÃ³n secundaria de 7Â° a 11Â° grado', new: 'Educación secundaria de 7° a 11° grado' },
    ];

    console.log('🔄 Aplicando correcciones...');
    let correctedCount = 0;

    for (const correction of corrections) {
      try {
        const result = await pool.query(`
          UPDATE ${correction.table} 
          SET ${correction.column} = $1 
          WHERE ${correction.column} = $2
        `, [correction.new, correction.old]);
        
        if (result.rowCount > 0) {
          console.log(`  ✅ ${correction.table}.${correction.column}: "${correction.old}" → "${correction.new}" (${result.rowCount} filas)`);
          correctedCount += result.rowCount;
        }
      } catch (error) {
        console.log(`  ⚠️ Error en ${correction.table}.${correction.column}: ${error.message}`);
      }
    }

    console.log(`\n✅ Total de correcciones aplicadas: ${correctedCount}`);

    // Verificar los cambios
    console.log('\n🔍 Verificando datos corregidos...');
    
    const teachersResult = await pool.query(`
      SELECT first_name, last_name, email 
      FROM teachers 
      ORDER BY id
    `);
    
    console.log('📊 Datos de profesores (corregidos):');
    teachersResult.rows.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ${teacher.first_name} ${teacher.last_name} - ${teacher.email}`);
    });

    const subjectsResult = await pool.query(`
      SELECT name, description 
      FROM subjects 
      ORDER BY id
    `);
    
    console.log('\n📚 Datos de materias (corregidos):');
    subjectsResult.rows.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.name} - ${subject.description}`);
    });

    const levelsResult = await pool.query(`
      SELECT name, description 
      FROM levels 
      ORDER BY id
    `);
    
    console.log('\n📖 Datos de niveles (corregidos):');
    levelsResult.rows.forEach((level, index) => {
      console.log(`  ${index + 1}. ${level.name} - ${level.description}`);
    });

    console.log('\n✅ Todos los datos han sido corregidos exitosamente!');
    console.log('Los caracteres especiales ahora deberían mostrarse correctamente.');

  } catch (error) {
    console.error('❌ Error corrigiendo datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixAllUTF8Data()
  .then(() => {
    console.log('\n🎉 Corrección completa de UTF-8 finalizada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
