require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const specialtyRoutes = require('./routes/specialty.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const emailRoutes = require('./routes/email.routes');
const userRoutes = require('./routes/user.routes');


const app = express();

// Configuração de CORS dinâmica
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,        // origem definida no .env (produção)
  'http://localhost:4200',            // fallback Angular
  'http://127.0.0.1:4200',            // outra forma comum no dev
].filter(Boolean); // remove undefined/null

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middlewares globais
app.use(express.json());
app.use(cookieParser());

// Rotas (com prefixo opcional)
app.use('/api/v1', authRoutes);
app.use('/api/v1', homeRoutes);
app.use('/api/v1/specialties', specialtyRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/users', userRoutes);

app.use('/emails', emailRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
