# 📊 Información sobre el Almacenamiento de Datos - IndexedDB

## ¿Dónde se guardan los datos?

Todos los datos del dashboard deportivo se guardan en **IndexedDB**, una base de datos del navegador que persiste incluso después de cerrar el programa.

### Ubicación de los Datos

Los datos se almacenan en el navegador web en una base de datos llamada: **`sportsDashboardDB`**

### ¿Cómo ver los datos guardados?

#### En Chrome/Edge:
1. Abre las **Herramientas de Desarrollador** (F12 o clic derecho → Inspeccionar)
2. Ve a la pestaña **Application** (Aplicación)
3. En el menú lateral izquierdo, expande **IndexedDB**
4. Busca **`sportsDashboardDB`**
5. Ahí verás todos los almacenes de datos:
   - `coaches` - Entrenadores
   - `athletes` - Deportistas
   - `healthMetrics` - Métricas de salud y físicas
   - `sportStats` - Estadísticas deportivas

#### En Firefox:
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Almacenamiento**
3. Expande **IndexedDB**
4. Busca **`sportsDashboardDB`**

### Estructura de Datos

#### Almacén: `athletes` (Deportistas)
```javascript
{
  id: 1,
  coachId: 1,
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "123456789",
  sport: "soccer",
  status: "active",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

#### Almacén: `healthMetrics` (Métricas Físicas)
```javascript
{
  id: 1,
  athleteId: 1,
  date: "2024-01-15T10:30:00.000Z",
  tension: "120/80",
  peso: 75.5,
  ritmoCardiaco: 72,
  pasos: 10000,
  temperatura: 36.5,
  altura: 175,
  imc: 24.7,
  grasaCorporal: 15.2,
  notas: "Estado óptimo",
  requiresAttention: false,
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### Características Importantes

✅ **Persistencia**: Los datos se mantienen incluso después de cerrar el navegador
✅ **Local**: Todo se guarda en tu computadora, no se envía a ningún servidor
✅ **Rápido**: Acceso inmediato a los datos
✅ **Capacidad**: Puede almacenar grandes cantidades de datos

### ⚠️ Importante

- Los datos están **solo en tu navegador local**
- Si limpias los datos del navegador, se perderán
- Cada navegador tiene su propia base de datos (Chrome, Firefox, etc. no comparten datos)
- Para hacer backup, puedes exportar los datos desde las herramientas de desarrollador

### Exportar/Importar Datos

Para hacer una copia de seguridad:
1. Abre las herramientas de desarrollador
2. Ve a IndexedDB → sportsDashboardDB
3. Puedes ver y copiar los datos manualmente
4. O usar la consola para exportar:
```javascript
// En la consola del navegador
const db = await indexedDB.open('sportsDashboardDB', 1);
// Luego exporta los datos según necesites
```

### Limpiar Datos

Si necesitas eliminar todos los datos:
1. Herramientas de Desarrollador → Application → IndexedDB
2. Clic derecho en `sportsDashboardDB` → Delete database
3. O desde la consola: `indexedDB.deleteDatabase('sportsDashboardDB')`

---

**Nota**: Todos los datos se guardan automáticamente cuando creas, editas o eliminas registros en el dashboard.

