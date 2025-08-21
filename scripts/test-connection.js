const { Pool } = require('pg');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Probando conexión a PostgreSQL...');
console.log('Configuración actual:');
console.log('- Host:', process.env.DB_HOST || 'localhost');
console.log('- Port:', process.env.DB_PORT || '5432');
console.log('- User:', process.env.DB_USER || 'postgres');
console.log('- Database:', process.env.DB_NAME || 'talento_tech_db');
console.log('- Password:', process.env.DB_PASSWORD ? '***configurada***' : 'no configurada');

// Probar diferentes configuraciones
const configs = [
  {
    name: 'Configuración con .env.local',
    config: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: '123456',
      database: 'postgres', // Conectar a la base de datos por defecto primero
    }
  },
  {
    name: 'Configuración sin contraseña',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      database: 'postgres',
    }
  },
  {
    name: 'Configuración con contraseña vacía',
    config: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '123456',
      database: 'postgres',
    }
  }
];

async function testConnection(config, name) {
  const pool = new Pool(config);
  
  try {
    console.log(`\n🔧 Probando: ${name}`);
    const client = await pool.connect();
    console.log('✅ Conexión exitosa!');
    
    // Verificar si la base de datos existe
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'talento_tech_db'");
    if (result.rows.length === 0) {
      console.log('📝 La base de datos talento_tech_db no existe. Creándola...');
      await client.query('CREATE DATABASE talento_tech_db');
      console.log('✅ Base de datos talento_tech_db creada exitosamente');
    } else {
      console.log('✅ La base de datos talento_tech_db ya existe');
    }
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    await pool.end();
    return false;
  }
}

async function main() {
  for (const config of configs) {
    const success = await testConnection(config.config, config.name);
    if (success) {
      console.log(`\n🎉 ¡Conexión exitosa con: ${config.name}`);
      console.log('Usa esta configuración en tu .env.local:');
      console.log(`DB_HOST=${config.config.host}`);
      console.log(`DB_PORT=${config.config.port}`);
      console.log(`DB_USER=${config.config.user}`);
      console.log(`DB_PASSWORD=${config.config.password || ''}`);
      console.log(`DB_NAME=talento_tech_db`);
      return;
    }
  }
  
  console.log('\n❌ No se pudo conectar con ninguna configuración');
  console.log('Verifica que:');
  console.log('1. PostgreSQL esté instalado y ejecutándose');
  console.log('2. El usuario postgres exista');
  console.log('3. La contraseña sea correcta');
}

main().catch(console.error);
