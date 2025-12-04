import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Users, Activity, TrendingUp, Award, Plus, Edit, Trash2, Search, Filter, Eye, X, Calendar as CalendarIcon } from 'lucide-react';
import database from '../services/database';
import LoadSampleData from '../components/LoadSampleData';
import SpotlightCard from '../components/SpotlightCard';
import { clearDatabase } from '../utils/clearDatabase';
import { loadInitialData } from '../utils/loadInitialData';
import { cleanOrphanRecords } from '../utils/cleanOrphanRecords';

const Dashboard = () => {
  // Estados generales
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalRecords: 0,
    sportsCovered: 0,
    countriesRepresented: 0,
  });
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<any[]>([]);
  const [sportRecords, setSportRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [athleteDetailModalVisible, setAthleteDetailModalVisible] = useState(false);
  const [selectedAthleteForDetail, setSelectedAthleteForDetail] = useState<any>(null);
  const [paginationMode, setPaginationMode] = useState<'9' | '11' | '13' | '15'>('9');
  const [currentPage, setCurrentPage] = useState(0);
  const toast = React.useRef<any>(null);

  // Estados para comparación
  const [comparisonSport, setComparisonSport] = useState<string>('');
  const [comparisonCountry, setComparisonCountry] = useState<string>('');

  // Estados para CRUD de Deportistas
  const [athleteDialogVisible, setAthleteDialogVisible] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [athleteFormData, setAthleteFormData] = useState({
    fullName: '',
    sport: '',
    age: null as number | null,
    country: '',
    photoUrl: '',
    photoBase64: '', // Para almacenar imagen directamente
  });

  // Estados para CRUD de Registros
  const [recordDialogVisible, setRecordDialogVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedAthleteForRecord, setSelectedAthleteForRecord] = useState<any>(null);
  const [recordFormData, setRecordFormData] = useState<any>({
    athleteId: '',
    date: new Date(),
    sport: '',
  });

  const sports = [
    { label: 'Fútbol', value: 'futbol' },
    { label: 'Baloncesto', value: 'baloncesto' },
    { label: 'Tenis', value: 'tenis' },
    { label: 'Atletismo', value: 'atletismo' },
    { label: 'Natación', value: 'natacion' },
  ];

  const countries = [
    { label: 'España', value: 'España' },
    { label: 'México', value: 'México' },
    { label: 'Argentina', value: 'Argentina' },
    { label: 'Colombia', value: 'Colombia' },
    { label: 'Chile', value: 'Chile' },
    { label: 'Perú', value: 'Perú' },
    { label: 'Estados Unidos', value: 'Estados Unidos' },
    { label: 'Brasil', value: 'Brasil' },
    { label: 'Francia', value: 'Francia' },
    { label: 'Alemania', value: 'Alemania' },
    { label: 'Italia', value: 'Italia' },
    { label: 'Portugal', value: 'Portugal' },
    { label: 'Noruega', value: 'Noruega' },
    { label: 'Grecia', value: 'Grecia' },
    { label: 'Rusia', value: 'Rusia' },
    { label: 'Kenia', value: 'Kenia' },
    { label: 'Suecia', value: 'Suecia' },
    { label: 'Reino Unido', value: 'Reino Unido' },
    { label: 'Jamaica', value: 'Jamaica' },
    { label: 'Serbia', value: 'Serbia' },
    { label: 'Eslovenia', value: 'Eslovenia' },
    { label: 'Japón', value: 'Japón' },
    { label: 'Canadá', value: 'Canadá' },
  ];

  // Campos específicos por deporte
  const getSportFields = (sport: string) => {
    switch (sport) {
      case 'futbol':
        return [
          { name: 'goles', label: 'Goles', type: 'number' },
          { name: 'asistencias', label: 'Asistencias', type: 'number' },
          { name: 'partidosJugados', label: 'Partidos Jugados', type: 'number' },
        ];
      case 'baloncesto':
        return [
          { name: 'puntos', label: 'Puntos', type: 'number' },
          { name: 'rebotes', label: 'Rebotes', type: 'number' },
          { name: 'asistencias', label: 'Asistencias', type: 'number' },
        ];
      case 'tenis':
        return [
          { name: 'partidosGanados', label: 'Partidos Ganados', type: 'number' },
          { name: 'partidosPerdidos', label: 'Partidos Perdidos', type: 'number' },
          { name: 'aces', label: 'Aces', type: 'number' },
        ];
      case 'atletismo':
        return [
          { name: 'mejorTiempo', label: 'Mejor Tiempo (segundos)', type: 'number', decimal: true },
          { name: 'competicionesGanadas', label: 'Competiciones Ganadas', type: 'number' },
        ];
      case 'natacion':
        return [
          { name: 'mejorTiempo', label: 'Mejor Tiempo (segundos)', type: 'number', decimal: true },
          { name: 'estiloPrincipal', label: 'Estilo Principal', type: 'text' },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterAthletes();
    setCurrentPage(0); // Resetear página al cambiar filtros
  }, [searchTerm, athletes, selectedSports, selectedCountries]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentCoach = JSON.parse(localStorage.getItem('currentCoach') || '{"id": 1}');
      const athletesData = await database.getAthletesByCoach(currentCoach?.id || 1);
      const allRecords = await database.getAllSportRecords();
      
      // Detectar y limpiar registros huérfanos automáticamente (silencioso)
      if (athletesData.length > 0 && allRecords.length > 0) {
        const validAthleteIds = new Set(athletesData.map((a: any) => Number(a.id)));
        const hasOrphans = allRecords.some(record => !validAthleteIds.has(Number(record.athleteId)));
        
        if (hasOrphans) {
          console.log('🔍 Registros huérfanos detectados. Limpiando automáticamente...');
          const result = await cleanOrphanRecords();
          if (result.success && result.orphansDeleted > 0) {
            // Recargar datos después de limpiar
            const updatedRecords = await database.getAllSportRecords();
            setSportRecords(updatedRecords);
            console.log(`✅ Limpiados ${result.orphansDeleted} registros huérfanos automáticamente`);
          }
        }
      }
      
      setAthletes(athletesData);
      setFilteredAthletes(athletesData);
      setSportRecords(allRecords);
      
      // Calcular estadísticas
      const uniqueSports = new Set(athletesData.map((a: any) => a.sport));
      const uniqueCountries = new Set(athletesData.map((a: any) => a.country));

      setStats({
        totalAthletes: athletesData.length,
        totalRecords: allRecords.length,
        sportsCovered: uniqueSports.size,
        countriesRepresented: uniqueCountries.size,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAthletes = () => {
    let filtered = [...athletes];
    
    // Filtro de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(athlete =>
        athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por deporte
    if (selectedSports.length > 0) {
      filtered = filtered.filter(athlete => selectedSports.includes(athlete.sport));
    }
    
    // Filtro por país
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(athlete => selectedCountries.includes(athlete.country));
    }
    
    setFilteredAthletes(filtered);
  };

  // Funciones para comparación
  const getAvailableSports = () => {
    const uniqueSports = [...new Set(athletes.map(a => a.sport))];
    return sports.filter(s => uniqueSports.includes(s.value));
  };

  const getAvailableCountries = () => {
    const uniqueCountries = [...new Set(athletes.map(a => a.country))];
    return countries.filter(c => uniqueCountries.includes(c.value));
  };

  const getComparisonAthletes = () => {
    return athletes.filter(athlete => {
      const matchSport = !comparisonSport || athlete.sport === comparisonSport;
      const matchCountry = !comparisonCountry || athlete.country === comparisonCountry;
      return matchSport && matchCountry;
    });
  };

  const calculateAthleteScore = (athleteId: number, sport: string) => {
    const records = sportRecords.filter(r => Number(r.athleteId) === athleteId);
    if (records.length === 0) return 0;

    const fields = getSportFields(sport);
    let totalScore = 0;

    records.forEach(record => {
      fields.forEach(field => {
        const value = parseFloat(record[field.name]) || 0;
        if (field.name === 'mejorTiempo') {
          // Para tiempos, menor es mejor, así que invertimos
          totalScore += value > 0 ? 100 / value : 0;
        } else if (field.name.includes('Perdidos')) {
          // Los valores negativos restan
          totalScore -= value;
        } else {
          totalScore += value;
        }
      });
    });

    return totalScore;
  };

  const getAthleteAverageStats = (athleteId: number, sport: string) => {
    const records = sportRecords.filter(r => Number(r.athleteId) === athleteId);
    if (records.length === 0) return null;

    const fields = getSportFields(sport);
    const stats: any = {};

    fields.forEach(field => {
      const values = records
        .map(r => parseFloat(r[field.name]))
        .filter(v => !isNaN(v) && v !== null && v !== undefined);
      
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        stats[field.name] = {
          label: field.label,
          average: sum / values.length,
          total: sum,
          count: values.length
        };
      } else {
        stats[field.name] = {
          label: field.label,
          average: 0,
          total: 0,
          count: 0
        };
      }
    });

    return stats;
  };

  const getTopAthlete = (): any => {
    const comparisonAthletes = getComparisonAthletes();
    if (comparisonAthletes.length === 0 || !comparisonSport) return null;

    let topAthlete: any = null;
    let maxScore = -Infinity;

    // Evaluar entre TODOS los atletas filtrados (hasta 12 o más)
    comparisonAthletes.forEach(athlete => {
      const score = calculateAthleteScore(athlete.id, athlete.sport);
      if (score > maxScore) {
        maxScore = score;
        const stats = getAthleteAverageStats(athlete.id, athlete.sport);
        topAthlete = { 
          ...athlete, 
          score,
          stats,
          recordsCount: sportRecords.filter(r => Number(r.athleteId) === athlete.id).length
        };
      }
    });

    return topAthlete;
  };

  const getComparisonChartData = () => {
    const comparisonAthletes = getComparisonAthletes();
    if (comparisonAthletes.length === 0 || !comparisonSport) {
      return {
        labels: [],
        datasets: []
      };
    }

    const fields = getSportFields(comparisonSport);
    const labels = comparisonAthletes.map(a => a.fullName);
    
    // Crear un dataset por cada métrica
    const datasets = fields.map((field, idx) => {
      const data = comparisonAthletes.map(athlete => {
        const records = sportRecords.filter(r => Number(r.athleteId) === athlete.id);
        if (records.length === 0) return 0;
        
        // Calcular promedio de la métrica
        const total = records.reduce((sum, r) => sum + (parseFloat(r[field.name]) || 0), 0);
        return total / records.length;
      });

      const colors = [
        'rgba(6, 182, 212, 0.8)',   // cyan
        'rgba(168, 85, 247, 0.8)',  // purple
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(251, 146, 60, 0.8)',  // orange
        'rgba(239, 68, 68, 0.8)',   // red
      ];

      return {
        label: field.label,
        data: data,
        backgroundColor: colors[idx % colors.length],
        borderColor: colors[idx % colors.length].replace('0.8', '1'),
        borderWidth: 2,
      };
    });

    return {
      labels,
      datasets
    };
  };

  // CRUD de Deportistas
  const handleSaveAthlete = async () => {
    try {
      if (!athleteFormData.fullName || !athleteFormData.sport || !athleteFormData.age || !athleteFormData.country) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Por favor completa todos los campos obligatorios',
        });
        return;
      }

      const currentCoach = JSON.parse(localStorage.getItem('currentCoach') || '{"id": 1}');
      
      if (selectedAthlete) {
        await database.updateAthlete(selectedAthlete.id, {
          ...athleteFormData,
          coachId: currentCoach.id || 1,
          updatedAt: new Date().toISOString(),
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Deportista actualizado correctamente',
        });
      } else {
        await database.addAthlete({
          ...athleteFormData,
          coachId: currentCoach.id || 1,
          createdAt: new Date().toISOString(),
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Deportista agregado correctamente',
        });
      }

      setAthleteDialogVisible(false);
      setSelectedAthlete(null);
      resetAthleteForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving athlete:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el deportista',
      });
    }
  };

  const handleDeleteAthlete = (athlete: any) => {
    confirmDialog({
      message: `¿Estás seguro de que deseas eliminar a ${athlete.fullName}? También se eliminarán todos sus registros.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await database.deleteAthleteRecords(athlete.id);
          await database.deleteAthlete(athlete.id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Deportista eliminado correctamente',
          });
          loadDashboardData();
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el deportista',
          });
        }
      },
    });
  };

  const openAthleteDialog = (athlete?: any) => {
    if (athlete) {
      setSelectedAthlete(athlete);
      setAthleteFormData({
        fullName: athlete.fullName,
        sport: athlete.sport,
        age: athlete.age,
        country: athlete.country,
        photoUrl: athlete.photoUrl || '',
        photoBase64: athlete.photoBase64 || '',
      });
    } else {
      resetAthleteForm();
    }
    setAthleteDialogVisible(true);
  };

  // Subir imagen al servidor
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Selecciona una imagen válida' });
      return;
    }

    // Verificar que haya un nombre de jugador
    if (!athleteFormData.fullName || athleteFormData.fullName.trim() === '') {
      toast.current?.show({ 
        severity: 'warn', 
        summary: 'Advertencia', 
        detail: 'Por favor ingresa el nombre del jugador primero' 
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('athleteName', athleteFormData.fullName); // Enviar nombre del jugador

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.photoUrl) {
        setAthleteFormData({ ...athleteFormData, photoUrl: data.photoUrl, photoBase64: '' });
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: `Imagen guardada como: ${data.photoUrl}` 
        });
      }
    } catch (error) {
      // Fallback: guardar en base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAthleteFormData({ ...athleteFormData, photoBase64: reader.result as string, photoUrl: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAthleteForm = () => {
    setAthleteFormData({
      fullName: '',
      sport: '',
      age: null,
      country: '',
      photoUrl: '',
      photoBase64: '',
    });
    setSelectedAthlete(null);
  };

  // CRUD de Registros
  const handleSaveRecord = async () => {
    try {
      if (!recordFormData.athleteId || !recordFormData.sport) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Selecciona un deportista',
        });
        return;
      }

      const recordData = {
        ...recordFormData,
        date: recordFormData.date.toISOString(),
        createdAt: new Date().toISOString(),
      };

      if (selectedRecord) {
        await database.updateSportRecord(selectedRecord.id, {
          ...recordData,
          id: selectedRecord.id,
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro actualizado correctamente',
        });
      } else {
        await database.addSportRecord(recordData);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro guardado correctamente',
        });
      }

      setRecordDialogVisible(false);
      resetRecordForm();
        loadDashboardData();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el registro',
      });
    }
  };

  const handleDeleteRecord = (id: any) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await database.deleteSportRecord(id);
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro eliminado correctamente',
          });
            loadDashboardData();
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

  const openRecordDialog = (record?: any, athlete?: any) => {
    if (record) {
      setSelectedRecord(record);
      setSelectedAthleteForRecord(athletes.find(a => Number(a.id) === Number(record.athleteId)));
      setRecordFormData({
        ...record,
        date: new Date(record.date),
      });
    } else {
      if (athlete) {
        setSelectedAthleteForRecord(athlete);
        const fields = getSportFields(athlete.sport);
        const initialData: any = {
          athleteId: athlete.id,
          date: new Date(),
          sport: athlete.sport,
        };
        fields.forEach(field => {
          initialData[field.name] = null;
        });
        setRecordFormData(initialData);
      } else {
        resetRecordForm();
      }
    }
    setRecordDialogVisible(true);
  };

  const resetRecordForm = () => {
    setRecordFormData({
      athleteId: '',
      date: new Date(),
      sport: '',
    });
    setSelectedRecord(null);
    setSelectedAthleteForRecord(null);
  };

  const handleAthleteSelectForRecord = (athleteId: number) => {
    const athlete = athletes.find(a => Number(a.id) === Number(athleteId));
    if (athlete) {
      setSelectedAthleteForRecord(athlete);
      const fields = getSportFields(athlete.sport);
      const newData: any = {
        athleteId: athlete.id,
        date: recordFormData.date,
        sport: athlete.sport,
      };
      fields.forEach(field => {
        newData[field.name] = null;
      });
      setRecordFormData(newData);
    }
  };

  // Templates para tablas
  const dateBodyTemplate = (rowData: any) => {
    try {
      if (!rowData.date) return 'Sin fecha';
      const date = new Date(rowData.date);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Error en fecha';
    }
  };

  const sportBodyTemplate = (rowData: any) => {
    const sportLabel = sports.find(s => s.value === rowData.sport)?.label || rowData.sport;
    const colors: any = {
      futbol: 'bg-green-500/20 text-green-400 border border-green-500/50',
      baloncesto: 'bg-orange-500/20 text-orange-400 border border-orange-500/50',
      tenis: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
      natacion: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50',
      atletismo: 'bg-purple-500/20 text-purple-400 border border-purple-500/50',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[rowData.sport] || 'bg-gray-500/20 text-gray-400 border border-gray-500/50'}`}>
        {sportLabel}
      </span>
    );
  };

  const athleteActionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-success p-button-outlined"
          onClick={() => openRecordDialog(undefined, rowData)}
          tooltip="Agregar Registro"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined"
          onClick={() => openAthleteDialog(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => handleDeleteAthlete(rowData)}
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const recordActionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined"
          onClick={() => openRecordDialog(rowData)}
          tooltip="Editar"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => handleDeleteRecord(rowData.id)}
          tooltip="Eliminar"
        />
      </div>
    );
  };

  // Datos para gráficos (usando filteredAthletes para que respondan a filtros)
  const getChartData = () => {
    const sportCounts: any = {};
    filteredAthletes.forEach(athlete => {
      sportCounts[athlete.sport] = (sportCounts[athlete.sport] || 0) + 1;
    });

    return {
      labels: Object.keys(sportCounts).map(sport => sports.find(s => s.value === sport)?.label || sport),
      datasets: [{
        label: 'Deportistas por Deporte',
        data: Object.values(sportCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(6, 182, 212)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      }],
    };
  };

  const getCountryChartData = () => {
    const countryCounts: any = {};
    filteredAthletes.forEach(athlete => {
      countryCounts[athlete.country] = (countryCounts[athlete.country] || 0) + 1;
    });

    return {
      labels: Object.keys(countryCounts),
      datasets: [{
        label: 'Deportistas por País',
        data: Object.values(countryCounts),
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 2,
      }],
    };
  };

  // Nueva gráfica: Distribución de edades
  const getAgeDistributionData = () => {
    const ageRanges = {
      '18-25': 0,
      '26-30': 0,
      '31-35': 0,
      '36-40': 0,
      '40+': 0,
    };

    filteredAthletes.forEach(athlete => {
      const age = athlete.age;
      if (age >= 18 && age <= 25) ageRanges['18-25']++;
      else if (age >= 26 && age <= 30) ageRanges['26-30']++;
      else if (age >= 31 && age <= 35) ageRanges['31-35']++;
      else if (age >= 36 && age <= 40) ageRanges['36-40']++;
      else if (age > 40) ageRanges['40+']++;
    });

    return {
      labels: Object.keys(ageRanges),
      datasets: [{
        label: 'Deportistas por Rango de Edad',
        data: Object.values(ageRanges),
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(6, 182, 212)',
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)',
          'rgb(168, 85, 247)',
          'rgb(234, 68, 68)',
        ],
        borderWidth: 2,
      }],
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#06b6d4',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        titleColor: '#06b6d4',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(6, 182, 212, 0.5)',
        borderWidth: 1,
      },
    },
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#06b6d4',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        titleColor: '#06b6d4',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(6, 182, 212, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#e5e7eb',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.1)',
        },
      },
    },
  };

  const statCards = [
    {
      title: 'Total Deportistas',
      value: stats.totalAthletes,
      icon: <Users className="text-cyan-400" size={28} />,
      color: 'bg-cyan-500/10',
      gradient: 'from-cyan-400 to-cyan-600',
      glow: '0 0 20px rgba(6, 182, 212, 0.3)',
    },
    {
      title: 'Registros Totales',
      value: stats.totalRecords,
      icon: <Activity className="text-purple-400" size={28} />,
      color: 'bg-purple-500/10',
      gradient: 'from-purple-400 to-purple-600',
      glow: '0 0 20px rgba(168, 85, 247, 0.3)',
    },
    {
      title: 'Deportes',
      value: stats.sportsCovered,
      icon: <TrendingUp className="text-cyan-400" size={28} />,
      color: 'bg-cyan-500/10',
      gradient: 'from-cyan-400 to-purple-600',
      glow: '0 0 20px rgba(6, 182, 212, 0.3)',
    },
    {
      title: 'Países',
      value: stats.countriesRepresented,
      icon: <Award className="text-purple-400" size={28} />,
      color: 'bg-purple-500/10',
      gradient: 'from-purple-400 to-cyan-600',
      glow: '0 0 20px rgba(168, 85, 247, 0.3)',
    },
  ];

  // Calcular estadísticas por deportista
  const getAthleteStats = (athleteId: number) => {
    const records = sportRecords.filter(r => r.athleteId === athleteId);
    return records;
  };

  const getSportIcon = (sport: string) => {
    const icons: any = {
      futbol: '⚽',
      baloncesto: '🏀',
      tenis: '🎾',
      atletismo: '🏃',
      natacion: '🏊',
    };
    return icons[sport] || '⚽';
  };

  const getSportLabels = () => {
    return {
      futbol: 'Fútbol',
      baloncesto: 'Baloncesto',
      tenis: 'Tenis',
      atletismo: 'Atletismo',
      natacion: 'Natación',
    };
  };

  const openAthleteDetail = (athlete: any) => {
    setSelectedAthleteForDetail(athlete);
    setAthleteDetailModalVisible(true);
  };

  const handleClearAndReload = async () => {
    confirmDialog({
      message: '¿Estás seguro de que deseas borrar TODOS los datos y recargar datos de ejemplo? Esta acción no se puede deshacer.',
      header: 'Limpiar y Recargar Base de Datos',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Sí, borrar todo',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          setLoading(true);
          // Limpiar base de datos
          await clearDatabase();
          // Recargar datos
          await loadInitialData();
          // Recargar dashboard
          await loadDashboardData();
          toast.current?.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Base de datos limpiada y recargada correctamente',
            life: 3000,
          });
        } catch (error) {
          console.error('Error:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo limpiar y recargar la base de datos',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCleanOrphanRecords = async () => {
    confirmDialog({
      message: 'Esto eliminará registros huérfanos (sin deportista) y creará nuevos registros para deportistas sin datos. ¿Continuar?',
      header: 'Limpiar Registros Huérfanos',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-success',
      acceptLabel: 'Sí, limpiar',
      rejectLabel: 'Cancelar',
      accept: async () => {
        try {
          setLoading(true);
          const result = await cleanOrphanRecords();
          
          if (result.success) {
            await loadDashboardData();
            toast.current?.show({
              severity: 'success',
              summary: 'Limpieza Exitosa',
              detail: `Eliminados: ${result.orphansDeleted} registros huérfanos. Creados: ${result.newRecordsCreated} registros nuevos.`,
              life: 5000,
            });
          } else {
            throw new Error('Error en la limpieza');
          }
        } catch (error) {
          console.error('Error:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron limpiar los registros huérfanos',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getAthleteRecordsForChart = (athleteId: number) => {
    const records = sportRecords
      .filter(r => r.athleteId === athleteId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return records.map(record => ({
      date: new Date(record.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      ...record,
    }));
  };

  const getSportColors = (sport: string) => {
    const colors: any = {
      futbol: { bg: 'from-green-500 to-emerald-600', icon: 'bg-green-100', text: 'text-green-400' },
      baloncesto: { bg: 'from-orange-500 to-amber-600', icon: 'bg-orange-100', text: 'text-orange-400' },
      tenis: { bg: 'from-yellow-500 to-amber-600', icon: 'bg-yellow-100', text: 'text-yellow-400' },
      natacion: { bg: 'from-cyan-500 to-blue-600', icon: 'bg-cyan-100', text: 'text-cyan-400' },
      atletismo: { bg: 'from-purple-500 to-violet-600', icon: 'bg-purple-100', text: 'text-purple-400' },
    };
    return colors[sport] || colors.futbol;
  };

  const getLatestStats = (athleteId: number, sport: string) => {
    const records = getAthleteStats(athleteId);
    if (records.length === 0) return null;

    const latestRecord = records[0];
    const fields = getSportFields(sport);
    
    return fields.slice(0, 3).map(field => ({
      label: field.label,
      value: latestRecord[field.name] || 0
    }));
  };

  const renderAthleteStatsCard = (athlete: any) => {
    const records = getAthleteStats(athlete.id);
    const sportLabel = sports.find(s => s.value === athlete.sport)?.label || athlete.sport;
    const sportColors = getSportColors(athlete.sport);
    const latestStats = getLatestStats(athlete.id, athlete.sport);
    const mainStat = latestStats && latestStats[0];
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <SpotlightCard 
          className="h-full"
          spotlightColor="rgba(6, 182, 212, 0.15)"
        >
          <div className="bg-gray-950/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all h-full" 
               style={{boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)'}}>
            {/* Header con foto y datos */}
            <div className="flex items-start gap-4 mb-6">
              {/* Foto del deportista */}
              <div className={`hidden md:flex w-20 h-20 rounded-2xl bg-gradient-to-br ${sportColors.bg} items-center justify-center text-4xl shadow-lg flex-shrink-0`}
                   style={{boxShadow: `0 0 20px ${sportColors.text.replace('text-', 'rgba(')}, 0.3)`}}>
                {athlete.photoBase64 ? (
                  <img src={athlete.photoBase64} alt={athlete.fullName} className="w-full h-full object-cover rounded-2xl" />
                ) : athlete.photoUrl ? (
                  <img src={athlete.photoUrl} alt={athlete.fullName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span>{getSportIcon(athlete.sport)}</span>
                )}
              </div>

              {/* Info del deportista */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{athlete.fullName}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {sportBodyTemplate(athlete)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-cyan-400/70">
                    <span>👤</span>
                    <span>{athlete.age} años</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400/70">
                    <TrendingUp size={14} />
                    <span>{records.length} registros</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-400/70 col-span-2">
                    <span>🌍</span>
                    <span>{athlete.country}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2">
                <Button
                  icon="pi pi-eye"
                  className="p-button-rounded min-h-[35px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAthleteDetail(athlete);
                  }}
                  tooltip="Ver Detalle"
                  style={{background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', border: 'none'}}
                />
                <Button
                  icon="pi pi-plus"
                  className="p-button-rounded min-h-[35px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRecordDialog(undefined, athlete);
                  }}
                  tooltip="Agregar Registro"
                  style={{background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)', border: 'none'}}
                />
              </div>
            </div>

            {/* Estadística principal */}
            {mainStat ? (
              <div className="hidden md:block mb-4 relative overflow-hidden">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-cyan-500/20 rounded-xl p-6 relative backdrop-blur-sm">
                  <div className="absolute top-2 left-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    {mainStat.label}
                  </div>
                  <div className="text-5xl font-bold text-white text-center mt-4">
                    {mainStat.value}
                  </div>
                  {/* Ícono decorativo */}
                  <div className="absolute bottom-2 right-4 text-6xl opacity-20">
                    {getSportIcon(athlete.sport)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-50"></div>
                </div>
              </div>
            ) : (
              <div className="hidden md:block mb-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-cyan-500/20 rounded-xl p-6 text-center">
                <p className="text-cyan-400/50">Sin registros</p>
              </div>
            )}

            {/* Estadísticas secundarias */}
            {latestStats && latestStats.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {latestStats.map((stat, idx) => (
                  <div key={idx} className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-3 text-center backdrop-blur-sm hover:border-cyan-500/40 transition-all">
                    <div className={`text-2xl font-bold ${idx === 0 ? 'text-cyan-400' : 'text-purple-400'}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate" title={stat.label}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SpotlightCard>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8 max-w-full overflow-x-hidden"
    >
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent cyber-text-glow">
              Dashboard de Estadísticas Deportivas
            </h1>
            <p className="text-cyan-400/70 mt-2">Gestión completa de deportistas y visualización de rendimiento</p>
          </div>
          <div className="flex gap-2">
            {athletes.length === 0 && <LoadSampleData onDataLoaded={loadDashboardData} />}

            <Button
              label="Agregar Deportista"
              icon="pi pi-plus"
              onClick={() => openAthleteDialog()}
              className="min-h-[35px] bg-gradient-to-r from-cyan-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-shadow p-[5px]"
            />
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all border-0" style={{ boxShadow: card.glow }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400/70 text-sm mb-2">{card.title}</p>
                  <h3 className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.value}
                  </h3>
                </div>
                <div className={`${card.color} p-4 rounded-2xl border border-cyan-500/30`} style={{ boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)' }}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs de Contenido */}
      <div className="w-full overflow-hidden">
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="w-full">
          {/* Tab 1: Vista General */}
          <TabPanel header=" Vista General" leftIcon="pi pi-chart-bar mr-2">
          {/* Filtros */}
          <Card title="Filtros" className="mb-6 shadow-lg border-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  <Filter className="inline mr-1" size={16} /> Buscar
                </label>
                <InputText
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar deportista..."
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">Deportes</label>
                <MultiSelect
                  value={selectedSports}
                  onChange={(e) => setSelectedSports(e.value)}
                  options={sports}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos los deportes"
                  className="w-full"
                  display="chip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">Países</label>
                <MultiSelect
                  value={selectedCountries}
                  onChange={(e) => setSelectedCountries(e.value)}
                  options={countries}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todos los países"
                  className="w-full"
                  display="chip"
                />
              </div>
            </div>
          </Card>

          {/* Gráficas */}
          <div className="space-y-6 mb-8">
            {/* Gráfica de barras - Ancho completo */}
            <Card title="Deportistas por País" className="shadow-lg border-0">
              <div style={{ minHeight: '300px', height: '300px', width: '100%' }}>
                <Chart type="bar" data={getCountryChartData()} options={barChartOptions} />
              </div>
            </Card>

            {/* Gráficas en fila - 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Distribución por Deporte" className="shadow-lg border-0">
                <div style={{ minHeight: '300px', height: '300px' }}>
                  <Chart type="doughnut" data={getChartData()} options={chartOptions} />
                </div>
              </Card>
              <Card title="Distribución por Edad" className="shadow-lg border-0">
                <div style={{ minHeight: '300px', height: '300px' }}>
                  <Chart type="polarArea" data={getAgeDistributionData()} options={chartOptions} />
                </div>
              </Card>
            </div>
          </div>
          {/* Tarjetas de Deportistas con Paginación */}
          <Card className="shadow-lg border-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold text-cyan-400">Deportistas ({filteredAthletes.length})</h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                {/* Campo de búsqueda */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="text-cyan-400/70" size={18} />
                  <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar deportista..."
                    className="w-full sm:w-64 min-h-[35px]"
                  />
                  {searchTerm && (
                    <Button
                      icon="pi pi-times"
                      className="p-button-text p-button-rounded text-cyan-400 min-h-[35px] w-[35px]"
                      onClick={() => setSearchTerm('')}
                      tooltip="Limpiar búsqueda"
                    />
                  )}
                </div>
                
                {/* Selector de paginación */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm text-cyan-400/70 whitespace-nowrap">Por página:</span>
                  {['9', '11', '13', '15'].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        setPaginationMode(num as any);
                        setCurrentPage(0);
                      }}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[30px] sm:min-h-[35px] min-w-[30px] sm:min-w-[40px] ${
                        paginationMode === num
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-900/50 text-cyan-400/70 border border-cyan-500/30 hover:border-cyan-500/50'
                      }`}
                      style={paginationMode === num ? {boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'} : {}}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {filteredAthletes.length > 0 ? (
              <>
                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {filteredAthletes
                    .slice(currentPage * parseInt(paginationMode), (currentPage + 1) * parseInt(paginationMode))
                    .map(athlete => (
                      <div key={athlete.id}>
                        {renderAthleteStatsCard(athlete)}
                      </div>
                    ))}
                </div>

                {/* Paginación Manual */}
                {filteredAthletes.length > parseInt(paginationMode) && (
                  <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-6 pt-6 border-t border-cyan-500/20">
                    <button
                      onClick={() => setCurrentPage(0)}
                      disabled={currentPage === 0}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[32px] sm:min-h-[35px]"
                    >
                      <span className="text-xs sm:text-sm">Primera</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[32px] sm:min-h-[35px]"
                    >
                      <span className="text-xs sm:text-sm">Anterior</span>
                    </button>
                    
                    {/* Páginas */}
                    {Array.from({ length: Math.ceil(filteredAthletes.length / parseInt(paginationMode)) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[32px] sm:min-h-[35px] min-w-[32px] sm:min-w-[35px] ${
                          currentPage === idx
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-none'
                            : 'border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                        style={currentPage === idx ? {boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'} : {}}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAthletes.length / parseInt(paginationMode)) - 1, prev + 1))}
                      disabled={currentPage >= Math.ceil(filteredAthletes.length / parseInt(paginationMode)) - 1}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[32px] sm:min-h-[35px]"
                    >
                      <span className="text-xs sm:text-sm">Siguiente</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.ceil(filteredAthletes.length / parseInt(paginationMode)) - 1)}
                      disabled={currentPage >= Math.ceil(filteredAthletes.length / parseInt(paginationMode)) - 1}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[32px] sm:min-h-[35px]"
                    >
                      <span className="text-xs sm:text-sm">Última</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto text-cyan-400/50 mb-4" size={64} />
                <p className="text-cyan-400/70 text-lg">No hay deportistas que coincidan con los filtros</p>
                <Button
                  label="Limpiar Filtros"
                  icon="pi pi-filter-slash"
                  className="p-button-text mt-4 text-cyan-400 hover:text-cyan-300 min-h-[35px]"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSports([]);
                    setSelectedCountries([]);
                  }}
                />
              </div>
            )}
          </Card>
        </TabPanel>

        {/* Tab 2: Gestión de Deportistas */}
        <TabPanel header=" Deportistas" leftIcon="pi pi-users mr-2">
          <Card title="Lista de Deportistas" className="shadow-lg border-0">
            <div className="w-full overflow-x-auto -mx-1 px-4 md:mx-0 md:px-0">
              <DataTable
                value={filteredAthletes}
                loading={loading}
                paginator
                rows={10}
                emptyMessage="No hay deportistas registrados. Haz clic en 'Agregar Deportista' para comenzar."
                className="p-datatable-gridlines"
                responsiveLayout="scroll"
              >
              <Column field="fullName" header="Nombre Completo" sortable />
          <Column field="sport" header="Deporte" body={sportBodyTemplate} sortable />
              <Column field="age" header="Edad" sortable />
              <Column field="country" header="País" sortable />
              <Column 
                header="Registros" 
                body={(rowData) => getAthleteStats(rowData.id).length}
                sortable
                sortFunction={(e: any) => {
                  const data = [...filteredAthletes];
                  data.sort((a, b) => {
                    const aRecords = getAthleteStats(a.id).length;
                    const bRecords = getAthleteStats(b.id).length;
                    return e.order * (aRecords - bRecords);
                  });
                  return data;
                }}
              />
              <Column header="Acciones" body={athleteActionBodyTemplate} style={{ width: '180px' }} />
              </DataTable>
            </div>
          </Card>
        </TabPanel>

        {/* Tab 3: Registros Diarios */}
        <TabPanel header="Registros Diarios" leftIcon="pi pi-calendar mr-2">
          <Card title="Gestión de Registros" className="mb-6 shadow-lg border-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 ">
              <p className="text-cyan-400/70 text-sm sm:text-base">
                Visualiza y gestiona todos los registros deportivos de tus atletas
              </p>
              <Button
                label="Nuevo Registro"
                icon="pi pi-plus"
                onClick={() => openRecordDialog()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 !text-center min-h-[35px] whitespace-nowrap"
                disabled={athletes.length === 0}
              />
            </div>

            <div className="w-full overflow-x-auto -mx-1 px-2 md:mx-0 md:px-0">
              <DataTable
                value={sportRecords}
                loading={loading}
                paginator
                rows={15}
                emptyMessage="No hay registros. Agrega registros desde las tarjetas de deportistas o el botón 'Nuevo Registro'."
                className="p-datatable-gridlines"
                responsiveLayout="scroll"
              >
              <Column 
                field="athleteId" 
                header="Deportista" 
                body={(rowData) => {
                  const athlete = athletes.find(a => Number(a.id) === Number(rowData.athleteId));
                  return athlete?.fullName || 'Desconocido';
                }}
                sortable 
              />
              <Column field="sport" header="Deporte" body={sportBodyTemplate} sortable />
              <Column field="date" header="Fecha" body={dateBodyTemplate} sortable />
              <Column 
                header="Datos" 
                body={(rowData) => {
                  const fields = getSportFields(rowData.sport);
                  return (
                    <div className="text-sm">
                      {fields.map((field, idx) => (
                        <span key={field.name}>
                          {field.label}: <strong>{rowData[field.name] || 'N/A'}</strong>
                          {idx < fields.length - 1 ? ' • ' : ''}
                        </span>
                      ))}
                    </div>
                  );
                }}
              />
              <Column header="Acciones" body={recordActionBodyTemplate} style={{ width: '120px' }} />
            </DataTable>
          </div>
        </Card>
        </TabPanel>

        {/* Tab 4: Comparación por Deporte y Nacionalidad */}
        <TabPanel header="Comparación" leftIcon="pi pi-chart-line mr-2">
          <Card title="Comparación por Deporte y Nacionalidad" className="mb-6 shadow-lg border-0">
            <p className="text-cyan-400/70 mb-4 text-sm sm:text-base">
              Compara el rendimiento de deportistas filtrando por deporte y nacionalidad
            </p>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  Seleccionar Deporte
                </label>
                <Dropdown
                  value={comparisonSport}
                  onChange={(e) => setComparisonSport(e.value)}
                  options={getAvailableSports()}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecciona un deporte"
                  className="w-full"
                  showClear
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  Seleccionar Nacionalidad (Opcional)
                </label>
                <Dropdown
                  value={comparisonCountry}
                  onChange={(e) => setComparisonCountry(e.value)}
                  options={getAvailableCountries()}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Todas las nacionalidades"
                  className="w-full"
                  showClear
                />
              </div>
            </div>

            {comparisonSport ? (
              <>
                {/* Jugador Destacado */}
                {(() => {
                  const topAthlete = getTopAthlete();
                  const comparisonCount = getComparisonAthletes().length;
                  
                  return topAthlete && (
                    <Card className="mb-6 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 shadow-xl">
                      <div className="space-y-6">
                        {/* Header del Jugador Destacado */}
                        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-cyan-500/20">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg relative">
                              <Award className="text-white" size={48} />
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                                <span className="text-xs font-bold text-gray-900">1°</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                              <h3 className="text-2xl font-bold text-cyan-400">
                                🏆 Jugador Destacado
                              </h3>
                              <span className="text-xs px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400">
                                Evaluado entre {comparisonCount} {comparisonCount === 1 ? 'jugador' : 'jugadores'}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-3">
                              {topAthlete.fullName}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm">
                              <span className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 font-semibold">
                                {sports.find(s => s.value === topAthlete.sport)?.label}
                              </span>
                              <span className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 font-semibold">
                                🌍 {topAthlete.country}
                              </span>
                              <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 font-semibold">
                                📊 {topAthlete.recordsCount} registro(s)
                              </span>

                            </div>
                          </div>
                        </div>

                        {/* Estadísticas Detalladas */}
                        <div>
                          <h4 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} />
                            Estadísticas Promedio
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topAthlete.stats && Object.entries(topAthlete.stats).map(([key, stat]: [string, any]) => {
                              // Colores diferentes para cada métrica
                              const colors = [
                                { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400', icon: 'bg-blue-500' },
                                { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400', icon: 'bg-purple-500' },
                                { bg: 'bg-green-500/10', border: 'border-green-500/40', text: 'text-green-400', icon: 'bg-green-500' },
                                { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400', icon: 'bg-orange-500' },
                                { bg: 'bg-pink-500/10', border: 'border-pink-500/40', text: 'text-pink-400', icon: 'bg-pink-500' },
                                { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', icon: 'bg-cyan-500' },
                              ];
                              const colorIndex = Object.keys(topAthlete.stats).indexOf(key);
                              const color = colors[colorIndex % colors.length];

                              return (
                                <div 
                                  key={key}
                                  className={`relative ${color.bg} border-2 ${color.border} rounded-xl p-4 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <p className={`text-xs font-medium ${color.text} opacity-80 mb-1`}>
                                        {stat.label}
                                      </p>
                                      <p className={`text-2xl font-bold ${color.text}`}>
                                        {stat.average.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className={`w-10 h-10 ${color.icon} rounded-lg flex items-center justify-center shadow-lg`}>
                                      <Activity className="text-white" size={20} />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className={`${color.text} opacity-70`}>
                                      Total: {stat.total.toFixed(2)}
                                    </span>
                                    <span className={`${color.text} opacity-70`}>
                                      En {stat.count} registros
                                    </span>
                                  </div>
                                  {/* Barra de progreso visual */}
                                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${color.icon} rounded-full transition-all`}
                                      style={{ 
                                        width: `${Math.min((stat.average / Math.max(...Object.values(topAthlete.stats).map((s: any) => s.average))) * 100, 100)}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })()}

                {/* Gráfico Comparativo */}
                {getComparisonAthletes().length > 0 ? (
                  <Card title="Comparación de Métricas" className="shadow-lg border-0">
                    <div className="w-full overflow-x-auto">
                      <div style={{ minHeight: '400px', height: '400px', minWidth: '300px' }}>
                        <Chart 
                          type="bar" 
                          data={getComparisonChartData()} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                                labels: {
                                  color: 'rgba(6, 182, 212, 0.8)',
                                  font: {
                                    size: 12
                                  }
                                }
                              },
                              title: {
                                display: true,
                                text: `Comparación de ${sports.find(s => s.value === comparisonSport)?.label}`,
                                color: 'rgba(6, 182, 212, 1)',
                                font: {
                                  size: 16,
                                  weight: 'bold'
                                }
                              }
                            },
                            scales: {
                              x: {
                                ticks: {
                                  color: 'rgba(6, 182, 212, 0.7)',
                                  font: {
                                    size: 10
                                  }
                                },
                                grid: {
                                  color: 'rgba(6, 182, 212, 0.1)'
                                }
                              },
                              y: {
                                ticks: {
                                  color: 'rgba(6, 182, 212, 0.7)',
                                  font: {
                                    size: 10
                                  }
                                },
                                grid: {
                                  color: 'rgba(6, 182, 212, 0.1)'
                                }
                              }
                            }
                          }} 
                        />
                      </div>
                    </div>

                    {/* Resumen de atletas filtrados */}
                    <div className="mt-6 pt-6 border-t border-cyan-500/20">
                      <p className="text-cyan-400/70 text-sm">
                        Mostrando comparación de <strong className="text-cyan-400">{getComparisonAthletes().length}</strong> deportista(s)
                        {comparisonCountry && (
                          <span> de <strong className="text-cyan-400">{countries.find(c => c.value === comparisonCountry)?.label}</strong></span>
                        )}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-cyan-400/50 mb-4" size={64} />
                    <p className="text-cyan-400/70 text-lg">
                      No hay deportistas que coincidan con los filtros seleccionados
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Activity className="mx-auto text-cyan-400/50 mb-4" size={64} />
                <p className="text-cyan-400/70 text-lg">
                  Selecciona un deporte para comenzar la comparación
                </p>
              </div>
            )}
          </Card>
        </TabPanel>
      </TabView>
      </div>

      {/* Dialog para Agregar/Editar Deportista */}
      <Dialog
        header={
          <div className="flex items-center gap-2">
            <Users size={24} className="text-blue-500" />
            <span>{selectedAthlete ? "Editar Deportista" : "Nuevo Deportista"}</span>
          </div>
        }
        visible={athleteDialogVisible}
        style={{ width: '600px' }}
        onHide={() => {
          setAthleteDialogVisible(false);
          resetAthleteForm();
        }}
        className="p-fluid"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Nombre Completo <span className="text-red-400">*</span>
            </label>
            <InputText
              value={athleteFormData.fullName}
              onChange={(e) => setAthleteFormData({ ...athleteFormData, fullName: e.target.value })}
              placeholder="Ej: Juan Pérez García"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Deporte <span className="text-red-400">*</span>
              </label>
            <Dropdown
              value={athleteFormData.sport}
              onChange={(e) => setAthleteFormData({ ...athleteFormData, sport: e.value })}
              options={sports}
              optionLabel="label"
                optionValue="value"
              placeholder="Selecciona un deporte"
              className="w-full"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Edad <span className="text-red-400">*</span>
              </label>
              <InputNumber
                value={athleteFormData.age}
                onValueChange={(e) => setAthleteFormData({ ...athleteFormData, age: e.value ?? null })}
                placeholder="Ej: 25"
                className="w-full"
                min={10}
                max={100}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              País <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={athleteFormData.country}
              onChange={(e) => setAthleteFormData({ ...athleteFormData, country: e.value })}
              options={countries}
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona un país"
              className="w-full"
              filter
              showClear
            />
          </div>

          {/* Subir foto */}
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Foto (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-cyan-400/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
            />
            {(athleteFormData.photoBase64 || athleteFormData.photoUrl) && (
              <img
                src={athleteFormData.photoBase64 || athleteFormData.photoUrl}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-lg border-2 border-cyan-500/30"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-cyan-500/30">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text min-h-[35px]"
              onClick={() => {
                setAthleteDialogVisible(false);
                resetAthleteForm();
              }}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={handleSaveAthlete}
              className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 min-h-[35px]"
            />
          </div>
        </div>
      </Dialog>

      {/* Dialog para Agregar/Editar Registro */}
      <Dialog
        header={
          <div className="flex items-center gap-2">
            <Activity size={24} className="text-green-500" />
            <span>{selectedRecord ? "Editar Registro" : "Nuevo Registro"}</span>
          </div>
        }
        visible={recordDialogVisible}
        style={{ width: '700px' }}
        onHide={() => {
          setRecordDialogVisible(false);
          resetRecordForm();
        }}
        className="p-fluid"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Deportista <span className="text-red-400">*</span>
            </label>
            {selectedRecord || selectedAthleteForRecord ? (
              <div className="w-full px-4 py-3 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-lg backdrop-blur-sm">
                <span className="text-cyan-400 font-semibold">
                  {selectedAthleteForRecord?.fullName || athletes.find(a => Number(a.id) === Number(recordFormData.athleteId))?.fullName}
                </span>
              </div>
            ) : (
              <Dropdown
                value={recordFormData.athleteId}
                onChange={(e) => handleAthleteSelectForRecord(e.value)}
                options={athletes}
                optionLabel="fullName"
                optionValue="id"
                placeholder="Selecciona un deportista"
                className="w-full"
              />
            )}
          </div>

            <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Fecha <span className="text-red-400">*</span>
            </label>
              <Calendar
              value={recordFormData.date}
              onChange={(e) => setRecordFormData({ ...recordFormData, date: e.value as Date })}
                dateFormat="dd/mm/yy"
                className="w-full"
                showIcon
              maxDate={new Date()}
              />
            </div>

          {recordFormData.sport && (
            <div className="border-t border-cyan-500/30 pt-4">
              <h4 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-400" />
                Estadísticas de {sports.find(s => s.value === recordFormData.sport)?.label}
              </h4>
          <div className="grid grid-cols-2 gap-4">
                {getSportFields(recordFormData.sport).map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">
                      {field.label} <span className="text-red-400">*</span>
                    </label>
                    {field.type === 'number' ? (
              <InputNumber
                        value={recordFormData[field.name]}
                        onValueChange={(e) => setRecordFormData({ ...recordFormData, [field.name]: e.value })}
                className="w-full"
                min={0}
                        mode={field.decimal ? 'decimal' : undefined}
                        minFractionDigits={field.decimal ? 2 : 0}
                        maxFractionDigits={field.decimal ? 2 : 0}
                      />
                    ) : (
                      <InputText
                        value={recordFormData[field.name] || ''}
                        onChange={(e) => setRecordFormData({ ...recordFormData, [field.name]: e.target.value })}
                className="w-full"
              />
                    )}
            </div>
                ))}
            </div>
          </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-cyan-500/30">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-outlined border-cyan-500/50 text-cyan-400 min-h-[35px]"
              onClick={() => {
                setRecordDialogVisible(false);
                resetRecordForm();
              }}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={handleSaveRecord}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 min-h-[35px]"
            />
          </div>
        </div>
      </Dialog>

      {/* Modal de Detalle del Deportista */}
      {selectedAthleteForDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950/95 backdrop-blur-xl rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-cyan-500/30 custom-scrollbar" style={{boxShadow: '0 0 60px rgba(6, 182, 212, 0.4)'}}>
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b-2 border-cyan-500/30 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl text-cyan-400 mb-2 font-bold">{selectedAthleteForDetail.fullName}</h2>
                <div className="flex items-center gap-3 text-sm">
                  {sportBodyTemplate(selectedAthleteForDetail)}
                  <span className="text-cyan-400/70">👤 {selectedAthleteForDetail.age} años</span>
                  <span className="text-purple-400/70">🌍 {selectedAthleteForDetail.country}</span>
                </div>
              </div>
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text min-h-[35px]"
                onClick={() => {
                  setAthleteDetailModalVisible(false);
                  setSelectedAthleteForDetail(null);
                }}
                style={{color: '#06b6d4'}}
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Estadísticas Actuales */}
              <div className="bg-gray-900/50 border-2 border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg text-cyan-400 mb-4 font-semibold">Estadísticas Actuales</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const athleteRecords = getAthleteStats(selectedAthleteForDetail.id);
                    const latestRecord = athleteRecords[0];
                    const fields = getSportFields(selectedAthleteForDetail.sport);
                    
                    return fields.map(field => (
                      <div key={field.name} className="bg-gray-800/30 rounded-lg p-4 border border-cyan-500/20 backdrop-blur-sm">
                        <p className="text-sm text-cyan-400/70 mb-1">{field.label}</p>
                        <p className="text-3xl text-cyan-400 font-bold">
                          {latestRecord ? (latestRecord[field.name] || 'N/A') : 'Sin datos'}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Gráfica de Evolución */}
              {(() => {
                const athleteRecords = getAthleteRecordsForChart(selectedAthleteForDetail.id);
                if (athleteRecords.length === 0) {
                  return (
                    <div className="bg-gray-900/50 border-2 border-cyan-500/20 rounded-xl p-12 text-center backdrop-blur-sm">
                      <CalendarIcon className="w-12 h-12 text-cyan-400/50 mx-auto mb-3" />
                      <p className="text-cyan-400/70">No hay registros históricos todavía</p>
                      <p className="text-sm text-cyan-400/50 mt-1">
                        Agrega registros diarios para ver la evolución
                      </p>
                    </div>
                  );
                }

                // Preparar datos para Chart.js
                const sportFields = getSportFields(selectedAthleteForDetail.sport).filter(f => f.type === 'number');
                const colors = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];
                
                const lineChartData = {
                  labels: athleteRecords.map((r: any) => r.date),
                  datasets: sportFields.map((field, index) => ({
                    label: field.label,
                    data: athleteRecords.map((r: any) => r[field.name] || 0),
                    borderColor: colors[index % colors.length],
                    backgroundColor: colors[index % colors.length] + '33',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                  })),
                };

                const lineChartOptions = {
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                      labels: {
                        color: '#06b6d4',
                        font: { size: 12 },
                        padding: 15,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(3, 7, 18, 0.95)',
                      titleColor: '#06b6d4',
                      bodyColor: '#e5e7eb',
                      borderColor: 'rgba(6, 182, 212, 0.5)',
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: '#e5e7eb',
                        font: { size: 11 },
                      },
                      grid: {
                        color: 'rgba(6, 182, 212, 0.1)',
                      },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#e5e7eb',
                        font: { size: 11 },
                      },
                      grid: {
                        color: 'rgba(6, 182, 212, 0.1)',
                      },
                    },
                  },
                };

                return (
                  <div className="bg-gray-900/50 border-2 border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg text-cyan-400 mb-4 font-semibold">Evolución Histórica</h3>
                    <div style={{ minHeight: '320px', height: '320px' }}>
                      <Chart type="line" data={lineChartData} options={lineChartOptions} />
                    </div>
                  </div>
                );
              })()}

              {/* Tabla de Registros */}
              {(() => {
                const athleteRecords = getAthleteStats(selectedAthleteForDetail.id);
                return athleteRecords.length > 0 && (
                  <div className="bg-gray-900/50 border-2 border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg text-cyan-400 mb-4 font-semibold">Historial de Registros</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-cyan-500/30">
                            <th className="text-left text-cyan-400 pb-3 pr-4 font-semibold">Fecha</th>
                            {getSportFields(selectedAthleteForDetail.sport).map(field => (
                              <th key={field.name} className="text-left text-cyan-400 pb-3 px-4 font-semibold">
                                {field.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {athleteRecords.map(record => (
                            <tr key={record.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                              <td className="py-3 pr-4 text-cyan-400/70">
                                {dateBodyTemplate(record)}
                              </td>
                              {getSportFields(selectedAthleteForDetail.sport).map(field => (
                                <td key={field.name} className="py-3 px-4 text-white font-semibold">
                                  {record[field.name] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
