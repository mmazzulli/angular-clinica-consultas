require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const specialtyRoutes = require('./routes/specialty.routes');
const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200', // fallback
  credentials: true,
}));

// Rotas
app.use('/', authRoutes);
app.use('/', homeRoutes);
app.use('/specialties', specialtyRoutes);
app.use('/appointments', appointmentRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
