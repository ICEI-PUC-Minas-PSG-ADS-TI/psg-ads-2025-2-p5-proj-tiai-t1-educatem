import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all aulas
router.get('/', async (req, res) => {
  try {
    const { nivel, trilha } = req.query;
    
    let query = 'SELECT * FROM Aulas WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;
    
    if (nivel) {
      query += ` AND nivel_aula = $${paramCount}`;
      params.push(nivel);
      paramCount++;
    }
    
    if (trilha) {
      query += ` AND id_trilha = $${paramCount}`;
      params.push(trilha);
      paramCount++;
    }
    
    query += ' ORDER BY id_aula';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching aulas:', error);
    res.status(500).json({ error: 'Erro ao buscar aulas' });
  }
});

// Get aula by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM Aulas WHERE id_aula = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching aula:', error);
    res.status(500).json({ error: 'Erro ao buscar aula' });
  }
});

// Get exercicios from an aula
router.get('/:id/exercicios', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM Exercicios 
       WHERE id_aula = $1 
       ORDER BY id_exercicio`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercicios:', error);
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
});

export default router;

