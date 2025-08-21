const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'talento_tech_db',
});

async function checkTables() {
  try {
    console.log('🔍 Verificando tablas en la base de datos...');
    
    // Obtener todas las tablas
    const tablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%'
      AND tablename != 'information_schema'
      ORDER BY tablename
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.tablename);
    
    if (tables.length > 0) {
      console.log('✅ Tablas encontradas:');
      tables.forEach(table => console.log(`  - ${table}`));
      
      // Verificar estructura de la tabla levels
      console.log('\n🔍 Verificando estructura de la tabla levels...');
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'levels'
        ORDER BY ordinal_position
      `;
      
      const columnsResult = await pool.query(columnsQuery);
      if (columnsResult.rows.length > 0) {
        console.log('📋 Columnas de la tabla levels:');
        columnsResult.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
        });
      } else {
        console.log('❌ La tabla levels no existe');
      }
      
    } else {
      console.log('❌ No se encontraron tablas en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error);
  } finally {
    await pool.end();
  }
}

checkTables();
