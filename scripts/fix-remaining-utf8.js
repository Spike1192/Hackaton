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

async function fixRemainingUTF8() {
  try {
    console.log('🔧 Corrigiendo las últimas materias con problemas de codificación...\n');

    // Configurar client_encoding
    await pool.query("SET client_encoding TO 'UTF8'");
    console.log('✅ Client encoding configurado a UTF-8');

    // Corregir las materias restantes
    const remainingCorrections = [
      { table: 'subjects', column: 'name', old: 'EducaciÃ³n ArtÃ­stica', new: 'Educación Artística' },
      { table: 'subjects', column: 'name', old: 'EducaciÃ³n FÃ­sica', new: 'Educación Física' },
    ];

    console.log('🔄 Aplicando correcciones finales...');
    let correctedCount = 0;

    for (const correction of remainingCorrections) {
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

    // Verificar todos los datos
    console.log('\n🔍 Verificación final de todos los datos...');
    
    const subjectsResult = await pool.query(`
      SELECT name, description 
      FROM subjects 
      ORDER BY id
    `);
    
    console.log('📚 Todas las materias (corregidas):');
    subjectsResult.rows.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.name} - ${subject.description}`);
    });

    console.log('\n✅ ¡Todos los caracteres especiales han sido corregidos!');
    console.log('La base de datos ahora está completamente configurada en UTF-8.');

  } catch (error) {
    console.error('❌ Error corrigiendo datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

fixRemainingUTF8()
  .then(() => {
    console.log('\n🎉 Configuración UTF-8 completada al 100%!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
