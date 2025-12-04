import database from '../services/database';

// Variable para prevenir ejecuciones concurrentes
let isLoading = false;

export const loadInitialData = async () => {
  // Prevenir ejecuciones concurrentes (race condition en StrictMode)
  if (isLoading) {
    console.log('⏳ Carga ya en progreso, omitiendo...');
    return false;
  }

  isLoading = true;
  
  try {
    console.log('🗑️  Eliminando datos existentes...');
    const existingAthletes = await database.getAllAthletes();
    
    if (existingAthletes && existingAthletes.length > 0) {
      // Eliminar todos los registros de cada deportista
      for (const athlete of existingAthletes) {
        await database.deleteAthleteRecords(athlete.id);
        await database.deleteAthlete(athlete.id);
      }
      console.log(`✅ ${existingAthletes.length} deportistas eliminados`);
    }

    const currentCoach = JSON.parse(localStorage.getItem('currentCoach') || '{"id": 1}');
    const coachId = currentCoach.id || 1;

    // Datos de deportistas - ÚNICOS (3 por cada deporte = 15 total)
    const athletesData = [
      // ⚽ FÚTBOL (3 deportistas)
      {
        fullName: 'Cristiano Ronaldo',
        sport: 'futbol',
        age: 38,
        country: 'Portugal',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Lionel Messi',
        sport: 'futbol',
        age: 36,
        country: 'Argentina',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Kylian Mbappé',
        sport: 'futbol',
        age: 25,
        country: 'Francia',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },

      // 🏀 BALONCESTO (3 deportistas)
      {
        fullName: 'LeBron James',
        sport: 'baloncesto',
        age: 39,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Stephen Curry',
        sport: 'baloncesto',
        age: 35,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Luka Doncic',
        sport: 'baloncesto',
        age: 25,
        country: 'Eslovenia',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },

      // 🎾 TENIS (3 deportistas)
      {
        fullName: 'Carlos Alcaraz',
        sport: 'tenis',
        age: 21,
        country: 'España',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Novak Djokovic',
        sport: 'tenis',
        age: 36,
        country: 'Serbia',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Rafael Nadal',
        sport: 'tenis',
        age: 37,
        country: 'España',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },

      // 🏃 ATLETISMO (3 deportistas)
      {
        fullName: 'Usain Bolt',
        sport: 'atletismo',
        age: 37,
        country: 'Jamaica',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Eliud Kipchoge',
        sport: 'atletismo',
        age: 39,
        country: 'Kenia',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Noah Lyles',
        sport: 'atletismo',
        age: 26,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },

      // 🏊 NATACIÓN (3 deportistas)
      {
        fullName: 'Michael Phelps',
        sport: 'natacion',
        age: 38,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Katie Ledecky',
        sport: 'natacion',
        age: 27,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
      {
        fullName: 'Caeleb Dressel',
        sport: 'natacion',
        age: 27,
        country: 'Estados Unidos',
        photoUrl: '',
        coachId,
        createdAt: new Date().toISOString(),
      },
    ];

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

        // Generar datos realistas según el deporte con variación progresiva
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
            const basePoints = 20 + (10 - i) * 2; // Mejor rendimiento más reciente
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
            const baseTime = 9.8 + (i * 0.05); // Tiempos mejoran hacia registros recientes
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

    // Insertar deportistas y sus registros
    console.log('📊 Cargando nuevos datos en IndexedDB...');
    let totalRecords = 0;
    
    for (const athleteData of athletesData) {
      const athleteId = await database.addAthlete(athleteData);
      console.log(`✅ ${athleteData.fullName} (${athleteData.sport}) - ID: ${athleteId}`);

      // Generar y guardar registros (10 registros por deportista)
      const records = generateRecords(athleteId, athleteData.sport, 10);
      for (const record of records) {
        await database.addSportRecord(record);
      }
      totalRecords += records.length;
    }

    console.log('');
    console.log('🎉 ¡Datos cargados exitosamente!');
    console.log(`📋 Total deportistas: ${athletesData.length}`);
    console.log(`📊 Total registros: ${totalRecords}`);
    console.log('⚽ Fútbol: 3 deportistas');
    console.log('🏀 Baloncesto: 3 deportistas');
    console.log('🎾 Tenis: 3 deportistas');
    console.log('🏃 Atletismo: 3 deportistas');
    console.log('🏊 Natación: 3 deportistas');
    console.log('✅ Total: 15 deportistas únicos (SIN DUPLICADOS)');
    
    return true;
  } catch (error) {
    console.error('❌ Error al cargar datos iniciales:', error);
    return false;
  } finally {
    isLoading = false;
  }
};

