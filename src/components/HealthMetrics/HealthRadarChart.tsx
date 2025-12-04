import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Badge } from 'primereact/badge';
import { obtenerInterpretacion } from '../../services/healthMetricsCalculator';

interface HealthRadarChartProps {
  metricas: {
    saludMetabolica: number;
    saludCardiovascular: number;
    saludOsea: number;
    saludHormonal: number;
    edadBiologica: number;
    velocidadEnvejecimiento: number;
    diferenciaEdad: number;
  };
  edadCronologica: number;
}

const HealthRadarChart: React.FC<HealthRadarChartProps> = ({ metricas, edadCronologica }) => {
  // Función para obtener color según el valor
  const getColorByValue = (valor: number) => {
    if (valor >= 80) return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 1)' }; // Verde
    if (valor >= 60) return { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgba(59, 130, 246, 1)' }; // Azul
    if (valor >= 40) return { bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 1)' }; // Amarillo
    return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 1)' }; // Rojo
  };

  // Obtener colores para cada punto
  const valores = [
    metricas.saludMetabolica,
    metricas.saludCardiovascular,
    metricas.saludOsea,
    metricas.saludHormonal,
  ];
  
  const pointColors = valores.map(v => getColorByValue(v).border);
  const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
  const colorPrincipal = getColorByValue(promedio);

  const chartData = {
    labels: [
      'Salud Metabólica',
      'Salud Cardiovascular',
      'Salud Ósea',
      'Salud Hormonal',
    ],
    datasets: [
      {
        label: 'Puntuación de Salud',
        data: valores,
        backgroundColor: colorPrincipal.bg,
        borderColor: colorPrincipal.border,
        borderWidth: 2,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: pointColors,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const valor = context.parsed.r;
            const interpretacion = obtenerInterpretacion(valor);
            return `${valor}/100 - ${interpretacion.nivel}`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
    maintainAspectRatio: true,
  };

  const getColorClass = (valor: number) => {
    const interpretacion = obtenerInterpretacion(valor);
    const colorMap: any = {
      green: 'bg-green-100 text-green-800 border-green-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      red: 'bg-red-100 text-red-800 border-red-300',
    };
    return colorMap[interpretacion.color] || 'bg-gray-100 text-gray-800';
  };

  const getSeverity = (valor: number) => {
    if (valor >= 80) return 'success';
    if (valor >= 60) return 'info';
    if (valor >= 40) return 'warning';
    return 'danger';
  };

  const getVelocidadColor = (velocidad: number) => {
    if (velocidad < 0.9) return 'text-green-600';
    if (velocidad <= 1.1) return 'text-blue-600';
    if (velocidad <= 1.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getVelocidadTexto = (velocidad: number) => {
    if (velocidad < 0.9) return '🚀 Envejecimiento Lento (Excelente)';
    if (velocidad <= 1.1) return '✅ Envejecimiento Normal';
    if (velocidad <= 1.3) return '⚠️ Envejecimiento Acelerado';
    return '🚨 Envejecimiento Muy Acelerado';
  };

  return (
    <div className="space-y-6">
      {/* Panel Informativo de Cálculos */}
      <Card className="shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📖 ¿Cómo se calculan las puntuaciones?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salud Metabólica */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-red-600 mb-2">🔥 Salud Metabólica (100 pts)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>IMC:</strong> 35 puntos (óptimo: 18.5-24.9)</li>
              <li>• <strong>Actividad Física:</strong> 40 puntos (escala 0-100)</li>
              <li>• <strong>Grasa Corporal:</strong> 25 puntos (rangos según sexo)</li>
            </ul>
          </div>

          {/* Salud Cardiovascular */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-red-600 mb-2">❤️ Salud Cardiovascular (100 pts)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>Ritmo Cardíaco:</strong> 30 puntos (óptimo: 60-80 bpm)</li>
              <li>• <strong>Tensión Arterial:</strong> 30 puntos (óptima: 90-120/60-80)</li>
              <li>• <strong>Circulación:</strong> 20 puntos (escala 0-100)</li>
              <li>• <strong>Respiración:</strong> 20 puntos (escala 0-100)</li>
            </ul>
          </div>

          {/* Salud Ósea */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-purple-600 mb-2">🦴 Salud Ósea (100 pts)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>Actividad Física:</strong> 50 puntos (crucial para huesos)</li>
              <li>• <strong>IMC:</strong> 30 puntos (peso adecuado)</li>
              <li>• <strong>Edad:</strong> 20 puntos (factor de ajuste)</li>
            </ul>
          </div>

          {/* Salud Hormonal */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-green-600 mb-2">⚡ Salud Hormonal (100 pts)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>Calidad del Sueño:</strong> 40 puntos (escala 0-100)</li>
              <li>• <strong>Manejo del Estrés:</strong> 35 puntos (escala 0-100)</li>
              <li>• <strong>Diferencia de Edad:</strong> 25 puntos (biológica vs cronológica)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>💡 Tip:</strong> Los valores de "Evaluación de Estilo de Vida" (Actividad Física, Circulación, Sueño, Respiración, Anti-Estrés) 
            se usan directamente en estos cálculos. Completa todos los campos para obtener puntuaciones precisas.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de Telaraña */}
        <Card className="lg:col-span-2 shadow-md">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🕸️ Análisis Integral de Salud
            </h2>
            <p className="text-gray-600">
              Gráfica de telaraña que muestra las 4 dimensiones principales de salud
            </p>
          </div>
          <div className="flex justify-center">
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <Chart type="radar" data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Leyenda de colores */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">80-100: Excelente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm">60-79: Bueno</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">40-59: Regular</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">0-39: Necesita atención</span>
            </div>
          </div>
        </Card>

        {/* Panel de Métricas Detalladas */}
        <Card className="shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Puntuaciones Detalladas</h3>
          
          <div className="space-y-4">
            {/* Salud Metabólica */}
            <div className={`p-3 rounded-lg border-2 ${getColorClass(metricas.saludMetabolica)}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">🔥 Salud Metabólica</span>
                <Badge 
                  value={metricas.saludMetabolica} 
                  severity={getSeverity(metricas.saludMetabolica) as any}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${metricas.saludMetabolica}%` }}
                ></div>
              </div>
            </div>

            {/* Salud Cardiovascular */}
            <div className={`p-3 rounded-lg border-2 ${getColorClass(metricas.saludCardiovascular)}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">❤️ Salud Cardiovascular</span>
                <Badge 
                  value={metricas.saludCardiovascular} 
                  severity={getSeverity(metricas.saludCardiovascular) as any}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${metricas.saludCardiovascular}%` }}
                ></div>
              </div>
            </div>

            {/* Salud Ósea */}
            <div className={`p-3 rounded-lg border-2 ${getColorClass(metricas.saludOsea)}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">🦴 Salud Ósea</span>
                <Badge 
                  value={metricas.saludOsea} 
                  severity={getSeverity(metricas.saludOsea) as any}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${metricas.saludOsea}%` }}
                ></div>
              </div>
            </div>

            {/* Salud Hormonal */}
            <div className={`p-3 rounded-lg border-2 ${getColorClass(metricas.saludHormonal)}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">⚡ Salud Hormonal</span>
                <Badge 
                  value={metricas.saludHormonal} 
                  severity={getSeverity(metricas.saludHormonal) as any}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${metricas.saludHormonal}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Análisis de Edad */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <h4 className="font-bold text-gray-800 mb-3">🕰️ Análisis de Edad</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edad Cronológica:</span>
                <span className="font-bold text-gray-800">{edadCronologica} años</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edad Biológica:</span>
                <span className="font-bold text-primary-600">{metricas.edadBiologica} años</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Diferencia:</span>
                <span className={`font-bold ${metricas.diferenciaEdad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metricas.diferenciaEdad > 0 ? '+' : ''}{metricas.diferenciaEdad} años
                </span>
              </div>
              
              <div className="pt-2 border-t border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Velocidad de Envejecimiento:</div>
                <div className={`font-bold text-lg ${getVelocidadColor(metricas.velocidadEnvejecimiento)}`}>
                  {metricas.velocidadEnvejecimiento}x
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {getVelocidadTexto(metricas.velocidadEnvejecimiento)}
                </div>
              </div>
            </div>
          </div>

          {/* Promedio General */}
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Puntuación General de Salud</div>
              <div className="text-4xl font-bold text-primary-600">
                {Math.round(
                  (metricas.saludMetabolica +
                    metricas.saludCardiovascular +
                    metricas.saludOsea +
                    metricas.saludHormonal) / 4
                )}
              </div>
              <div className="text-sm text-gray-600">de 100 puntos</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthRadarChart;
