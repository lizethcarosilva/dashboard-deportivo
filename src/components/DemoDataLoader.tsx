import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { insertarDatosEjemplo } from '../utils/sampleHealthData';
import database from '../services/database';

interface DemoDataLoaderProps {
  onDataLoaded?: () => void;
}

const DemoDataLoader: React.FC<DemoDataLoaderProps> = ({ onDataLoaded }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoadDemoData = async () => {
    setLoading(true);
    try {
      const result = await insertarDatosEjemplo(database);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setShowDialog(false);
          setSuccess(false);
          onDataLoaded?.();
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="Cargar Datos de Ejemplo"
        icon="pi pi-database"
        className="p-button-outlined p-button-info"
        onClick={() => setShowDialog(true)}
        tooltip="Carga deportistas y métricas de ejemplo para probar el sistema"
      />

      <Dialog
        header="📊 Cargar Datos de Ejemplo"
        visible={showDialog}
        style={{ width: '500px' }}
        onHide={() => setShowDialog(false)}
      >
        <div className="space-y-4">
          <Message
            severity="info"
            text="Esta acción cargará datos de ejemplo en el sistema para que puedas probar todas las funcionalidades."
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Se cargarán:</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>3 deportistas de ejemplo</strong> (Juan, María, Carlos)</li>
              <li><strong>9 evaluaciones integrales de salud</strong> (3 por cada deportista)</li>
              <li>Evaluaciones de Oct, Nov y Dic 2025 para cada uno</li>
              <li>Datos realistas para visualización en gráfica de telaraña</li>
              <li>Diferentes perfiles: alto rendimiento, bueno, y en mejora</li>
              <li>Incluye: sexo, edad, métricas físicas y evaluación de estilo de vida</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-gray-700">
              <strong>Nota:</strong> Los datos se verifican antes de insertar. 
              No se duplicarán deportistas ni métricas que ya existan con la misma fecha y hora.
            </p>
          </div>
          
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-gray-700">
              ✅ <strong>Seguro:</strong> Puedes presionar este botón múltiples veces sin crear duplicados.
            </p>
          </div>

          {success && (
            <Message
              severity="success"
              text="✅ Datos cargados correctamente! Recargando página..."
            />
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowDialog(false)}
              disabled={loading}
            />
            <Button
              label={loading ? 'Cargando...' : 'Cargar Datos'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              onClick={handleLoadDemoData}
              disabled={loading || success}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DemoDataLoader;

