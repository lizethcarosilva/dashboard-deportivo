/**
 * Datos de ejemplo para el sistema de métricas de salud
 * Puedes usar estos datos para hacer pruebas del sistema
 */

export const deportistasEjemplo = [
  {
    name: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    phone: '+34 600 123 456',
    sport: 'soccer',
    status: 'active',
  },
  {
    name: 'María García',
    email: 'maria.garcia@ejemplo.com',
    phone: '+34 600 234 567',
    sport: 'tennis',
    status: 'active',
  },
  {
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@ejemplo.com',
    phone: '+34 600 345 678',
    sport: 'swimming',
    status: 'active',
  },
];

export const metricasSaludEjemplo = [
  // ========== JUAN PÉREZ (athleteId: 1) - 3 Evaluaciones ==========
  {
    // Juan - Evaluación Diciembre 2025 (Más reciente)
    athleteId: 1,
    fechaCaptura: new Date('2025-12-03T10:30:00'),
    hora: '10:30',
    
    sexo: 'M',
    edad: 28,
    altura: 178,
    peso: 75,
    
    tension: '118/75',
    ritmoCardiaco: 58,
    temperatura: 36.5,
    grasaCorporal: 14.5,
    imc: 23.7,
    
    actividadFisica: 90,
    circulacion: 85,
    sueño: 80,
    respiracion: 88,
    antiStress: 75,
    
    notas: 'Excelente estado físico. Atleta de alto rendimiento.',
  },
  {
    // Juan - Evaluación Noviembre 2025
    athleteId: 1,
    fechaCaptura: new Date('2025-11-05T09:00:00'),
    hora: '09:00',
    
    sexo: 'M',
    edad: 28,
    altura: 178,
    peso: 76.5,
    
    tension: '120/78',
    ritmoCardiaco: 60,
    temperatura: 36.4,
    grasaCorporal: 15.2,
    imc: 24.1,
    
    actividadFisica: 85,
    circulacion: 82,
    sueño: 75,
    respiracion: 85,
    antiStress: 70,
    
    notas: 'Evaluación mensual. Mejora notable en todas las áreas.',
  },
  {
    // Juan - Evaluación Octubre 2025
    athleteId: 1,
    fechaCaptura: new Date('2025-10-10T08:45:00'),
    hora: '08:45',
    
    sexo: 'M',
    edad: 28,
    altura: 178,
    peso: 77,
    
    tension: '122/80',
    ritmoCardiaco: 62,
    temperatura: 36.3,
    grasaCorporal: 16,
    imc: 24.3,
    
    actividadFisica: 80,
    circulacion: 78,
    sueño: 70,
    respiracion: 82,
    antiStress: 65,
    
    notas: 'Inicio de temporada. Buenos indicadores generales.',
  },

  // ========== MARÍA GARCÍA (athleteId: 2) - 3 Evaluaciones ==========
  {
    // María - Evaluación Diciembre 2025 (Más reciente)
    athleteId: 2,
    fechaCaptura: new Date('2025-12-02T11:00:00'),
    hora: '11:00',
    
    sexo: 'F',
    edad: 35,
    altura: 165,
    peso: 58,
    
    tension: '122/78',
    ritmoCardiaco: 65,
    temperatura: 36.4,
    grasaCorporal: 22,
    imc: 21.3,
    
    actividadFisica: 75,
    circulacion: 70,
    sueño: 65,
    respiracion: 72,
    antiStress: 68,
    
    notas: 'Buen estado general. Recomendado mejorar calidad del sueño.',
  },
  {
    // María - Evaluación Noviembre 2025
    athleteId: 2,
    fechaCaptura: new Date('2025-11-08T10:30:00'),
    hora: '10:30',
    
    sexo: 'F',
    edad: 35,
    altura: 165,
    peso: 59,
    
    tension: '124/80',
    ritmoCardiaco: 68,
    temperatura: 36.5,
    grasaCorporal: 23,
    imc: 21.7,
    
    actividadFisica: 70,
    circulacion: 68,
    sueño: 60,
    respiracion: 70,
    antiStress: 65,
    
    notas: 'Progreso en entrenamiento. Trabajar en recuperación nocturna.',
  },
  {
    // María - Evaluación Octubre 2025
    athleteId: 2,
    fechaCaptura: new Date('2025-10-15T16:30:00'),
    hora: '16:30',
    
    sexo: 'F',
    edad: 35,
    altura: 165,
    peso: 60,
    
    tension: '125/82',
    ritmoCardiaco: 70,
    temperatura: 36.5,
    grasaCorporal: 24,
    imc: 22.0,
    
    actividadFisica: 60,
    circulacion: 65,
    sueño: 55,
    respiracion: 68,
    antiStress: 60,
    
    notas: 'Comenzando programa de entrenamiento. Progreso constante.',
  },

  // ========== CARLOS RODRÍGUEZ (athleteId: 3) - 3 Evaluaciones ==========
  {
    // Carlos - Evaluación Diciembre 2025 (Más reciente)
    athleteId: 3,
    fechaCaptura: new Date('2025-12-01T15:00:00'),
    hora: '15:00',
    
    sexo: 'M',
    edad: 42,
    altura: 182,
    peso: 88,
    
    tension: '135/85',
    ritmoCardiaco: 75,
    temperatura: 36.6,
    grasaCorporal: 24,
    imc: 26.6,
    
    actividadFisica: 50,
    circulacion: 55,
    sueño: 45,
    respiracion: 60,
    antiStress: 40,
    
    notas: 'Necesita mejorar hábitos de sueño y manejo del estrés. Sobrepeso leve.',
  },
  {
    // Carlos - Evaluación Noviembre 2025
    athleteId: 3,
    fechaCaptura: new Date('2025-11-03T14:00:00'),
    hora: '14:00',
    
    sexo: 'M',
    edad: 42,
    altura: 182,
    peso: 90,
    
    tension: '138/88',
    ritmoCardiaco: 78,
    temperatura: 36.7,
    grasaCorporal: 26,
    imc: 27.2,
    
    actividadFisica: 40,
    circulacion: 50,
    sueño: 40,
    respiracion: 55,
    antiStress: 35,
    
    notas: 'Evaluación anterior. Niveles de estrés elevados, sedentarismo.',
  },
  {
    // Carlos - Evaluación Octubre 2025
    athleteId: 3,
    fechaCaptura: new Date('2025-10-05T13:30:00'),
    hora: '13:30',
    
    sexo: 'M',
    edad: 42,
    altura: 182,
    peso: 92,
    
    tension: '140/90',
    ritmoCardiaco: 80,
    temperatura: 36.8,
    grasaCorporal: 28,
    imc: 27.8,
    
    actividadFisica: 30,
    circulacion: 45,
    sueño: 35,
    respiracion: 50,
    antiStress: 30,
    
    notas: 'Primera evaluación. Inicio de programa de mejora de salud.',
  },
];

