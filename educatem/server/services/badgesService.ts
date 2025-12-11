import pool from "../db.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Badge {
  id: string;
  nome: string;
  descricao: string;
  tipo_recompensa: string;
  valor_recompensa: string;
  categoria: string;
  icone: string;
  condicao: {
    tipo: string;
    valor: number | string | boolean;
  };
}

interface UserStats {
  trilhasConcluidas: number;
  tempoEstudo: number;
  materiasCompletas: string[];
  niveisCompletos: string[];
  diasConsecutivos: number;
  totalTrilhas: number;
}

function loadBadges(): Badge[] {
  try {
    const badgesPath = join(__dirname, "..", "data", "badges.json");
    const badgesContent = readFileSync(badgesPath, "utf-8");
    const badges = JSON.parse(badgesContent);
    return badges.badges || [];
  } catch (error) {
    console.error("Erro ao carregar badges:", error);
    return [];
  }
}

async function isTrilhaConcluida(
  idAluno: number,
  idTrilha: number
): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT a.id_aula) as total_aulas,
        COUNT(DISTINCT CASE WHEN p.status_aula = 'concluida' THEN a.id_aula END) as aulas_concluidas
       FROM Aulas a
       LEFT JOIN ProgressoAlunos p ON a.id_aula = p.id_aula AND p.id_aluno = $1
       WHERE a.id_trilha = $2`,
      [idAluno, idTrilha]
    );

    if (result.rows.length === 0) {
      return false;
    }

    const { total_aulas, aulas_concluidas } = result.rows[0];
    return (
      parseInt(total_aulas) > 0 &&
      parseInt(aulas_concluidas) === parseInt(total_aulas)
    );
  } catch (error) {
    console.error("Erro ao verificar conclusão de trilha:", error);
    return false;
  }
}

async function getUserStats(idAluno: number): Promise<UserStats> {
  try {
    const trilhasResult = await pool.query(
      `SELECT 
        t.id_trilha,
        COUNT(DISTINCT a.id_aula) as total_aulas,
        COUNT(DISTINCT CASE WHEN p.status_aula = 'concluida' THEN a.id_aula END) as aulas_concluidas,
        MAX(a.tema_aula) as tema_aula,
        MAX(a.nivel_aula) as nivel_aula
       FROM TrilhasEstudo t
       LEFT JOIN Aulas a ON t.id_trilha = a.id_trilha
       LEFT JOIN ProgressoAlunos p ON a.id_aula = p.id_aula AND p.id_aluno = $1
       GROUP BY t.id_trilha`,
      [idAluno]
    );

    let trilhasConcluidas = 0;
    const materiasCompletas: string[] = [];
    const niveisCompletos: string[] = [];
    const materiasTrilhas: {
      [key: string]: { total: number; concluidas: number };
    } = {};
    const niveisTrilhas: {
      [key: string]: { total: number; concluidas: number };
    } = {};

    for (const row of trilhasResult.rows) {
      const totalAulas = parseInt(row.total_aulas) || 0;
      const aulasConcluidas = parseInt(row.aulas_concluidas) || 0;
      const tema = row.tema_aula;
      const nivel = row.nivel_aula;
      const trilhaConcluida = totalAulas > 0 && aulasConcluidas === totalAulas;

      if (trilhaConcluida) {
        trilhasConcluidas++;
      }

      if (tema) {
        if (!materiasTrilhas[tema]) {
          materiasTrilhas[tema] = { total: 0, concluidas: 0 };
        }
        materiasTrilhas[tema].total++;
        if (trilhaConcluida) {
          materiasTrilhas[tema].concluidas++;
        }
      }

      if (nivel) {
        if (!niveisTrilhas[nivel]) {
          niveisTrilhas[nivel] = { total: 0, concluidas: 0 };
        }
        niveisTrilhas[nivel].total++;
        if (trilhaConcluida) {
          niveisTrilhas[nivel].concluidas++;
        }
      }
    }

    for (const [materia, stats] of Object.entries(materiasTrilhas)) {
      if (stats.total > 0 && stats.concluidas === stats.total) {
        materiasCompletas.push(materia);
      }
    }

    for (const [nivel, stats] of Object.entries(niveisTrilhas)) {
      if (stats.total > 0 && stats.concluidas === stats.total) {
        niveisCompletos.push(nivel);
      }
    }

    const tempoResult = await pool.query(
      `SELECT COALESCE(SUM(a.duracao), 0) as total_minutos
       FROM ProgressoAlunos p
       JOIN Aulas a ON p.id_aula = a.id_aula
       WHERE p.id_aluno = $1 AND p.status_aula = 'concluida'`,
      [idAluno]
    );
    const tempoEstudo = parseInt(tempoResult.rows[0]?.total_minutos || "0");

    const totalTrilhasResult = await pool.query(
      "SELECT COUNT(*) as total FROM TrilhasEstudo"
    );
    const totalTrilhas = parseInt(totalTrilhasResult.rows[0]?.total || "0");

    const diasConsecutivos = 0;

    return {
      trilhasConcluidas,
      tempoEstudo,
      materiasCompletas,
      niveisCompletos,
      diasConsecutivos,
      totalTrilhas,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas do usuário:", error);
    return {
      trilhasConcluidas: 0,
      tempoEstudo: 0,
      materiasCompletas: [],
      niveisCompletos: [],
      diasConsecutivos: 0,
      totalTrilhas: 0,
    };
  }
}

async function badgeJaAtribuida(
  idAluno: number,
  badge: Badge
): Promise<boolean> {
  try {
    const checkResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM Gamificacao 
       WHERE id_aluno = $1 
       AND tipo_recompensa = $2 
       AND valor_recompensa = $3`,
      [idAluno, badge.tipo_recompensa, badge.valor_recompensa]
    );

    return parseInt(checkResult.rows[0]?.count || "0") > 0;
  } catch (error) {
    console.error("Erro ao verificar badge atribuída:", error);
    return false;
  }
}

