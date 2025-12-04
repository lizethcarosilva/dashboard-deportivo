import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import database from './services/database';
import { loadInitialData } from './utils/loadInitialData';
import './styles/primereact-theme.css';
import './index.css';

function App() {
  useEffect(() => {
    // Inicializar la base de datos y cargar datos iniciales
    const initializeApp = async () => {
      await database.init();
      
      // Crear un entrenador por defecto si no existe
      const currentCoach = localStorage.getItem('currentCoach');
      if (!currentCoach) {
        const defaultCoach = {
          id: 1,
          name: 'Entrenador Principal',
          email: 'entrenador@sportdash.com',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('currentCoach', JSON.stringify(defaultCoach));
      }

      // Cargar datos iniciales solo si no existen
      const athletes = await database.getAllAthletes();
      if (!athletes || athletes.length === 0) {
        await loadInitialData();
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;