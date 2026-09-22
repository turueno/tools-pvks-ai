// server.js
// Servidor de Producción Node.js + Express para Railway
// Sirve la SPA de React (dist/) y la API REST (/api/*) con persistencia en PostgreSQL / Almacén Cloud

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/api.js';
import { initDatabase } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rutas API
app.use('/api', apiRouter);

// Servir archivos estáticos del frontend compilado por Vite
const DIST_DIR = path.resolve(__dirname, 'dist');
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Si son assets con hash (ej. JS/CSS), cachear agresivamente
    if (path.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Redirigir cualquier otra ruta no encontrada a index.html (SPA client-side routing)
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Arrancar el servidor HTTP de inmediato (vital para el healthcheck de Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log('----------------------------------------------------');
  console.log(`🚀 Servidor Tools PVKS AI escuchando en puerto ${PORT}`);
  console.log(`✓ Frontend SPA listo en ${DIST_DIR}`);
  console.log('----------------------------------------------------');

  // Inicializar almacenamiento y base de datos en segundo plano
  initDatabase().catch(err => {
    console.error('[DB] Fallo inicializando almacenamiento:', err.message);
  });
});
