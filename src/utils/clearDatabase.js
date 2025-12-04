import database from '../services/database';

export const clearDatabase = async () => {
  try {
    console.log('🗑️ Limpiando base de datos completa...');
    
    // Obtener todos los deportistas
    const athletes = await database.getAllAthletes();
    console.log(`📊 Deportistas encontrados: ${athletes.length}`);
    
    // Eliminar registros de cada deportista
    for (const athlete of athletes) {
      await database.deleteAthleteRecords(athlete.id);
    }
    console.log('✅ Registros eliminados');
    
    // Eliminar todos los deportistas
    for (const athlete of athletes) {
      await database.deleteAthlete(athlete.id);
    }
    console.log('✅ Deportistas eliminados');
    
    console.log('🎉 Base de datos limpiada completamente');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error);
    return false;
  }
};

