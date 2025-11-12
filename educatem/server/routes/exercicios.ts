import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all exercicios
router.get('/', async (req, res) => {
  try {
    const { aula } = req.query;
    
    let query = 'SELECT * FROM Exercicios';
    const params: any[] = [];
    
    if (aula) {
      query += ' WHERE id_aula = $1';
      params.push(aula);
    }
    
    query += ' ORDER BY id_exercicio';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercicios:', error);
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
});

// Get exercicio by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM Exercicios WHERE id_exercicio = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercício não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching exercicio:', error);
    res.status(500).json({ error: 'Erro ao buscar exercício' });
  }
});

export default router;