async function atribuirBadge(idAluno: number, badge: Badge): Promise<boolean> {
  try {
    const jaAtribuida = await badgeJaAtribuida(idAluno, badge);
    if (jaAtribuida) {
      return false;
    }

    await pool.query(
      `INSERT INTO Gamificacao (id_aluno, tipo_recompensa, valor_recompensa, data_conquista)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [idAluno, badge.tipo_recompensa, badge.valor_recompensa]
    );

    console.log(`✅ Badge "${badge.nome}" atribuída ao aluno ${idAluno}`);
    return true;
  } catch (error) {
    console.error(`Erro ao atribuir badge ${badge.id}:`, error);
    return false;
  }
}

function verificarCondicaoBadge(badge: Badge, stats: UserStats): boolean {
  const { tipo, valor } = badge.condicao;

  switch (tipo) {
    case "trilhas_concluidas":
      return stats.trilhasConcluidas >= (valor as number);

    case "tempo_estudo":
      return stats.tempoEstudo >= (valor as number);

    case "materia_completa":
      return stats.materiasCompletas.includes(valor as string);

    case "nivel_completo":
      return stats.niveisCompletos.includes(valor as string);

    case "dias_consecutivos":
      return stats.diasConsecutivos >= (valor as number);

    case "todas_trilhas":
      return (
        valor === true &&
        stats.trilhasConcluidas > 0 &&
        stats.trilhasConcluidas === stats.totalTrilhas
      );

    case "trilha_especifica":
      // Esta condição é verificada diretamente em verificarBadgesTrilhaConcluida
      return false;

    default:
      return false;
  }
}

export async function verificarBadgesTrilhaConcluida(
  idAluno: number,
  idTrilha: number
): Promise<void> {
  try {
    const trilhaConcluida = await isTrilhaConcluida(idAluno, idTrilha);
    if (!trilhaConcluida) {
      return;
    }

    const stats = await getUserStats(idAluno);

    const badges = loadBadges();

    for (const badge of badges) {
      // Verificar badges específicas da trilha primeiro
      if (badge.condicao.tipo === "trilha_especifica") {
        if (badge.condicao.valor === idTrilha) {
          await atribuirBadge(idAluno, badge);
        }
      } else {
        // Verificar outras condições de badges
        const condicaoSatisfeita = verificarCondicaoBadge(badge, stats);
        if (condicaoSatisfeita) {
          await atribuirBadge(idAluno, badge);
        }
      }
    }
  } catch (error) {
    console.error("Erro ao verificar badges:", error);
  }
}

export async function verificarBadgesUsuario(idAluno: number): Promise<void> {
  try {
    const stats = await getUserStats(idAluno);
    const badges = loadBadges();

    for (const badge of badges) {
      const condicaoSatisfeita = verificarCondicaoBadge(badge, stats);
      if (condicaoSatisfeita) {
        await atribuirBadge(idAluno, badge);
      }
    }
  } catch (error) {
    console.error("Erro ao verificar badges do usuário:", error);
  }
}
