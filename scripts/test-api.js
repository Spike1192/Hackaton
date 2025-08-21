import fetch from 'node-fetch';

async function testAPI() {
  console.log('🔍 Probando API de profesores...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/teachers');
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API funcionando correctamente');
      console.log(`👨‍🏫 Profesores encontrados: ${data.length}`);
      
      if (data.length > 0) {
        console.log('📋 Primer profesor:');
        console.log(`   Nombre: ${data[0].firstName} ${data[0].lastName}`);
        console.log(`   Email: ${data[0].email}`);
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Error en la API:');
      console.log(errorData);
    }
    
  } catch (error) {
    console.log('❌ Error al conectar con la API:', error.message);
  }
}

testAPI();
