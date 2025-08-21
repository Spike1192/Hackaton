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

async function fixUTF8Data() {
  try {
    console.log('🔧 Corrigiendo datos con codificación UTF-8...\n');

    // Configurar client_encoding
    await pool.query("SET client_encoding TO 'UTF8'");
    console.log('✅ Client encoding configurado a UTF-8');

    // Actualizar profesores con nombres correctos
    console.log('👨‍🏫 Actualizando profesores...');
    await pool.query(`
      UPDATE teachers SET 
        first_name = 'María' WHERE first_name = 'MarÃ­a'
    `);
    await pool.query(`
      UPDATE teachers SET 
        first_name = 'Ana' WHERE first_name = 'Ana'
    `);
    await pool.query(`
      UPDATE teachers SET 
        last_name = 'Pérez' WHERE last_name = 'PÃ©rez'
    `);
    await pool.query(`
      UPDATE teachers SET 
        last_name = 'García' WHERE last_name = 'GarcÃ­a'
    `);
    await pool.query(`
      UPDATE teachers SET 
        last_name = 'Ramírez' WHERE last_name = 'RamÃ­rez'
    `);
    await pool.query(`
      UPDATE teachers SET 
        last_name = 'López' WHERE last_name = 'LÃ³pez'
    `);
    console.log('✅ Profesores actualizados');

    // Actualizar materias con nombres correctos
    console.log('📚 Actualizando materias...');
    await pool.query(`
      UPDATE subjects SET 
        name = 'Matemáticas' WHERE name = 'MatemÃ¡ticas'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Matemáticas básicas y avanzadas' WHERE description = 'MatemÃ¡ticas bÃ¡sicas y avanzadas'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Comunicación y literatura' WHERE description = 'ComunicaciÃ³n y literatura'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Biología, química y física' WHERE description = 'BiologÃ­a, quÃ­mica y fÃ­sica'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Historia y geografía' WHERE description = 'Historia y geografÃ­a'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Arte, música y expresión' WHERE description = 'Arte, mÃºsica y expresiÃ³n'
    `);
    await pool.query(`
      UPDATE subjects SET 
        description = 'Deportes y actividad física' WHERE description = 'Deportes y actividad fÃ­sica'
    `);
    console.log('✅ Materias actualizadas');

    // Actualizar niveles educativos
    console.log('📖 Actualizando niveles educativos...');
    await pool.query(`
      UPDATE levels SET 
        description = 'Educación preescolar para niños de 3 a 5 años' WHERE description = 'EducaciÃ³n preescolar para niÃ±os de 3 a 5 aÃ±os'
    `);
    await pool.query(`
      UPDATE levels SET 
        description = 'Educación primaria de 1° a 6° grado' WHERE description = 'EducaciÃ³n primaria de 1Â° a 6Â° grado'
    `);
    await pool.query(`
      UPDATE levels SET 
        description = 'Educación secundaria de 7° a 11° grado' WHERE description = 'EducaciÃ³n secundaria de 7Â° a 11Â° grado'
    `);
    console.log('✅ Niveles educativos actualizados');

    // Verificar los cambios
    console.log('\n🔍 Verificando datos corregidos...');
    
    const teachersResult = await pool.query(`
      SELECT first_name, last_name, email 
      FROM teachers 
      LIMIT 3
    `);
    
    console.log('📊 Datos de profesores (corregidos):');
    teachersResult.rows.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ${teacher.first_name} ${teacher.last_name} - ${teacher.email}`);
    });

    const subjectsResult = await pool.query(`
      SELECT name, description 
      FROM subjects 
      LIMIT 3
    `);
    
    console.log('\n📚 Datos de materias (corregidos):');
    subjectsResult.rows.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.name} - ${subject.description}`);
    });

    console.log('\n✅ Datos corregidos exitosamente!');
    console.log('Los caracteres especiales ahora deberían mostrarse correctamente.');

  } catch (error) {
    console.error('❌ Error corrigiendo datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixUTF8Data()
  .then(() => {
    console.log('\n🎉 Corrección de UTF-8 completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
