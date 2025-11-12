import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all trilhas
router.get('/', async (req, res) => {
  try {
    const { nivel } = req.query;
    
    let query = 'SELECT * FROM TrilhasEstudo';
    const params: string[] = [];
    
    if (nivel) {
      query += ' WHERE nivel_trilha = $1';
      params.push(nivel as string);
    }
    
    query += ' ORDER BY id_trilha';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trilhas:', error);
    res.status(500).json({ error: 'Erro ao buscar trilhas' });
  }
});

// Get trilha by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM TrilhasEstudo WHERE id_trilha = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trilha não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching trilha:', error);
    res.status(500).json({ error: 'Erro ao buscar trilha' });
  }
});

// Get aulas from a trilha
router.get('/:id/aulas', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM Aulas 
       WHERE id_trilha = $1 
       ORDER BY id_aula`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching aulas:', error);
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

// Get trilhas with progress for a student
router.get('/aluno/:idAluno/com-progresso', async (req, res) => {
  try {
    const { idAluno } = req.params;
    const result = await pool.query(
      `SELECT 
        t.*,
        COUNT(DISTINCT a.id_aula) as total_aulas,
        COUNT(DISTINCT CASE WHEN p.status_aula = 'concluida' THEN a.id_aula END) as aulas_concluidas,
        COALESCE(SUM(a.duracao), 0) as duracao_total_minutos,
        COALESCE(AVG(CASE WHEN p.status_aula = 'concluida' THEN p.porcentagem_conclusao END), 0) as progresso_medio
       FROM TrilhasEstudo t
       LEFT JOIN Aulas a ON t.id_trilha = a.id_trilha
       LEFT JOIN ProgressoAlunos p ON a.id_aula = p.id_aula AND p.id_aluno = $1
       GROUP BY t.id_trilha
       ORDER BY t.id_trilha`,
      [idAluno]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trilhas with progress:', error);
    res.status(500).json({ error: 'Erro ao buscar trilhas com progresso' });
  }
});

// Get trilhas by tema_aula (matéria)
router.get('/por-tema/:tema', async (req, res) => {
  try {
    const { tema } = req.params;
    const result = await pool.query(
      `SELECT DISTINCT t.*
       FROM TrilhasEstudo t
       JOIN Aulas a ON t.id_trilha = a.id_trilha
       WHERE a.tema_aula = $1
       ORDER BY t.id_trilha`,
      [tema]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trilhas by tema:', error);
    res.status(500).json({ error: 'Erro ao buscar trilhas por tema' });
  }
});

export default router;

