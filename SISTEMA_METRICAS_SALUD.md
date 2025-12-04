# Sistema Integral de Métricas de Salud Deportiva

## 📋 Descripción General

Este sistema permite realizar un análisis completo de la salud de los deportistas mediante la captura de múltiples variables y su visualización en una **gráfica de telaraña** que representa 4 dimensiones principales de salud.

## 🎯 Datos Capturados

### Datos Personales
- **Sexo**: Masculino/Femenino
- **Edad Cronológica**: Edad real en años
- **Altura**: En centímetros
- **Peso**: En kilogramos

### Métricas Físicas Básicas
- **Tensión Arterial**: Formato 120/80
- **Ritmo Cardíaco**: Pulsaciones por minuto (bpm)
- **Temperatura Corporal**: En grados Celsius
- **Grasa Corporal**: Porcentaje (%)
- **IMC**: Calculado automáticamente

### Métricas de Estilo de Vida (Escala 0-100)
- **Actividad Física** (0-100): Frecuencia e intensidad del ejercicio
- **Circulación** (0-100): Calidad de la circulación sanguínea
- **Sueño** (0-100): Horas y calidad del descanso
- **Respiración** (0-100): Capacidad y eficiencia respiratoria
- **Anti-Stress** (0-100): Capacidad de manejo del estrés

### Fecha de Captura
Cada registro incluye la fecha y hora exacta de la evaluación.

## 📊 Métricas Calculadas

### 1. Edad Biológica
Se calcula considerando:
- Edad cronológica como base
- Promedio de las 5 métricas de estilo de vida
- IMC y su desviación del valor ideal
- Cada 10 puntos sobre 50 en las métricas reduce ~1 año de edad biológica
- Cada 10 puntos bajo 50 suma ~1 año

### 2. Velocidad de Envejecimiento
**Fórmula**: `Edad Biológica / Edad Cronológica`

- **< 0.9**: 🚀 Envejecimiento Lento (Excelente)
- **0.9 - 1.1**: ✅ Envejecimiento Normal
- **1.1 - 1.3**: ⚠️ Envejecimiento Acelerado
- **> 1.3**: 🚨 Envejecimiento Muy Acelerado

### 3. Diferencia de Edad
`Edad Cronológica - Edad Biológica`
- Valor positivo = edad biológica menor (mejor)
- Valor negativo = edad biológica mayor (necesita atención)

## 🕸️ Gráfica de Telaraña - 4 Dimensiones de Salud

### 1. 🔥 Salud Metabólica (0-100)
**Factores considerados:**
- **IMC (35 puntos)**: Rango ideal 18.5-24.9
- **Actividad Física (40 puntos)**: Directamente proporcional
- **Grasa Corporal (25 puntos)**: Rangos saludables según sexo
  - Hombres: 10-20%
  - Mujeres: 18-28%

### 2. ❤️ Salud Cardiovascular (0-100)
**Factores considerados:**
- **Ritmo Cardíaco (30 puntos)**: Rango ideal 60-80 bpm
- **Tensión Arterial (30 puntos)**: Ideal 90-120/60-80 mmHg
- **Circulación (20 puntos)**: Evaluación subjetiva
- **Respiración (20 puntos)**: Capacidad respiratoria

### 3. 🦴 Salud Ósea (0-100)
**Factores considerados:**
- **Actividad Física (50 puntos)**: Crítico para densidad ósea
- **IMC (30 puntos)**: Peso adecuado protege los huesos
- **Edad (20 puntos)**: Factor de ajuste
  - < 30 años: 20 puntos
  - 30-50 años: 15 puntos
  - 50-70 años: 10 puntos
  - > 70 años: 5 puntos

### 4. ⚡ Salud Hormonal (0-100)
**Factores considerados:**
- **Sueño (40 puntos)**: Crítico para equilibrio hormonal
- **Anti-Stress (35 puntos)**: Cortisol y hormonas del estrés
- **Diferencia de Edad (25 puntos)**:
  - ≥ 5 años menor: 25 puntos (excelente)
  - 0-5 años menor: 20 puntos
  - 0 a -5 años: 15 puntos
  - < -5 años: 5 puntos

