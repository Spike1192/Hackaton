import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Guía de instalación de PostgreSQL para Talento Tech\n');

console.log('📋 Pasos para instalar PostgreSQL:\n');

console.log('1️⃣  DESCARGAR POSTGRESQL:');
console.log('   • Ve a: https://www.postgresql.org/download/windows/');
console.log('   • Descarga el instalador para Windows');
console.log('   • Ejecuta el instalador como administrador\n');

console.log('2️⃣  CONFIGURACIÓN DURANTE LA INSTALACIÓN:');
console.log('   • Puerto: 5432 (por defecto)');
console.log('   • Contraseña del usuario postgres: ANOTA ESTA CONTRASEÑA');
console.log('   • Instalar pgAdmin: Opcional');
console.log('   • Stack Builder: No necesario\n');

console.log('3️⃣  VERIFICAR LA INSTALACIÓN:');
console.log('   • Abre una nueva terminal');
console.log('   • Ejecuta: psql --version');
console.log('   • Deberías ver la versión de PostgreSQL\n');

console.log('4️⃣  CREAR EL ARCHIVO .env:');
const envPath = path.join(__dirname, '..', '.env');
const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_AQUI
DB_NAME=talento_tech_db

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ Archivo .env creado');
  console.log('   📝 IMPORTANTE: Cambia TU_CONTRASEÑA_AQUI por tu contraseña real\n');
} else {
  console.log('   ℹ️  Archivo .env ya existe');
  console.log('   📝 Verifica que DB_PASSWORD tenga tu contraseña correcta\n');
}

console.log('5️⃣  CONFIGURAR LA BASE DE DATOS:');
console.log('   • Ejecuta: npm run db:setup');
console.log('   • Ejecuta: npm run db:check');
console.log('   • Ejecuta: npm run db:generate');
console.log('   • Ejecuta: npm run db:migrate');
console.log('   • Ejecuta: npm run db:seed\n');

console.log('6️⃣  EJECUTAR EL PROYECTO:');
console.log('   • Ejecuta: npm run dev');
console.log('   • Abre: http://localhost:3000\n');

console.log('🔧 COMANDOS ÚTILES:');
console.log('   • Verificar estado: npm run db:check');
console.log('   • Configurar BD: npm run db:setup');
console.log('   • Generar migraciones: npm run db:generate');
console.log('   • Ejecutar migraciones: npm run db:migrate');
console.log('   • Poblar datos: npm run db:seed');
console.log('   • Abrir Drizzle Studio: npm run db:studio\n');

console.log('❓ ¿NECESITAS AYUDA?');
console.log('   • Revisa el README.md para más detalles');
console.log('   • Verifica que PostgreSQL esté en el PATH del sistema');
console.log('   • Asegúrate de que el servicio PostgreSQL esté ejecutándose\n');

// Verificar si PostgreSQL está instalado
try {
  execSync('psql --version', { stdio: 'pipe' });
  console.log('✅ PostgreSQL está instalado y disponible');
} catch (error) {
  console.log('❌ PostgreSQL no está instalado o no está en el PATH');
  console.log('💡 Sigue los pasos anteriores para instalarlo\n');
}

console.log('🎉 ¡Buena suerte con la instalación!');
