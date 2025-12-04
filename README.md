# 🏆 Dashboard de Estadísticas Deportivas

Una aplicación web moderna desarrollada en React para la gestión completa de deportistas y visualización de sus estadísticas de rendimiento.

## ✨ Características Principales

### 📊 Vista General
- **Dashboard interactivo** con métricas en tiempo real
- **Gráficos visuales** (distribución por deporte y país)
- **Filtros avanzados** por deporte, país y búsqueda por nombre
- **Tarjetas individuales** de deportistas con sus últimos registros

### 👥 Gestión de Deportistas (CRUD Completo)
- ✅ **Crear**: Agregar nuevos deportistas con información completa
- ✅ **Leer**: Listar todos los deportistas con sus datos
- ✅ **Actualizar**: Editar información de deportistas existentes
- ✅ **Eliminar**: Remover deportistas del sistema

#### Campos del Formulario:
- Nombre completo
- Deporte (fútbol, baloncesto, tenis, atletismo, natación)
- Edad
- País

### 📝 Registros Diarios por Deporte

Cada deporte tiene campos específicos:

#### ⚽ Fútbol
- Goles
- Asistencias
- Partidos jugados

#### 🏀 Baloncesto
- Puntos
- Rebotes
- Asistencias

#### 🎾 Tenis
- Partidos ganados
- Partidos perdidos
- Aces

#### 🏃 Atletismo
- Mejor tiempo (segundos)
- Competiciones ganadas

#### 🏊 Natación
- Mejor tiempo (segundos)
- Estilo principal (Libre, Espalda, Mariposa, Pecho)

### 💾 Persistencia de Datos
- **IndexedDB** para almacenamiento local
- Datos persistentes entre sesiones
- Sin necesidad de backend

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos utility-first
- **PrimeReact** - Componentes UI
- **Chart.js** - Gráficos y visualizaciones
- **IndexedDB (idb)** - Base de datos local
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **React Router** - Navegación

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
cd dashboard-deportivo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 📱 Características de Diseño

### 🎨 UI/UX Profesional
- ✅ Diseño moderno con gradientes y sombras
- ✅ Animaciones suaves con Framer Motion
- ✅ Tarjetas interactivas con hover effects
- ✅ Formularios intuitivos con validación
- ✅ Tablas con paginación y ordenamiento

### 📱 Responsive Design
- ✅ Adaptable a móviles, tablets y escritorio
- ✅ Sidebar colapsable
- ✅ Grids responsivos
- ✅ Diálogos adaptables

### 🎯 UX Optimizada
- ✅ Feedback visual (toasts, confirmaciones)
- ✅ Loading states
- ✅ Estados vacíos informativos
- ✅ Tooltips descriptivos
- ✅ Botón de datos de ejemplo para testing rápido

## 📂 Estructura del Proyecto

```
dashboard-deportivo/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Layout.tsx          # Layout principal con sidebar
│   │   └── LoadSampleData.tsx      # Componente para datos de ejemplo
│   ├── pages/
│   │   └── Dashboard.tsx           # Página principal del dashboard
│   ├── services/
│   │   └── database.js             # Servicio de IndexedDB
│   ├── styles/
│   │   └── primereact-theme.css    # Tema personalizado de PrimeReact
│   ├── App.jsx                     # Componente raíz
│   ├── index.css                   # Estilos globales
│   └── main.jsx                    # Punto de entrada
├── public/
├── package.json
└── README.md
```

## 🎮 Uso de la Aplicación

### 1. Cargar Datos de Ejemplo
Al iniciar la aplicación por primera vez, encontrarás un botón **"Cargar Datos de Ejemplo"** que cargará 10 deportistas famosos con múltiples registros.

### 2. Agregar un Deportista
1. Click en **"Agregar Deportista"**
2. Completar el formulario con todos los campos requeridos
3. Click en **"Guardar"**

### 3. Agregar Registros
Desde las tarjetas de deportistas o la tabla:
1. Click en el botón **"+"** (Agregar Registro)
2. Seleccionar fecha
3. Completar los campos específicos del deporte
4. Click en **"Guardar"**

### 4. Filtrar Deportistas
- **Búsqueda por texto**: Nombre o país
- **Filtro por deporte**: Selección múltiple
- **Filtro por país**: Selección múltiple

### 5. Visualizar Estadísticas
- Vista general con gráficos de distribución
- Tarjetas individuales con últimos registros
- Tabla completa de todos los registros

## 🎨 Paleta de Colores

- **Fútbol**: Verde (`#10b981`)
- **Baloncesto**: Naranja (`#f59e0b`)
- **Tenis**: Rojo (`#ef4444`)
- **Natación**: Cyan (`#06b6d4`)
- **Atletismo**: Púrpura (`#8b5cf6`)

## 📊 Capturas de Pantalla

### Dashboard Principal
- Estadísticas generales en cards
- Gráficos de distribución
- Filtros avanzados
- Tarjetas de deportistas

### Gestión de Deportistas
- Tabla completa con todas las opciones CRUD
- Búsqueda y filtros
- Acciones rápidas

### Registros Diarios
- Tabla de todos los registros
- Campos dinámicos por deporte
- Edición y eliminación

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 💡 Próximas Mejoras

- [ ] Exportar datos a CSV/Excel
- [ ] Importar datos desde archivos
- [ ] Gráficos de evolución individual por deportista
- [ ] Comparativas entre deportistas
- [ ] Sistema de objetivos y metas
- [ ] Notificaciones y recordatorios
- [ ] Modo oscuro
- [ ] Multi-idioma

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como prueba técnica con enfoque en:
- **UI/UX profesional y moderno**
- **Código limpio y mantenible**
- **Componentes reutilizables**
- **Diseño completamente responsive**
- **Persistencia de datos local**

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto como base para tus propias aplicaciones.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

Desarrollado con ❤️ usando React y las mejores prácticas de desarrollo web moderno.
