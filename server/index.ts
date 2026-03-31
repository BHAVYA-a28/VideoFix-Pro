import express from 'express';
import cors from 'cors';
import softwareRoutes from './routes/software';
import telemetryRoutes from './routes/telemetry';
import billingRoutes from './routes/billing';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json());

// Main Domain Clusters
app.use('/api/software', softwareRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/billing', billingRoutes);

// Shared Intelligence Health-check
app.get('/health', (req, res) => {
  res.json({
    status: 'Operational',
    systemTime: new Date().toISOString(),
    api: 'VideoFix Pro - Professional Distributed Backend v1.0'
  });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✔ VideoFix Pro Backend is ACTIVE\x1b[0m`);
  console.log(`\x1b[36m➜ Listening on http://localhost:${PORT}\x1b[0m`);
});
