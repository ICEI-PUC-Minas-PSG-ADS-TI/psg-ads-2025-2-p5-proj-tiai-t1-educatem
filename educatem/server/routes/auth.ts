import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, nivel_ensino } = req.body;

    if (!nome || !email || !senha || !nivel_ensino) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!['fundamental', 'medio'].includes(nivel_ensino)) {
      return res.status(400).json({ error: 'Nível de ensino inválido' });
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT id_usuario FROM Usuarios WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO Usuarios (nome, email, senha, data_cadastro)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING id_usuario, nome, email, data_cadastro`,
      [nome, email, hashedPassword]
    );

    const user = userResult.rows[0];

    // Create aluno
    await pool.query(
      `INSERT INTO Alunos (id_aluno, nivel_ensino, pontuacao_total)
       VALUES ($1, $2, 0)`,
      [user.id_usuario, nivel_ensino]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id_usuario,
        nome: user.nome,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Find user
    const userResult = await pool.query(
      `SELECT u.id_usuario, u.nome, u.email, u.senha, a.nivel_ensino
       FROM Usuarios u
       JOIN Alunos a ON u.id_usuario = a.id_aluno
       WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = userResult.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Update last login
    await pool.query(
      'UPDATE Usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = $1',
      [user.id_usuario]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id_usuario,
        nome: user.nome,
        email: user.email,
        nivel_ensino: user.nivel_ensino,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;

