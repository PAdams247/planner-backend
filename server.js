// TODO: SECURITY - Whitelist specific Render IP addresses in MongoDB Atlas
// Currently using "Allow Access from Anywhere" (0.0.0.0/0)
// See: https://render.com/docs/static-outbound-ip-addresses
// MongoDB Atlas: Network Access settings

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: ['https://parkeradams.dev', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Daily Planner API is running!' });
});

const authRoutes = require('./routes/auth');
const plannerRoutes = require('./routes/planner');

app.use('/api/auth', authRoutes);
app.use('/api/planner', plannerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
