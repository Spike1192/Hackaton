import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Configurando base de datos PostgreSQL para Talento Tech...\n');

// Crear archivo .env si no existe
const envPath = path.join(__dirname, '..', '.env');
const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=talento_tech_db

# Alternative: Use DATABASE_URL instead of individual variables
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/talento_tech_db

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado');
} else {
  console.log('ℹ️  Archivo .env ya existe');
}

// Función para verificar si PostgreSQL está instalado
function checkPostgreSQL() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Función para crear la base de datos
function createDatabase() {
  try {
    console.log('📦 Creando base de datos...');
    
    // Crear la base de datos
    execSync('createdb -U postgres talento_tech_db', { 
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: 'postgres' }
    });
    
    console.log('✅ Base de datos creada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error.message);
    return false;
  }
}

// Función para ejecutar el script SQL
function runSQLScript() {
  try {
    console.log('📝 Ejecutando script SQL...');
    
    const sqlPath = path.join(__dirname, '..', 'documents', 'script.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ No se encontró el archivo script.sql');
      return false;
    }
    
    execSync(`psql -U postgres -d talento_tech_db -f "${sqlPath}"`, {
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: 'postgres' }
    });
    
    console.log('✅ Script SQL ejecutado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al ejecutar el script SQL:', error.message);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🔍 Verificando instalación de PostgreSQL...');
  
  if (!checkPostgreSQL()) {
    console.log('❌ PostgreSQL no está instalado o no está en el PATH');
    console.log('📥 Por favor instala PostgreSQL desde: https://www.postgresql.org/download/windows/');
    console.log('   O ejecuta: choco install postgresql --yes (como administrador)');
    return;
  }
  
  console.log('✅ PostgreSQL está instalado');
  
  // Crear base de datos
  if (createDatabase()) {
    // Ejecutar script SQL
    runSQLScript();
  }
  
  console.log('\n🎉 Configuración completada!');
  console.log('📋 Próximos pasos:');
  console.log('   1. Ejecuta: npm run db:migrate');
  console.log('   2. Ejecuta: npm run db:seed');
  console.log('   3. Ejecuta: npm run dev');
}

main().catch(console.error);
