// Script para cargar datos de ejemplo en la consola del navegador
// Copia y pega esto en la consola (F12) cuando la app esté corriendo

// Importar la función (ya debe estar disponible en tu app)
// Solo ejecuta esto:

console.log('🔄 Iniciando carga de datos de ejemplo...');

// Recargar la página para asegurar que el módulo está disponible
if (typeof window.loadDemoData === 'function') {
  window.loadDemoData();
} else {
  console.log('⚠️ Usa el botón "Cargar Datos de Ejemplo" en la interfaz');
  console.log('O ejecuta: indexedDB.deleteDatabase("SportsHealthDB") y recarga la página');
}

