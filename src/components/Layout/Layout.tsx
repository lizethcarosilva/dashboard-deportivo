import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, BarChart3, Activity } from 'lucide-react';
import LightPillar from '../LightPillar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentCoach') || '{"name": "Entrenador Principal", "email": "entrenador@sportdash.com"}');

  const menuItems = [
    { path: '/', icon: <BarChart3 size={20} />, label: 'Dashboard' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 relative overflow-hidden">
      {/* LightPillar Background Effect */}
      <div className="absolute inset-0 z-0">
        <LightPillar
          topColor="#06b6d4"
          bottomColor="#a855f7"
          intensity={0.6}
          rotationSpeed={0.2}
          glowAmount={0.003}
          pillarWidth={2.5}
          pillarHeight={0.3}
          noiseIntensity={0.4}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="screen"
        />
      </div>
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gray-950/40 z-[1] pointer-events-none" />
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: sidebarOpen ? 0 : -300,
          width: sidebarMinimized ? '80px' : '256px'
        }}
        transition={{ duration: 0.3 }}
        className="fixed lg:relative z-30 bg-gray-950/95 backdrop-blur-xl text-white shadow-xl overflow-hidden border-r-2 border-cyan-500/30 relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none z-0" />
        <div className="p-6 relative z-10">
          {/* Logo y Título */}
          <div className="flex items-center justify-between mb-8">
            {!sidebarMinimized ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg shadow-lg" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}>
                    <Activity className="text-white" size={20} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-cyan-400 cyber-text-glow">
                      SportDash
                    </h1>
                    <p className="text-xs text-purple-400">Performance Tracker</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </>
            ) : (
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'}}>
                <Activity size={20} className="text-white" />
              </div>
            )}
          </div>

          {/* Botón Hamburguesa */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="p-2 rounded-lg border-2 border-cyan-500/30 hover:border-cyan-500/50 bg-gray-900/50 hover:bg-cyan-500/10 transition-all"
              style={{boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'}}
              title={sidebarMinimized ? "Expandir menú" : "Minimizar menú"}
            >
              <Menu size={20} className="text-cyan-400" />
            </button>
          </div>

          {/* Perfil de Usuario */}
          {!sidebarMinimized ? (
            <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border-2 border-cyan-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg" style={{boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)'}}>
                  <span className="text-xl font-bold text-white">
                    {currentUser.name?.charAt(0) || 'E'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400">{currentUser.name || 'Entrenador'}</h3>
                  <p className="text-sm text-purple-400">{currentUser.email || 'Pro Trainer'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg" style={{boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)'}}>
                <span className="text-lg font-bold text-white">
                  {currentUser.name?.charAt(0) || 'E'}
                </span>
              </div>
            </div>
          )}

          {/* Menú de Navegación */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center ${sidebarMinimized ? 'justify-center' : 'space-x-3'} p-3 rounded-lg transition-all group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/50' 
                      : 'hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30'
                  }`}
                  style={isActive ? {boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'} : {}}
                  title={sidebarMinimized ? item.label : ''}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-r-full" style={{boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'}} />
                  )}
                  <span className={isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}>
                    {item.icon}
                  </span>
                  {!sidebarMinimized && <span className={isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
          
          {/* Circuit pattern decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path
                d="M0,50 L20,50 L30,30 L50,30 L60,50 L80,50 L90,70 L110,70 L120,50 L150,50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-cyan-500"
              />
              <circle cx="30" cy="30" r="3" fill="currentColor" className="text-cyan-500" />
              <circle cx="60" cy="50" r="3" fill="currentColor" className="text-purple-500" />
              <circle cx="90" cy="70" r="3" fill="currentColor" className="text-cyan-500" />
            </svg>
          </div>
        </div>

      </motion.aside>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="bg-gray-950/80 backdrop-blur-lg shadow-lg border-b-2 border-cyan-500/20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-cyan-400/80 cyber-text-glow">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;