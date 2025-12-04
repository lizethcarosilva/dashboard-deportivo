import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Database, CheckCircle } from 'lucide-react';
import database from '../services/database';

const LoadSampleData = ({ onDataLoaded }: { onDataLoaded: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const sampleAthletes = [
    {
      fullName: 'Cristiano Ronaldo',
      sport: 'futbol',
      age: 38,
      country: 'Portugal',
    },
    {
      fullName: 'Lionel Messi',
      sport: 'futbol',
      age: 36,
      country: 'Argentina',
    },
    {
      fullName: 'LeBron James',
      sport: 'baloncesto',
      age: 39,
      country: 'Estados Unidos',
    },
    {
      fullName: 'Stephen Curry',
      sport: 'baloncesto',
      age: 35,
      country: 'Estados Unidos',
    },
    {
      fullName: 'Rafael Nadal',
      sport: 'tenis',
      age: 37,
      country: 'España',
    },
    {
      fullName: 'Novak Djokovic',
      sport: 'tenis',
      age: 36,
      country: 'Serbia',
    },
    {
      fullName: 'Usain Bolt',
      sport: 'atletismo',
      age: 37,
      country: 'Jamaica',
    },
    {
      fullName: 'Mo Farah',
      sport: 'atletismo',
      age: 40,
      country: 'Reino Unido',
    },
    {
      fullName: 'Michael Phelps',
      sport: 'natacion',
      age: 38,
      country: 'Estados Unidos',
    },
    {
      fullName: 'Katie Ledecky',
      sport: 'natacion',
      age: 27,
      country: 'Estados Unidos',
    },
  ];

  const generateRecordsForAthlete = (athleteId: number, sport: string, count: number = 5) => {
    const records: any[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7)); // Registros semanales

      let recordData: any = {
        athleteId,
        sport,
        date: date.toISOString(),
        createdAt: date.toISOString(),
      };

      // Generar datos aleatorios según el deporte
      switch (sport) {
        case 'futbol':
          recordData = {
            ...recordData,
            goles: Math.floor(Math.random() * 5),
            asistencias: Math.floor(Math.random() * 4),
            partidosJugados: Math.floor(Math.random() * 3) + 1,
          };
          break;
        case 'baloncesto':
          recordData = {
            ...recordData,
            puntos: Math.floor(Math.random() * 30) + 10,
            rebotes: Math.floor(Math.random() * 15) + 3,
            asistencias: Math.floor(Math.random() * 12) + 2,
          };
          break;
        case 'tenis':
          recordData = {
            ...recordData,
            partidosGanados: Math.floor(Math.random() * 3) + 1,
            partidosPerdidos: Math.floor(Math.random() * 2),
            aces: Math.floor(Math.random() * 15) + 5,
          };
          break;
        case 'atletismo':
          recordData = {
            ...recordData,
            mejorTiempo: (Math.random() * 5 + 9).toFixed(2), // Entre 9-14 segundos
            competicionesGanadas: Math.floor(Math.random() * 3),
          };
          break;
        case 'natacion':
          recordData = {
            ...recordData,
            mejorTiempo: (Math.random() * 10 + 45).toFixed(2), // Entre 45-55 segundos
            estiloPrincipal: ['Libre', 'Espalda', 'Mariposa', 'Pecho'][Math.floor(Math.random() * 4)],
          };
          break;
      }

      records.push(recordData);
    }

    return records;
  };

  const loadSampleData = async () => {
    setLoading(true);
    try {
      const currentCoach = JSON.parse(localStorage.getItem('currentCoach') || '{"id": 1}');

      // Agregar deportistas de ejemplo
      for (const athlete of sampleAthletes) {
        const athleteId = await database.addAthlete({
          ...athlete,
          coachId: currentCoach.id || 1,
          createdAt: new Date().toISOString(),
        });

        // Generar registros para cada deportista
        const records = generateRecordsForAthlete(athleteId as number, athlete.sport, 5);
        for (const record of records) {
          await database.addSportRecord(record);
        }
      }

      setShowDialog(false);
      onDataLoaded();
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="Cargar Datos de Ejemplo"
        icon="pi pi-database"
        onClick={() => setShowDialog(true)}
        className="p-button-outlined p-button-info min-h-[35px]"
        tooltip="Cargar deportistas y registros de ejemplo"
      />

      <Dialog
        header="Cargar Datos de Ejemplo"
        visible={showDialog}
        style={{ width: '550px' }}
        onHide={() => setShowDialog(false)}
      >
        <div className="text-center py-4">
          <Database className="mx-auto mb-4 text-cyan-400" size={64} style={{filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'}} />
          <h3 className="text-xl font-bold mb-4 text-cyan-400">¿Cargar datos de ejemplo?</h3>
          <p className="text-cyan-400/70 mb-6">
            Se cargarán 10 deportistas famosos con múltiples registros de ejemplo para cada uno.
            Esto te ayudará a explorar todas las funcionalidades del dashboard.
          </p>
          
          <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 mb-6 text-left backdrop-blur-sm">
            <h4 className="font-semibold text-cyan-400 mb-2">Incluye:</h4>
            <ul className="text-sm text-cyan-300 space-y-1">
              <li className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-cyan-400" />
                10 deportistas de 5 deportes diferentes (2 por deporte)
              </li>
              <li className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-cyan-400" />
                50 registros deportivos con datos realistas
              </li>
              <li className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-cyan-400" />
                Datos distribuidos en diferentes fechas
              </li>
              <li className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-purple-400" />
                Sin fotos (puedes agregar fotos manualmente)
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-outlined border-cyan-500/50 text-cyan-400 min-h-[35px]"
              onClick={() => setShowDialog(false)}
              disabled={loading}
            />
            <Button
              label={loading ? "Cargando..." : "Cargar Datos"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={loadSampleData}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 min-h-[35px]"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default LoadSampleData;

