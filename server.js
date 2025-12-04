import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Servir imágenes estáticas
app.use('/jugadores', express.static(path.join(__dirname, 'public', 'jugadores')));

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, 'public', 'jugadores');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Usar el nombre del jugador desde el body, si existe
    const athleteName = req.body.athleteName || path.basename(file.originalname, ext);
    const cleanName = athleteName.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/[^a-z0-9-]/g, ''); // Solo letras, números y guiones
    cb(null, `${cleanName}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Subir imagen
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  
  const photoUrl = `/jugadores/${req.file.filename}`;
  console.log('✅ Guardado:', req.file.filename, '- Jugador:', req.body.athleteName);
  
  res.json({ photoUrl });
});

// Iniciar
app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
  console.log(`📁 Imágenes en: ${uploadDir}`);
});

