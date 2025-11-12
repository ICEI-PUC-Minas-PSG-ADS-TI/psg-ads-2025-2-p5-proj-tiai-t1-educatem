import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT u.id_usuario, u.nome, u.email, u.data_cadastro, u.ultimo_login,
              a.nivel_ensino, a.pontuacao_total
       FROM Usuarios u
       JOIN Alunos a ON u.id_usuario = a.id_aluno
       WHERE u.id_usuario = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching usuario:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

export default router;

