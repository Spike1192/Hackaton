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

async function checkUTF8Configuration() {
  try {
    console.log('🔍 Verificando configuración de caracteres...\n');

    // Verificar configuración básica
    const configResult = await pool.query(`
      SELECT 
        current_setting('client_encoding') as client_encoding,
        current_setting('server_encoding') as server_encoding
    `);

    console.log('📋 Configuración actual:');
    console.log(`  - Client Encoding: ${configResult.rows[0].client_encoding}`);
    console.log(`  - Server Encoding: ${configResult.rows[0].server_encoding}`);

    // Verificar datos existentes
    console.log('\n🔍 Verificando datos existentes...');
    
    const teachersResult = await pool.query(`
      SELECT first_name, last_name, email 
      FROM teachers 
      LIMIT 3
    `);
    
    console.log('📊 Datos de profesores:');
    teachersResult.rows.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ${teacher.first_name} ${teacher.last_name} - ${teacher.email}`);
    });

    const subjectsResult = await pool.query(`
      SELECT name, description 
      FROM subjects 
      LIMIT 3
    `);
    
    console.log('\n📚 Datos de materias:');
    subjectsResult.rows.forEach((subject, index) => {
      console.log(`  ${index + 1}. ${subject.name} - ${subject.description}`);
    });

    // Configurar client_encoding para esta sesión
    console.log('\n🔧 Configurando client_encoding para esta sesión...');
    await pool.query("SET client_encoding TO 'UTF8'");
    console.log('✅ Client encoding configurado a UTF-8');

    // Verificar configuración después del cambio
    const newConfig = await pool.query(`
      SELECT current_setting('client_encoding') as client_encoding
    `);
    console.log(`✅ Client encoding actual: ${newConfig.rows[0].client_encoding}`);

    if (configResult.rows[0].server_encoding === 'UTF8') {
      console.log('\n✅ La base de datos ya está configurada en UTF-8');
      console.log('Los caracteres especiales deberían mostrarse correctamente.');
    } else {
      console.log('\n⚠️ La base de datos NO está en UTF-8');
      console.log('Para cambiar a UTF-8, necesitas recrear la base de datos.');
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function recreateDatabaseWithUTF8() {
  try {
    console.log('🔄 Recreando base de datos con UTF-8...\n');

    // Conectar a la base de datos postgres por defecto
    const defaultPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '123456',
      database: 'postgres', // Conectar a postgres por defecto
    });

    // Eliminar la base de datos existente
    console.log('🗑️ Eliminando base de datos existente...');
    await defaultPool.query(`
      DROP DATABASE IF EXISTS talento_tech_db
    `);
    console.log('✅ Base de datos eliminada');

    // Crear nueva base de datos con UTF-8
    console.log('📝 Creando nueva base de datos con UTF-8...');
    await defaultPool.query(`
      CREATE DATABASE talento_tech_db 
      WITH 
        ENCODING = 'UTF8'
        TEMPLATE = template0
    `);
    console.log('✅ Base de datos creada con UTF-8');

    await defaultPool.end();

    // Ejecutar el seed
    console.log('\n🌱 Ejecutando seed con datos UTF-8...');
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec('node scripts/simple-seed.js', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error ejecutando seed:', error);
          reject(error);
          return;
        }
        console.log('✅ Seed completado');
        resolve();
      });
    });

  } catch (error) {
    console.error('❌ Error recreando la base de datos:', error);
    throw error;
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--recreate')) {
    console.log('🔄 Modo recreación activado');
    await recreateDatabaseWithUTF8();
    console.log('\n🎉 Base de datos recreada con UTF-8 exitosamente!');
  } else {
    await checkUTF8Configuration();
    console.log('\n💡 Para recrear la base de datos con UTF-8, ejecuta:');
    console.log('   node scripts/configure-utf8-simple.js --recreate');
  }
}

main()
  .then(() => {
    console.log('\n✅ Configuración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
