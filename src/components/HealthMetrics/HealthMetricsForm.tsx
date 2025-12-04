import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { calcularIMC } from '../../services/healthMetricsCalculator';

interface HealthMetricsFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (data: any) => void;
  athletes: any[];
  initialData?: any;
  selectedAthleteId?: number;
}

const HealthMetricsForm: React.FC<HealthMetricsFormProps> = ({
  visible,
  onHide,
  onSave,
  athletes,
  initialData,
  selectedAthleteId,
}) => {
  const [formData, setFormData] = useState({
    // Identificación
    athleteId: selectedAthleteId || '',
    fechaCaptura: new Date(),
    hora: new Date().toTimeString().slice(0, 5),

    // Datos personales
    sexo: 'M',
    edad: null as number | null,
    altura: null as number | null,
    peso: null as number | null,

    // Métricas físicas básicas
    tension: '',
    ritmoCardiaco: null as number | null,
    temperatura: null as number | null,
    grasaCorporal: null as number | null,
    imc: null as number | null,

    // Métricas de estilo de vida (0-100)
    actividadFisica: 50,
    circulacion: 50,
    sueño: 50,
    respiracion: 50,
    antiStress: 50,

    // Notas
    notas: '',
  });

  const sexoOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        fechaCaptura: new Date(initialData.fechaCaptura),
      });
    } else if (selectedAthleteId) {
      setFormData(prev => ({ ...prev, athleteId: selectedAthleteId }));
    }
  }, [initialData, selectedAthleteId]);

  // Calcular IMC automáticamente
  useEffect(() => {
    if (formData.peso && formData.altura) {
      const imc = calcularIMC(formData.peso, formData.altura);
      setFormData(prev => ({ ...prev, imc }));
    }
  }, [formData.peso, formData.altura]);

  const handleSave = () => {
    onSave(formData);
  };

  const renderSliderField = (
    label: string,
    value: number,
    field: string,
    description: string
  ) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-primary-600">{value}%</span>
      </div>
      <Slider
        value={value}
        onChange={(e) => setFormData({ ...formData, [field]: e.value as number })}
        min={0}
        max={100}
        step={5}
        className="w-full"
      />
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );

  return (
    <Dialog
      header={initialData ? "Editar Métricas de Salud" : "Nuevas Métricas de Salud"}
      visible={visible}
      style={{ width: '800px', maxHeight: '90vh' }}
      onHide={onHide}
      className="overflow-auto"
    >
      <div className="space-y-4">
        {/* Identificación */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📋 Identificación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deportista *
              </label>
              {initialData ? (
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                  <span className="text-gray-800 font-medium">
                    {athletes.find(a => a.id === formData.athleteId)?.name || 'Deportista no encontrado'}
                  </span>
                </div>
              ) : (
                <Dropdown
                  value={formData.athleteId}
                  onChange={(e) => setFormData({ ...formData, athleteId: e.value })}
                  options={athletes}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Selecciona deportista"
                  className="w-full"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Captura *
              </label>
              <Calendar
                value={formData.fechaCaptura}
                onChange={(e) => setFormData({ ...formData, fechaCaptura: e.value as Date })}
                dateFormat="dd/mm/yy"
                className="w-full"
                showIcon
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora *
              </label>
              <InputText
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Datos Personales */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            👤 Datos Personales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo *
              </label>
              <Dropdown
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.value })}
                options={sexoOptions}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad *
              </label>
              <InputNumber
                value={formData.edad}
                onValueChange={(e) => setFormData({ ...formData, edad: e.value ?? null })}
                className="w-full"
                min={5}
                max={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm) *
              </label>
              <InputNumber
                value={formData.altura}
                onValueChange={(e) => setFormData({ ...formData, altura: e.value ?? null })}
                className="w-full"
                min={50}
                max={250}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <InputNumber
                value={formData.peso}
                onValueChange={(e) => setFormData({ ...formData, peso: e.value ?? null })}
                className="w-full"
                min={20}
                max={300}
                mode="decimal"
                minFractionDigits={1}
                maxFractionDigits={1}
              />
            </div>
          </div>
        </div>

        {/* Métricas Físicas */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            ❤️ Métricas Físicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tensión Arterial
              </label>
              <InputText
                value={formData.tension}
                onChange={(e) => setFormData({ ...formData, tension: e.target.value })}
                placeholder="120/80"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ritmo Cardíaco (bpm)
              </label>
              <InputNumber
                value={formData.ritmoCardiaco}
                onValueChange={(e) => setFormData({ ...formData, ritmoCardiaco: e.value ?? null })}
                className="w-full"
                min={30}
                max={220}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperatura (°C)
              </label>
              <InputNumber
                value={formData.temperatura}
                onValueChange={(e) => setFormData({ ...formData, temperatura: e.value ?? null })}
                className="w-full"
                min={30}
                max={45}
                mode="decimal"
                minFractionDigits={1}
                maxFractionDigits={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grasa Corporal (%)
              </label>
              <InputNumber
                value={formData.grasaCorporal}
                onValueChange={(e) => setFormData({ ...formData, grasaCorporal: e.value ?? null })}
                className="w-full"
                min={0}
                max={100}
                mode="decimal"
                minFractionDigits={1}
                maxFractionDigits={1}
              />
            </div>
          </div>
          {formData.imc && (
            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                IMC Calculado:{' '}
              </span>
              <span className="text-lg font-bold text-primary-600">
                {formData.imc}
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {formData.imc < 18.5 && '(Bajo peso)'}
                {formData.imc >= 18.5 && formData.imc < 25 && '(Normal)'}
                {formData.imc >= 25 && formData.imc < 30 && '(Sobrepeso)'}
                {formData.imc >= 30 && '(Obesidad)'}
              </span>
            </div>
          )}
        </div>

        {/* Métricas de Estilo de Vida */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🌟 Evaluación de Estilo de Vida (0-100)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Evalúa cada aspecto del 0 al 100, donde 0 es muy bajo/malo y 100 es excelente.
          </p>

          {renderSliderField(
            '🏃 Actividad Física',
            formData.actividadFisica,
            'actividadFisica',
            'Frecuencia e intensidad del ejercicio físico'
          )}

          {renderSliderField(
            '💓 Circulación',
            formData.circulacion,
            'circulacion',
            'Calidad de la circulación sanguínea'
          )}

          {renderSliderField(
            '😴 Calidad del Sueño',
            formData.sueño,
            'sueño',
            'Horas y calidad del descanso nocturno'
          )}

          {renderSliderField(
            '🫁 Capacidad Respiratoria',
            formData.respiracion,
            'respiracion',
            'Calidad y eficiencia de la respiración'
          )}

          {renderSliderField(
            '🧘 Manejo del Estrés',
            formData.antiStress,
            'antiStress',
            'Capacidad para manejar el estrés diario'
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Notas Adicionales
          </label>
          <InputText
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            className="w-full"
            placeholder="Observaciones, síntomas, comentarios..."
          />
        </div>

        <Divider />

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={onHide}
          />
          <Button
            label="Guardar Métricas"
            icon="pi pi-check"
            onClick={handleSave}
            className="bg-gradient-to-r from-primary-500 to-blue-600 border-0"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default HealthMetricsForm;

