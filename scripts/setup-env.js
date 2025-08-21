const fs = require('fs');
const path = require('path');

const envContent = `DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=talento_tech_db
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📁 Ubicación:', envPath);
  console.log('🔧 Configuración aplicada:');
  console.log(envContent);
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message);
}
