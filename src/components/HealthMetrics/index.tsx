import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Activity } from 'lucide-react';
import HealthMetricsForm from './HealthMetricsForm';
import HealthRadarChart from './HealthRadarChart';
import database from '../../services/database';
import { calcularTodasLasMetricas } from '../../services/healthMetricsCalculator';

interface HealthMetricsProps {
  athletes: any[];
  onDataChange?: () => void;
}

const HealthMetrics: React.FC<HealthMetricsProps> = ({ athletes, onDataChange }) => {
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculatedMetrics, setCalculatedMetrics] = useState<any>(null);
  const toast = React.useRef<any>(null);

  useEffect(() => {
    if (athletes.length > 0 && !selectedAthlete) {
      setSelectedAthlete(athletes[0]);
    }
  }, [athletes]);

  useEffect(() => {
    if (selectedAthlete) {
      loadHealthRecords(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  const loadHealthRecords = async (athleteId: number) => {
    try {
      setLoading(true);
      const records = await database.getAthleteHealthMetrics(athleteId);
      
      // Filtrar solo registros con datos completos de salud
      const completeRecords = (records || []).filter((r: any) => r.edad && r.sexo);
      
      setHealthRecords(completeRecords);

      // Si hay registros, calcular métricas del más reciente
      if (completeRecords.length > 0) {
        const latest = completeRecords.sort(
          (a: any, b: any) => new Date(b.fechaCaptura).getTime() - new Date(a.fechaCaptura).getTime()
        )[0];
        calculateMetrics(latest);
      } else {
        setCalculatedMetrics(null);
      }
    } catch (error) {
      console.error('Error loading health records:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (record: any) => {
    const datosPersonales = {
      sexo: record.sexo,
      edadCronologica: record.edad,
      altura: record.altura,
      peso: record.peso,
    };

    const metricas = {
      actividadFisica: record.actividadFisica ?? 50,
      circulacion: record.circulacion ?? 50,
      sueño: record.sueño ?? 50,
      respiracion: record.respiracion ?? 50,
      antiStress: record.antiStress ?? 50,
      ritmoCardiaco: record.ritmoCardiaco,
      tension: record.tension,
      grasaCorporal: record.grasaCorporal,
    };

    const calculated = calcularTodasLasMetricas(datosPersonales, metricas);
    setCalculatedMetrics({ ...calculated, edadCronologica: record.edad });
  };

  const handleSaveMetric = async (formData: any) => {
    try {
      const metricData = {
        athleteId: formData.athleteId,
        fechaCaptura: formData.fechaCaptura.toISOString(),
        hora: formData.hora,
        
        // Datos personales
        sexo: formData.sexo,
        edad: formData.edad,
        altura: formData.altura,
        peso: formData.peso,
        
        // Métricas físicas
        tension: formData.tension,
        ritmoCardiaco: formData.ritmoCardiaco,
        temperatura: formData.temperatura,
        grasaCorporal: formData.grasaCorporal,
        imc: formData.imc,
        
        // Métricas de estilo de vida
        actividadFisica: formData.actividadFisica,
        circulacion: formData.circulacion,
        sueño: formData.sueño,
        respiracion: formData.respiracion,
        antiStress: formData.antiStress,
        
        // Notas
        notas: formData.notas,
        
        // Metadata
        createdAt: new Date().toISOString(),
      };

      if (selectedRecord) {
        await database.updateHealthMetric(selectedRecord.id, {
          ...metricData,
          id: selectedRecord.id,
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Métricas de salud actualizadas correctamente',
        });
      } else {
        await database.addHealthMetric(metricData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Métricas de salud guardadas correctamente',
        });
      }

      setFormVisible(false);
      setSelectedRecord(null);
      if (selectedAthlete) {
        loadHealthRecords(selectedAthlete.id);
      }
      onDataChange?.();
    } catch (error) {
      console.error('Error saving health metric:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron guardar las métricas',
      });
    }
  };

  const handleDeleteRecord = (record: any) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este registro de salud?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await database.deleteHealthMetric(record.id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro eliminado correctamente',
          });
          if (selectedAthlete) {
            loadHealthRecords(selectedAthlete.id);
          }
          onDataChange?.();
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el registro',
          });
        }
      },
    });
  };

  const openForm = (record?: any) => {
    if (record) {
      setSelectedRecord(record);
    } else {
      setSelectedRecord(null);
    }
    setFormVisible(true);
  };

  // Templates para la tabla
  const dateBodyTemplate = (rowData: any) => {
    const date = new Date(rowData.fechaCaptura);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actionsBodyTemplate = (rowData: any) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-outlined"
          onClick={() => calculateMetrics(rowData)}
          tooltip="Ver Análisis"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined"
          onClick={() => openForm(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => handleDeleteRecord(rowData)}
          tooltip="Eliminar"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Métricas Integrales de Salud
              </h2>
              <p className="text-gray-600">
                Sistema completo de evaluación y análisis de salud deportiva
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Dropdown
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.value)}
              options={athletes}
              optionLabel="name"
              placeholder="Selecciona deportista"
              className="w-64"
            />
            <Button
              label="Nueva Evaluación"
              icon="pi pi-plus"
              onClick={() => openForm()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 border-0"
              disabled={!selectedAthlete}
            />
          </div>
        </div>
      </Card>

      {/* Gráfica de Telaraña */}
      {calculatedMetrics && (
        <HealthRadarChart 
          metricas={calculatedMetrics} 
          edadCronologica={calculatedMetrics.edadCronologica}
        />
      )}

      {/* Tabla de Registros */}
      <Card title="Historial de Evaluaciones" className="shadow-md">
        <DataTable
          value={healthRecords}
          loading={loading}
          paginator
          rows={10}
          emptyMessage="No hay evaluaciones registradas. Haz clic en 'Nueva Evaluación' para comenzar."
        >
          <Column field="fechaCaptura" header="Fecha" body={dateBodyTemplate} sortable />
          <Column field="edad" header="Edad" sortable />
          <Column field="peso" header="Peso (kg)" sortable />
          <Column field="imc" header="IMC" sortable />
          <Column field="ritmoCardiaco" header="FC (bpm)" sortable />
          <Column field="tension" header="Tensión" />
          <Column header="Acciones" body={actionsBodyTemplate} style={{ width: '180px' }} />
        </DataTable>
      </Card>

      {/* Formulario */}
      <HealthMetricsForm
        visible={formVisible}
        onHide={() => {
          setFormVisible(false);
          setSelectedRecord(null);
        }}
        onSave={handleSaveMetric}
        athletes={athletes}
        initialData={selectedRecord}
        selectedAthleteId={selectedAthlete?.id}
      />
    </div>
  );
};

export default HealthMetrics;

