import { seed } from '../lib/db/seed';

async function main() {
  try {
    await seed();
    console.log('✅ Base de datos poblada exitosamente!');
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

main();
