import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuariosRoutes from './routes/usuarios.js';
import trilhasRoutes from './routes/trilhas.js';
import aulasRoutes from './routes/aulas.js';
import exerciciosRoutes from './routes/exercicios.js';
import progressoRoutes from './routes/progresso.js';
import authRoutes from './routes/auth.js';
import gamificacaoRoutes from './routes/gamificacao.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/trilhas', trilhasRoutes);
app.use('/api/aulas', aulasRoutes);
app.use('/api/exercicios', exerciciosRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/gamificacao', gamificacaoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

