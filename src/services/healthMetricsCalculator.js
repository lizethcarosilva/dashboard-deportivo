/**
 * Servicio para calcular métricas compuestas de salud
 * Convierte datos individuales en puntuaciones de salud metabólica, cardiovascular, ósea y hormonal
 */

/**
 * Calcula la edad biológica basada en múltiples factores
 */
export const calcularEdadBiologica = (datosPersonales, metricas) => {
  const { edadCronologica, sexo, altura, peso } = datosPersonales;
  const { 
    actividadFisica, 
    circulacion, 
    sueño, 
    respiracion, 
    antiStress 
  } = metricas;

  // Cálculo simplificado de edad biológica
  // Base: edad cronológica
  let edadBiologica = edadCronologica;

  // Ajustes por factores (escala 0-100 para cada factor)
  const factores = [
    actividadFisica,
    circulacion,
    sueño,
    respiracion,
    antiStress
  ].filter(f => f !== null && f !== undefined);

  if (factores.length > 0) {
    const promedioFactores = factores.reduce((sum, val) => sum + val, 0) / factores.length;
    
    // Por cada 10 puntos sobre 50, resta ~1 año
    // Por cada 10 puntos bajo 50, suma ~1 año
    const ajuste = (promedioFactores - 50) / 10;
    edadBiologica = Math.max(18, edadCronologica - ajuste);
  }

  // Ajuste por IMC
  const imc = calcularIMC(peso, altura);
  if (imc < 18.5 || imc > 25) {
    edadBiologica += Math.abs(imc - 22) * 0.3;
  }

  return Math.round(edadBiologica * 10) / 10;
};

/**
 * Calcula la velocidad de envejecimiento
 */
export const calcularVelocidadEnvejecimiento = (edadBiologica, edadCronologica) => {
  // Velocidad = EdadBiológica / EdadCronológica
  // 1.0 = envejecimiento normal
  // < 1.0 = envejecimiento lento (bueno)
  // > 1.0 = envejecimiento rápido (malo)
  if (!edadCronologica || edadCronologica === 0) return 1.0;
  return Math.round((edadBiologica / edadCronologica) * 100) / 100;
};

/**
 * Calcula IMC
 */
export const calcularIMC = (peso, altura) => {
  if (!peso || !altura) return 0;
  const alturaMetros = altura / 100;
  return Math.round((peso / (alturaMetros * alturaMetros)) * 10) / 10;
};

/**
 * SALUD METABÓLICA (0-100)
 * Factores: IMC, peso, grasa corporal, actividad física
 */
export const calcularSaludMetabolica = (datosPersonales, metricas) => {
  const { peso, altura } = datosPersonales;
  const { actividadFisica, grasaCorporal } = metricas;

  let puntuacion = 0;
  let factores = 0;

  // IMC (35 puntos)
  const imc = calcularIMC(peso, altura);
  if (imc > 0) {
    factores++;
    if (imc >= 18.5 && imc <= 24.9) {
      puntuacion += 35;
    } else if (imc >= 17 && imc < 18.5) {
      puntuacion += 25;
    } else if (imc >= 25 && imc <= 27) {
      puntuacion += 25;
    } else if (imc >= 27 && imc <= 30) {
      puntuacion += 15;
    } else {
      puntuacion += 5;
    }
  }

  // Actividad Física (40 puntos)
  if (actividadFisica !== null && actividadFisica !== undefined) {
    factores++;
    puntuacion += (actividadFisica / 100) * 40;
  }

  // Grasa Corporal (25 puntos)
  if (grasaCorporal !== null && grasaCorporal !== undefined) {
    factores++;
    // Rangos saludables: Hombres 10-20%, Mujeres 18-28%
    const rangoIdeal = datosPersonales.sexo === 'M' ? [10, 20] : [18, 28];
    if (grasaCorporal >= rangoIdeal[0] && grasaCorporal <= rangoIdeal[1]) {
      puntuacion += 25;
    } else {
      const desviacion = Math.min(
        Math.abs(grasaCorporal - rangoIdeal[0]),
        Math.abs(grasaCorporal - rangoIdeal[1])
      );
      puntuacion += Math.max(0, 25 - desviacion * 2);
    }
  }

  return factores > 0 ? Math.round(puntuacion) : 0;
};

/**
 * SALUD CARDIOVASCULAR (0-100)
 * Factores: ritmo cardíaco, tensión, circulación, respiración
 */
