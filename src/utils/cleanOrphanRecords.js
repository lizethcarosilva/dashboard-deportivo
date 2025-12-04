import database from '../services/database';

/**
 * Elimina registros huérfanos (sin deportista asociado) y genera nuevos registros
 * para deportistas que no tengan registros
 */
export const cleanOrphanRecords = async () => {
  try {
    console.log('🧹 Limpiando registros huérfanos...');
    
    // Obtener todos los deportistas y registros
    const athletes = await database.getAllAthletes();
    const allRecords = await database.getAllSportRecords();
    
    console.log(`📊 Deportistas actuales: ${athletes.length}`);
    console.log(`📊 Registros totales: ${allRecords.length}`);
    
    // Crear un Set con los IDs de deportistas válidos
    const validAthleteIds = new Set(athletes.map(a => Number(a.id)));
    
    // Encontrar y eliminar registros huérfanos
    let orphanCount = 0;
    for (const record of allRecords) {
      if (!validAthleteIds.has(Number(record.athleteId))) {
        await database.deleteSportRecord(record.id);
        orphanCount++;
      }
    }
    
    console.log(`🗑️ Registros huérfanos eliminados: ${orphanCount}`);
    
    // Función para generar registros según el deporte
    const generateRecords = (athleteId, sport, count = 10) => {
      const records = [];
      const today = new Date();

      for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 5)); // Registros cada 5 días

        let recordData = {
          athleteId,
          sport,
          date: date.toISOString(),
          createdAt: date.toISOString(),
        };

        // Generar datos realistas según el deporte
        switch (sport) {
          case 'futbol':
            recordData = {
              ...recordData,
              goles: Math.floor(Math.random() * 5) + (i < 3 ? 1 : 0),
              asistencias: Math.floor(Math.random() * 4),
              partidosJugados: Math.floor(Math.random() * 3) + 1,
            };
            break;
          case 'baloncesto':
            const basePoints = 20 + (10 - i) * 2;
            recordData = {
              ...recordData,
              puntos: Math.floor(Math.random() * 15) + basePoints,
              rebotes: Math.floor(Math.random() * 8) + 5,
              asistencias: Math.floor(Math.random() * 10) + 3,
            };
            break;
          case 'tenis':
            recordData = {
              ...recordData,
              partidosGanados: Math.floor(Math.random() * 4) + (i < 5 ? 1 : 0),
              partidosPerdidos: Math.floor(Math.random() * 3),
              aces: Math.floor(Math.random() * 15) + 5,
            };
            break;
          case 'atletismo':
            const baseTime = 9.8 + (i * 0.05);
            recordData = {
              ...recordData,
              mejorTiempo: (baseTime + Math.random() * 0.3).toFixed(2),
              competicionesGanadas: Math.floor(Math.random() * 2) + (i < 3 ? 1 : 0),
            };
            break;
          case 'natacion':
            const estilos = ['Libre', 'Espalda', 'Mariposa', 'Pecho'];
            const baseSwimTime = 48 + (i * 0.2);
            recordData = {
              ...recordData,
              mejorTiempo: (baseSwimTime + Math.random() * 2).toFixed(2),
              estiloPrincipal: estilos[Math.floor(Math.random() * estilos.length)],
            };
            break;
        }

        records.push(recordData);
      }
      return records;
    };
    
    // Generar registros para deportistas sin registros
    let newRecordsCount = 0;
    for (const athlete of athletes) {
      const athleteRecords = await database.getAthleteSportRecords(athlete.id);
      
      if (athleteRecords.length === 0) {
        console.log(`📝 Generando registros para: ${athlete.fullName}`);
        const records = generateRecords(athlete.id, athlete.sport, 10);
        for (const record of records) {
          await database.addSportRecord(record);
          newRecordsCount++;
        }
      }
    }
    
    console.log(`✅ Nuevos registros creados: ${newRecordsCount}`);
    console.log('🎉 Limpieza completada exitosamente');
    
    return {
      orphansDeleted: orphanCount,
      newRecordsCreated: newRecordsCount,
      success: true
    };
  } catch (error) {
    console.error('❌ Error al limpiar registros huérfanos:', error);
    return {
      orphansDeleted: 0,
      newRecordsCreated: 0,
      success: false,
      error
    };
  }
};

