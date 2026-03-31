import express from 'express';
import cors from 'cors';
import softwareRoutes from './routes/software';
import telemetryRoutes from './routes/telemetry';
import billingRoutes from './routes/billing';
import { ApiResponse } from '../src/shared/types';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json());

// API Versioning and Routing Distribution
const apiV1 = express.Router();

apiV1.use('/software', softwareRoutes);
apiV1.use('/telemetry', telemetryRoutes);
apiV1.use('/billing', billingRoutes);

// Health-check endpoint within V1
apiV1.get('/health', (req, res) => {
  const response: ApiResponse = {
    status: 'success',
    message: 'VideoFix Pro - v1 Operational',
    timestamp: new Date().toISOString(),
    data: {
      version: '1.0.0',
      uptime: process.uptime()
    }
  };
  res.json(response);
});

app.use('/api/v1', apiV1);

// Global Error Handling Middleware (Centralized Intelligence)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('\x1b[31m[VFP-ERROR-LAYER]\x1b[0m', err.stack);
  
  const errorResponse: ApiResponse = {
    status: 'error',
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'System encountered an unexpected telemetry anomaly.',
    timestamp: new Date().toISOString()
  };
  
  res.status(err.status || 500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✔ VideoFix Pro Backend is ACTIVE [v1.0]\x1b[0m`);
  console.log(`\x1b[36m➜ API: http://localhost:${PORT}/api/v1\x1b[0m`);
});