export const calcularSaludCardiovascular = (metricas) => {
  const { ritmoCardiaco, tension, circulacion, respiracion } = metricas;

  let puntuacion = 0;
  let factores = 0;

  // Ritmo Cardíaco en reposo (30 puntos)
  if (ritmoCardiaco) {
    factores++;
    if (ritmoCardiaco >= 60 && ritmoCardiaco <= 80) {
      puntuacion += 30;
    } else if (ritmoCardiaco >= 50 && ritmoCardiaco < 60) {
      puntuacion += 25; // Atletas
    } else if (ritmoCardiaco > 80 && ritmoCardiaco <= 100) {
      puntuacion += 20;
    } else if (ritmoCardiaco > 100) {
      puntuacion += 10;
    } else {
      puntuacion += 15;
    }
  }

  // Tensión arterial (30 puntos)
  if (tension) {
    factores++;
    const [sistolica, diastolica] = tension.split('/').map(Number);
    if (sistolica && diastolica) {
      if (sistolica >= 90 && sistolica <= 120 && diastolica >= 60 && diastolica <= 80) {
        puntuacion += 30;
      } else if (sistolica >= 120 && sistolica <= 139 || diastolica >= 80 && diastolica <= 89) {
        puntuacion += 20; // Pre-hipertensión
      } else {
        puntuacion += 10;
      }
    }
  }

  // Circulación (20 puntos)
  if (circulacion !== null && circulacion !== undefined) {
    factores++;
    puntuacion += (circulacion / 100) * 20;
  }

  // Respiración (20 puntos)
  if (respiracion !== null && respiracion !== undefined) {
    factores++;
    puntuacion += (respiracion / 100) * 20;
  }

  return factores > 0 ? Math.round(puntuacion) : 0;
};

/**
 * SALUD ÓSEA (0-100)
 * Factores: IMC, actividad física, edad
 */
export const calcularSaludOsea = (datosPersonales, metricas) => {
  const { peso, altura, edadCronologica } = datosPersonales;
  const { actividadFisica } = metricas;

  let puntuacion = 0;
  let factores = 0;

  // Actividad física (50 puntos) - crucial para salud ósea
  if (actividadFisica !== null && actividadFisica !== undefined) {
    factores++;
    puntuacion += (actividadFisica / 100) * 50;
  }

  // IMC (30 puntos) - peso adecuado protege huesos
  const imc = calcularIMC(peso, altura);
  if (imc > 0) {
    factores++;
    if (imc >= 18.5 && imc <= 27) {
      puntuacion += 30;
    } else if (imc < 18.5) {
      puntuacion += 10; // Bajo peso es riesgo para huesos
    } else {
      puntuacion += 20;
    }
  }

  // Edad (20 puntos) - factor de ajuste
  if (edadCronologica) {
    factores++;
    if (edadCronologica < 30) {
      puntuacion += 20;
    } else if (edadCronologica < 50) {
      puntuacion += 15;
    } else if (edadCronologica < 70) {
      puntuacion += 10;
    } else {
      puntuacion += 5;
    }
  }

  return factores > 0 ? Math.round(puntuacion) : 0;
};

/**
 * SALUD HORMONAL (0-100)
 * Factores: sueño, estrés, edad biológica vs cronológica
 */
export const calcularSaludHormonal = (datosPersonales, metricas, edadBiologica) => {
  const { edadCronologica } = datosPersonales;
  const { sueño, antiStress } = metricas;

  let puntuacion = 0;
  let factores = 0;

  // Sueño (40 puntos) - crítico para hormonas
  if (sueño !== null && sueño !== undefined) {
    factores++;
    puntuacion += (sueño / 100) * 40;
  }

  // Anti-estrés (35 puntos)
  if (antiStress !== null && antiStress !== undefined) {
    factores++;
    puntuacion += (antiStress / 100) * 35;
  }

  // Diferencia de edad (25 puntos)
  if (edadBiologica && edadCronologica) {
    factores++;
    const diferencia = edadCronologica - edadBiologica;
    if (diferencia >= 5) {
      puntuacion += 25; // Edad biológica menor = excelente
    } else if (diferencia >= 0) {
      puntuacion += 20;
    } else if (diferencia >= -5) {
      puntuacion += 15;
    } else {
      puntuacion += 5;
    }
  }

  return factores > 0 ? Math.round(puntuacion) : 0;
};

/**
 * Calcula todas las métricas de salud
 */
export const calcularTodasLasMetricas = (datosPersonales, metricas) => {
  const edadBiologica = calcularEdadBiologica(datosPersonales, metricas);
  const velocidadEnvejecimiento = calcularVelocidadEnvejecimiento(
    edadBiologica,
    datosPersonales.edadCronologica
  );

  return {
    edadBiologica,
    velocidadEnvejecimiento,
    diferenciaEdad: Math.round((datosPersonales.edadCronologica - edadBiologica) * 10) / 10,
    saludMetabolica: calcularSaludMetabolica(datosPersonales, metricas),
    saludCardiovascular: calcularSaludCardiovascular(metricas),
    saludOsea: calcularSaludOsea(datosPersonales, metricas),
    saludHormonal: calcularSaludHormonal(datosPersonales, metricas, edadBiologica),
  };
};

/**
 * Obtiene la interpretación de una puntuación
 */
export const obtenerInterpretacion = (puntuacion) => {
  if (puntuacion >= 80) return { nivel: 'Excelente', color: 'green' };
  if (puntuacion >= 60) return { nivel: 'Bueno', color: 'blue' };
  if (puntuacion >= 40) return { nivel: 'Regular', color: 'yellow' };
  if (puntuacion >= 20) return { nivel: 'Bajo', color: 'orange' };
  return { nivel: 'Crítico', color: 'red' };
};

