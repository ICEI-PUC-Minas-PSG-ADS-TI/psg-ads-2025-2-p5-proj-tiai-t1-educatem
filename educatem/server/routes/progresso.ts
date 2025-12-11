import express from "express";
import pool from "../db.js";
import { verifyToken, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Get progresso for a user
router.get("/aluno/:idAluno", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { idAluno } = req.params;
    const result = await pool.query(
      `SELECT p.*, a.titulo_aula, a.id_trilha
       FROM ProgressoAlunos p
       JOIN Aulas a ON p.id_aula = a.id_aula
       WHERE p.id_aluno = $1
       ORDER BY p.data_ultimo_acesso DESC`,
      [idAluno]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching progresso:", error);
    res.status(500).json({ error: "Erro ao buscar progresso" });
  }
});

// Get progresso for a specific aula
router.get(
  "/aluno/:idAluno/aula/:idAula",
  verifyToken,
  async (req: AuthRequest, res) => {
    try {
      const { idAluno, idAula } = req.params;
      const result = await pool.query(
        "SELECT * FROM ProgressoAlunos WHERE id_aluno = $1 AND id_aula = $2",
        [idAluno, idAula]
      );

      if (result.rows.length === 0) {
        return res.json(null);
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching progresso:", error);
      res.status(500).json({ error: "Erro ao buscar progresso" });
    }
  }
);

// Create or update progresso
router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { id_aluno, id_aula, status_aula, porcentagem_conclusao } = req.body;

    if (!id_aluno || !id_aula || !status_aula) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const result = await pool.query(
      `INSERT INTO ProgressoAlunos (id_aluno, id_aula, status_aula, porcentagem_conclusao, data_ultimo_acesso)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (id_aluno, id_aula)
       DO UPDATE SET 
         status_aula = EXCLUDED.status_aula,
         porcentagem_conclusao = EXCLUDED.porcentagem_conclusao,
         data_ultimo_acesso = CURRENT_TIMESTAMP
       RETURNING *`,
      [id_aluno, id_aula, status_aula, porcentagem_conclusao || 0]
    );

    // Se a aula foi marcada como concluída, verificar se a trilha foi finalizada
    if (status_aula === "concluida") {
      try {
        // Buscar a trilha da aula
        const trilhaResult = await pool.query(
          "SELECT id_trilha FROM Aulas WHERE id_aula = $1",
          [id_aula]
        );

        if (trilhaResult.rows.length > 0) {
          const id_trilha = trilhaResult.rows[0].id_trilha;

          // Verificar se todas as aulas da trilha foram concluídas
          const progressoTrilhaResult = await pool.query(
            `SELECT 
              COUNT(DISTINCT a.id_aula) as total_aulas,
              COUNT(DISTINCT CASE WHEN p.status_aula = 'concluida' THEN a.id_aula END) as aulas_concluidas
             FROM Aulas a
             LEFT JOIN ProgressoAlunos p ON a.id_aula = p.id_aula AND p.id_aluno = $1
             WHERE a.id_trilha = $2`,
            [id_aluno, id_trilha]
          );

          const { total_aulas, aulas_concluidas } =
            progressoTrilhaResult.rows[0];

          // Se todas as aulas foram concluídas, criar gamificação
          if (
            parseInt(total_aulas) > 0 &&
            parseInt(aulas_concluidas) === parseInt(total_aulas)
          ) {
            // Buscar o nome da trilha
            const nomeTrilhaResult = await pool.query(
              "SELECT nome_trilha FROM TrilhasEstudo WHERE id_trilha = $1",
              [id_trilha]
            );

            if (nomeTrilhaResult.rows.length > 0) {
              const nome_trilha = nomeTrilhaResult.rows[0].nome_trilha;

              // Criar tipo de recompensa customizado: emoji de estrela + "mestre em (nome_trilha)"
              const tipo_recompensa = `⭐ Mestre em ${nome_trilha}`;

              // Verificar se já existe uma gamificação para esta trilha
              const gamificacaoExistente = await pool.query(
                `SELECT * FROM Gamificacao 
                 WHERE id_aluno = $1 
                 AND tipo_recompensa = $2`,
                [id_aluno, tipo_recompensa]
              );

              // Se não existir, criar a gamificação
              if (gamificacaoExistente.rows.length === 0) {
                await pool.query(
                  `INSERT INTO Gamificacao (id_aluno, tipo_recompensa, valor_recompensa, data_conquista)
                   VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                  [id_aluno, tipo_recompensa, 100]
                );
                console.log(
                  `Badge criado para trilha "${nome_trilha}" (ID: ${id_trilha}, tipo: ${tipo_recompensa}) para aluno ${id_aluno}`
                );
              }
            }
          }
        }
      } catch (gamificacaoError) {
        // Log do erro mas não falha a requisição principal
        console.error("Erro ao verificar/criar gamificação:", gamificacaoError);
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving progresso:", error);
    res.status(500).json({ error: "Erro ao salvar progresso" });
  }
});

// Get recent aulas for a user
router.get(
  "/aluno/:idAluno/recentes",
  verifyToken,
  async (req: AuthRequest, res) => {
    try {
      const { idAluno } = req.params;
      const result = await pool.query(
        `SELECT p.*, a.titulo_aula, a.duracao, a.id_trilha, t.nome_trilha
       FROM ProgressoAlunos p
       JOIN Aulas a ON p.id_aula = a.id_aula
       JOIN TrilhasEstudo t ON a.id_trilha = t.id_trilha
       WHERE p.id_aluno = $1
       ORDER BY p.data_ultimo_acesso DESC
       LIMIT 5`,
        [idAluno]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching recent aulas:", error);
      res.status(500).json({ error: "Erro ao buscar aulas recentes" });
    }
  }
);

// Get progress by subject/tema
router.get(
  "/aluno/:idAluno/por-tema",
  verifyToken,
  async (req: AuthRequest, res) => {
    try {
      const { idAluno } = req.params;
      const result = await pool.query(
        `SELECT 
        a.tema_aula,
        COUNT(DISTINCT a.id_aula) as total_aulas,
        COUNT(DISTINCT CASE WHEN p.status_aula = 'concluida' THEN a.id_aula END) as aulas_concluidas,
        COALESCE(AVG(CASE WHEN p.status_aula = 'concluida' THEN p.porcentagem_conclusao END), 0) as progresso_medio
       FROM Aulas a
       LEFT JOIN ProgressoAlunos p ON a.id_aula = p.id_aula AND p.id_aluno = $1
       WHERE a.tema_aula IS NOT NULL
       GROUP BY a.tema_aula
       ORDER BY a.tema_aula`,
        [idAluno]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching progress by theme:", error);
      res.status(500).json({ error: "Erro ao buscar progresso por tema" });
    }
  }
);

export default router;
