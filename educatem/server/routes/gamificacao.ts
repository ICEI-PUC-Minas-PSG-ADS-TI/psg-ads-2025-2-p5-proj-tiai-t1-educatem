import express from 'express';
import pool from '../db.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all gamificacao for a user
router.get('/aluno/:idAluno', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { idAluno } = req.params;
    const result = await pool.query(
      `SELECT * FROM Gamificacao 
       WHERE id_aluno = $1 
       ORDER BY data_conquista DESC`,
      [idAluno]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gamificacao:', error);
    res.status(500).json({ error: 'Erro ao buscar conquistas' });
  }
});

// Create new gamificacao
router.post('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id_aluno, tipo_recompensa, valor_recompensa } = req.body;

    if (!id_aluno || !tipo_recompensa || !valor_recompensa) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const result = await pool.query(
      `INSERT INTO Gamificacao (id_aluno, tipo_recompensa, valor_recompensa, data_conquista)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id_aluno, tipo_recompensa, valor_recompensa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating gamificacao:', error);
    res.status(500).json({ error: 'Erro ao criar conquista' });
  }
});

// Get statistics for a user
router.get('/aluno/:idAluno/estatisticas', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { idAluno } = req.params;
    
    // Get total badges
    const badgesResult = await pool.query(
      'SELECT COUNT(*) as total FROM Gamificacao WHERE id_aluno = $1',
      [idAluno]
    );
    
    // Get completed courses count
    const coursesResult = await pool.query(
      `SELECT COUNT(DISTINCT id_aula) as total 
       FROM ProgressoAlunos 
       WHERE id_aluno = $1 AND status_aula = 'concluida'`,
      [idAluno]
    );
    
    // Get total study time (sum of durations)
    const timeResult = await pool.query(
      `SELECT COALESCE(SUM(a.duracao), 0) as total_minutos
       FROM ProgressoAlunos p
       JOIN Aulas a ON p.id_aula = a.id_aula
       WHERE p.id_aluno = $1 AND p.status_aula = 'concluida'`,
      [idAluno]
    );
    
    res.json({
      totalBadges: parseInt(badgesResult.rows[0].total),
      completedCourses: parseInt(coursesResult.rows[0].total),
      totalMinutes: parseInt(timeResult.rows[0].total_minutos),
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export default router;

