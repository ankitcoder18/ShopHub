const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
let swaggerSpecs = require('./config/swagger');
let swaggerJsdoc;
try {
    swaggerJsdoc = require('swagger-jsdoc');
} catch (_) {
    swaggerJsdoc = null;
}

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const paymentRoutes = require('./routes/payment');
const { router: notificationRoutes } = require('./routes/notifications');

const app = express();
const activityLogger = require('./middleware/activity');

// Middleware - Allow all origins for easy development and deployment
app.use(cors({
    origin: true,  // Allow any origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Activity logging (non-blocking)
app.use(activityLogger);

// Swagger Documentation (auto-generate if possible, fallback to manual)
try {
    if (swaggerJsdoc) {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'ShopHub E-Commerce API',
                    version: '1.0.0',
                    description: 'Auto-generated docs from route annotations'
                },
                servers: [
                    { url: `${process.env.API_URL || 'http://localhost:5000'}/api`, description: 'Current Server' }
                ],
                components: swaggerSpecs?.components || {}
            },
            apis: [
                path.join(__dirname, 'routes/*.js')
            ]
        };
        const autoSpec = swaggerJsdoc(options);
        // Prefer autoSpec if it has paths
        if (autoSpec && autoSpec.paths && Object.keys(autoSpec.paths).length > 0) {
            swaggerSpecs = autoSpec;
        }
    }
} catch (e) {
    console.warn('Swagger auto-generation failed, using manual spec. Reason:', e?.message);
}

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui { background-color: #fafafa; }',
    customSiteTitle: 'ShopHub API Documentation'
}));

// Root route - Simple status check
app.get('/', (req, res) => {
    res.send('ShopHub API is running. Documentation available at /api-docs');
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', require('./routes/test'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in serverless environment (Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel serverless
module.exports = app;
