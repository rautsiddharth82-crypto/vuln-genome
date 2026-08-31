import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import uploadRoutes from './routes/uploadRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import patchRoutes from './routes/patchRoutes.js';
import vulnerabilityRoutes from './routes/vulnerabilityRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import genomeRoutes from './routes/genomeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check & Root
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VULN-GENOME MERN Backend',
    version: '1.0.0',
    message: 'VulnGenome Backend API is running.',
    endpoints: {
      health: '/health',
      apiBase: '/api/v1'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VULN-GENOME MERN Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VULN-GENOME MERN Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// API Routes Mounting (support both /api/v1/ and direct mounts for seamless integration)
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1', scanRoutes);
app.use('/api/v1', patchRoutes);
app.use('/api/v1/vulnerabilities', vulnerabilityRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/genomes', genomeRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1', statsRoutes);

// Fallback direct root /api routes for older client compatibility
app.use('/api/ai', aiRoutes);
app.use('/api', scanRoutes);
app.use('/api', patchRoutes);

// Global Error Handler
app.use(errorHandler);

// Connect DB & Start Express Server
export async function startServer() {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(` [VULN-GENOME] MERN Backend Server Active`);
    console.log(` Port: http://localhost:${PORT}`);
    console.log(` API Base: http://localhost:${PORT}/api/v1`);
    console.log(` Uploads: http://localhost:${PORT}/uploads`);
    console.log(` Status: Fully operational`);
    console.log(`====================================================`);
  });

  connectDB().catch((err) => {
    console.warn('[MongoDB Background Warning]:', err.message);
  });

  return server;
}

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
