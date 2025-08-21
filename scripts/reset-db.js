const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'talento_tech_db',
});

async function resetDatabase() {
  try {
    console.log('🔄 Limpiando base de datos...');
    
    // Obtener todas las tablas
    const tablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%'
      AND tablename != 'information_schema'
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.tablename);
    
    if (tables.length > 0) {
      console.log('📋 Tablas encontradas:', tables);
      
      // Deshabilitar restricciones de clave foránea
      await pool.query('SET session_replication_role = replica;');
      
      // Eliminar todas las tablas
      for (const table of tables) {
        console.log(`🗑️  Eliminando tabla: ${table}`);
        await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      }
      
      // Habilitar restricciones de clave foránea
      await pool.query('SET session_replication_role = DEFAULT;');
      
      console.log('✅ Base de datos limpiada exitosamente');
    } else {
      console.log('ℹ️  No se encontraron tablas para eliminar');
    }
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await pool.end();
  }
}

resetDatabase();