/**
 * Función para insertar datos de ejemplo en la base de datos
 * USAR SOLO PARA PRUEBAS
 */
export async function insertarDatosEjemplo(database) {
  try {
    console.log('🔄 Insertando datos de ejemplo...');
    
    // Obtener el coach actual
    const currentCoach = JSON.parse(localStorage.getItem('currentCoach') || '{"id": 1}');
    
    // 1. Insertar deportistas (solo si no existen)
    console.log('➕ Verificando deportistas...');
    const allAthletes = await database.getAllAthletes();
    const athleteIdMap = new Map(); // Mapeo de athleteId ejemplo -> ID real
    
    for (let i = 0; i < deportistasEjemplo.length; i++) {
      const deportista = deportistasEjemplo[i];
      try {
        // Verificar si ya existe por email
        const existente = allAthletes.find(a => a.email === deportista.email);
        if (existente) {
          console.log(`⚠️ Deportista ya existe: ${deportista.name} (ID: ${existente.id})`);
          athleteIdMap.set(i + 1, existente.id); // Mapear ID ejemplo (1,2,3) a ID real
        } else {
          const id = await database.addAthlete({
            ...deportista,
            coachId: currentCoach.id || 1,
            createdAt: new Date().toISOString(),
          });
          athleteIdMap.set(i + 1, id); // Mapear ID ejemplo (1,2,3) a ID real
          console.log(`✅ Deportista agregado: ${deportista.name} (ID: ${id})`);
        }
      } catch (error) {
        console.log(`❌ Error con deportista ${deportista.name}:`, error);
      }
    }
    
    // 2. Verificar si ya existen métricas de ejemplo
    console.log('➕ Verificando métricas existentes...');
    let metricasAgregadas = 0;
    
    for (const metrica of metricasSaludEjemplo) {
      try {
        // Obtener el ID real del deportista usando el mapeo
        const realAthleteId = athleteIdMap.get(metrica.athleteId);
        
        if (!realAthleteId) {
          console.log(`⚠️ No se encontró ID real para athleteId ejemplo ${metrica.athleteId}`);
          continue;
        }
        
        // Obtener las métricas existentes del deportista
        const metricasExistentes = await database.getAthleteHealthMetrics(realAthleteId);
        
        // Verificar si ya existe una métrica con la misma fecha y hora
        const fechaMetrica = metrica.fechaCaptura.toISOString();
        const yaExiste = metricasExistentes.some(m => 
          m.fechaCaptura === fechaMetrica && m.hora === metrica.hora
        );
        
        if (yaExiste) {
          console.log(`⚠️ Métrica ya existe para deportista ID ${realAthleteId} en ${metrica.hora}`);
        } else {
          await database.addHealthMetric({
            ...metrica,
            athleteId: realAthleteId, // Usar el ID real, no el de ejemplo
            fechaCaptura: fechaMetrica,
            createdAt: new Date().toISOString(),
          });
          metricasAgregadas++;
          console.log(`✅ Métrica agregada para deportista ID: ${realAthleteId}`);
        }
      } catch (error) {
        console.error(`❌ Error al agregar métrica:`, error);
      }
    }
    
    console.log(`✅ Proceso completado!`);
    console.log(`   - Deportistas en sistema: ${allAthletes.length}`);
    console.log(`   - Nuevos deportistas agregados: ${athleteIdMap.size - allAthletes.length}`);
    console.log(`   - Métricas agregadas: ${metricasAgregadas} de ${metricasSaludEjemplo.length} posibles`);
    return true;
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
    return false;
  }
}