## 🎨 Interpretación de Puntuaciones

| Rango | Nivel | Color | Significado |
|-------|-------|-------|-------------|
| 80-100 | Excelente | 🟢 Verde | Salud óptima |
| 60-79 | Bueno | 🔵 Azul | Salud adecuada |
| 40-59 | Regular | 🟡 Amarillo | Necesita mejoras |
| 20-39 | Bajo | 🟠 Naranja | Requiere atención |
| 0-19 | Crítico | 🔴 Rojo | Atención urgente |

## 💡 Cómo Usar el Sistema

### 1. Agregar Deportista
- Ir a la pestaña "👥 Deportistas"
- Hacer clic en "Agregar Deportista"
- Completar nombre, email, deporte, etc.

### 2. Registrar Métricas Básicas (Opcional)
- Ir a "📊 Métricas Físicas Básicas"
- Registrar peso, ritmo cardíaco, tensión, etc.
- Útil para seguimiento rápido

### 3. Evaluación Integral de Salud
- Ir a "🕸️ Análisis Integral de Salud"
- Seleccionar deportista
- Hacer clic en "Nueva Evaluación"
- Completar todos los datos:
  - Datos personales
  - Métricas físicas
  - Evaluación de estilo de vida (sliders 0-100)
- Guardar

### 4. Visualizar Resultados
- La gráfica de telaraña muestra automáticamente las 4 dimensiones
- Panel lateral con puntuaciones detalladas
- Análisis de edad biológica vs cronológica
- Velocidad de envejecimiento
- Puntuación general de salud

### 5. Seguimiento en el Tiempo
- Todas las evaluaciones se guardan con fecha/hora
- Historial completo en la tabla inferior
- Permite ver evolución del deportista
- Hacer clic en "Ver Análisis" para cualquier registro previo

## 📈 Ejemplo de Interpretación

### Deportista: Juan Pérez
**Edad Cronológica**: 35 años  
**Edad Biológica**: 32 años  
**Velocidad de Envejecimiento**: 0.91x (Lento - Excelente)

**Puntuaciones:**
- 🔥 Salud Metabólica: 85/100 (Excelente)
- ❤️ Salud Cardiovascular: 72/100 (Bueno)
- 🦴 Salud Ósea: 68/100 (Bueno)
- ⚡ Salud Hormonal: 78/100 (Bueno)

**Puntuación General**: 76/100

**Interpretación**: El deportista muestra un excelente estado de salud metabólica y está envejeciendo más lento que lo normal. Su edad biológica es 3 años menor a su edad cronológica, indicando un estilo de vida saludable y buen mantenimiento físico.

## 🔧 Características Técnicas

- **Base de datos**: IndexedDB (almacenamiento local en el navegador)
- **Visualización**: Chart.js con gráficas de tipo Radar
- **Framework**: React + TypeScript + PrimeReact
- **Cálculos**: Algoritmos personalizados basados en estándares de salud

## 📝 Notas Importantes

1. Los cálculos son **orientativos** y no reemplazan evaluaciones médicas profesionales
2. Las evaluaciones de estilo de vida (0-100) son **subjetivas** y deben ser honestas
3. Se recomienda realizar evaluaciones **cada 1-3 meses** para seguimiento óptimo
4. Los datos se almacenan **localmente** en el navegador del usuario
5. La escala 0-100 permite evaluación flexible:
   - 0-20: Muy malo / Inexistente
   - 20-40: Bajo / Malo
   - 40-60: Regular / Moderado
   - 60-80: Bueno
   - 80-100: Excelente / Óptimo

## 🚀 Próximas Mejoras Sugeridas

- [ ] Exportar reportes en PDF
- [ ] Gráficas de evolución temporal
- [ ] Alertas automáticas por valores críticos
- [ ] Comparación entre deportistas
- [ ] Recomendaciones personalizadas
- [ ] Integración con dispositivos wearables
- [ ] Calculadora de objetivos de salud

---

**Desarrollado para**: Dashboard Deportivo  
**Versión**: 1.0  
**Fecha**: Diciembre 2025

