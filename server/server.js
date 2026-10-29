const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables (server/.env or root .env)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow client connections
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SKB Tour and Travels API',
    businessOwner: 'Vicky',
    contact: '9035897960',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/contacts', require('./src/routes/contactRoutes'));
app.use('/api/enquiries', require('./src/routes/enquiryRoutes'));
app.use('/api/fleet', require('./src/routes/fleetRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/public', require('./src/routes/publicRoutes'));

// Serve client dist in production or for unified full-stack serving
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('{*splat}', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Route Handler for unmatched API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`SKB Tour and Travels Backend Server`);
  console.log(`Running on port: http://localhost:${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
