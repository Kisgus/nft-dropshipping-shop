const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('./package.json').version
  });
});

// API Routes
app.use('/api/printful', require('./src/routes/printful'));
app.use('/api/nft', require('./src/routes/nft'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/auth', require('./src/routes/auth'));

// Main route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

app.listen(PORT, () => {
  console.log(`NFT Dropshipping Shop server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health - Health check');
  console.log('- GET /api/printful/products - Printful products');
  console.log('- POST /api/nft/metadata - Generate NFT metadata');
  console.log('- POST /api/orders - Create order');
});