/**
 * Guía rápida de valores para evaluación subjetiva (0-100)
 */
export const guiaEvaluacion = {
  actividadFisica: {
    0: 'Sedentario completo',
    20: '1-2 días/semana de ejercicio ligero',
    40: '3 días/semana ejercicio moderado',
    60: '4-5 días/semana ejercicio moderado-intenso',
    80: '5-6 días/semana ejercicio intenso',
    100: 'Atleta profesional, entrenamiento diario intenso',
  },
  circulacion: {
    0: 'Problemas graves de circulación',
    20: 'Frecuentes problemas (manos/pies fríos, entumecimiento)',
    40: 'Problemas ocasionales',
    60: 'Circulación generalmente buena',
    80: 'Excelente circulación, sin problemas',
    100: 'Circulación óptima, recuperación rápida',
  },
  sueño: {
    0: 'Insomnio crónico, <4 horas',
    20: '4-5 horas, mala calidad',
    40: '5-6 horas, calidad regular',
    60: '6-7 horas, calidad aceptable',
    80: '7-8 horas, buena calidad',
    100: '8+ horas, calidad excelente, descanso completo',
  },
  respiracion: {
    0: 'Problemas respiratorios severos',
    20: 'Dificultad respiratoria frecuente',
    40: 'Respiración algo limitada en esfuerzo',
    60: 'Respiración adecuada en actividades normales',
    80: 'Muy buena capacidad respiratoria',
    100: 'Capacidad respiratoria de atleta élite',
  },
  antiStress: {
    0: 'Estrés crónico severo, sin control',
    20: 'Alto nivel de estrés constante',
    40: 'Estrés moderado frecuente',
    60: 'Estrés ocasional, manejo aceptable',
    80: 'Buen manejo del estrés, relajado',
    100: 'Excelente equilibrio emocional, sin estrés',
  },
};

/**
 * Valores de referencia médicos
 */
export const valoresReferencia = {
  imc: {
    bajoPeso: '< 18.5',
    normal: '18.5 - 24.9',
    sobrepeso: '25.0 - 29.9',
    obesidad: '≥ 30.0',
  },
  ritmoCardiaco: {
    atletas: '40 - 60 bpm',
    excelente: '60 - 70 bpm',
    bueno: '70 - 80 bpm',
    regular: '80 - 100 bpm',
    preocupante: '> 100 bpm',
  },
  tension: {
    optima: '< 120/80',
    normal: '120-129/80-84',
    normalAlta: '130-139/85-89',
    hipertension: '≥ 140/90',
  },
  grasaCorporal: {
    hombres: {
      atleta: '6-13%',
      fitness: '14-17%',
      aceptable: '18-24%',
      sobrepeso: '≥ 25%',
    },
    mujeres: {
      atleta: '14-20%',
      fitness: '21-24%',
      aceptable: '25-31%',
      sobrepeso: '≥ 32%',
    },
  },
};

