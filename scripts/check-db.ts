import { Pool } from 'pg';

async function checkDatabase() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'postgres', // Conectar a la base de datos por defecto
  });

  try {
    console.log('🔍 Verificando conexión a PostgreSQL...');
    
    // Verificar conexión
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la base de datos existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'talento_tech_db'"
    );
    
    if (result.rows.length === 0) {
      console.log('📝 La base de datos talento_tech_db no existe. Creándola...');
      await client.query('CREATE DATABASE talento_tech_db');
      console.log('✅ Base de datos talento_tech_db creada exitosamente');
    } else {
      console.log('✅ La base de datos talento_tech_db ya existe');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkDatabase()
  .then(() => {
    console.log('✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en la verificación:', error);
    process.exit(1);
  });
