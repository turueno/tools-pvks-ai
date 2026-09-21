import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin de desarrollo para recibir imágenes vía drag & drop y guardarlas en public/images/
function imageUploadPlugin() {
  return {
    name: 'pvks-image-upload-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let rawBody = '';
        req.on('data', chunk => {
          rawBody += chunk;
        });

        req.on('end', () => {
          try {
            const { filename, folder = 'lullaby', base64Data, homeId } = JSON.parse(rawBody);

            if (!filename || !base64Data) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Faltan parámetros filename o base64Data' }));
              return;
            }

            // Sanitizar nombre de archivo y carpeta para evitar path traversal
            const cleanFolder = String(folder).replace(/[^a-zA-Z0-9_-]/g, '') || 'lullaby';
            const originalExt = path.extname(filename) || '.jpg';
            const baseName = path.basename(filename, originalExt)
              .toLowerCase()
              .replace(/[^a-zA-Z0-9_-]/g, '-');
            
            const cleanFilename = `${baseName}${originalExt.toLowerCase()}`;

            // Carpeta destino en public/images/{folder}
            const publicDir = path.resolve(__dirname, 'public/images', cleanFolder);
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }

            // Extraer buffer binario a partir de Base64
            const base64Clean = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
            const buffer = Buffer.from(base64Clean, 'base64');

            const filePath = path.join(publicDir, cleanFilename);
            fs.writeFileSync(filePath, buffer);

            // Si existe la carpeta dist/images/{folder}, sincronizar también
            const distDir = path.resolve(__dirname, 'dist/images', cleanFolder);
            if (fs.existsSync(distDir)) {
              fs.writeFileSync(path.join(distDir, cleanFilename), buffer);
            }

            const relativeUrl = `/images/${cleanFolder}/${cleanFilename}`;

            // Si se especificó un homeId, sincronizar permanentemente en schema.js
            if (homeId) {
              try {
                const schemaPath = path.resolve(__dirname, 'src/playbook/data/schema.js');
                if (fs.existsSync(schemaPath)) {
                  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
                  const regex = new RegExp(`(id:\\s*['"]${homeId}['"][\\s\\S]*?imagenUrl:\\s*['"])([^'"]+)(['"])`);
                  if (regex.test(schemaContent)) {
                    schemaContent = schemaContent.replace(regex, `$1${relativeUrl}$3`);
                    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
                    console.log(`[Upload Plugin] schema.js actualizado en disco para ${homeId}: ${relativeUrl}`);
                  }
                }
              } catch (schemaErr) {
                console.error('[Upload Plugin] Error actualizando schema.js:', schemaErr);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              filename: cleanFilename,
              folder: cleanFolder,
              url: relativeUrl,
              sizeBytes: buffer.length,
              savedAt: new Date().toISOString()
            }));
          } catch (err) {
            console.error('[Upload Plugin] Error procesando imagen:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Error interno al guardar archivo' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
});
