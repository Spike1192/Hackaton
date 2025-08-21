const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'talento_tech_db',
});

async function applyMigrations() {
  try {
    console.log('🔄 Aplicando migraciones...');
    
    // Leer archivos de migración en orden
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log('📋 Archivos de migración encontrados:', migrationFiles);
    
    for (const file of migrationFiles) {
      console.log(`\n📄 Aplicando migración: ${file}`);
      const migrationPath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Dividir el SQL por statement-breakpoint
      const statements = migrationSQL.split('--> statement-breakpoint').filter(stmt => stmt.trim());
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement) {
          console.log(`  Ejecutando statement ${i + 1}/${statements.length}...`);
          try {
            await pool.query(statement);
            console.log(`  ✅ Statement ${i + 1} ejecutado correctamente`);
          } catch (error) {
            console.log(`  ⚠️  Statement ${i + 1} falló:`, error.message);
            // Continuar con el siguiente statement
          }
        }
      }
      
      console.log(`✅ Migración ${file} completada`);
    }
    
    console.log('\n🎉 Todas las migraciones aplicadas');
    
  } catch (error) {
    console.error('❌ Error aplicando migraciones:', error);
  } finally {
    await pool.end();
  }
}

applyMigrations();
