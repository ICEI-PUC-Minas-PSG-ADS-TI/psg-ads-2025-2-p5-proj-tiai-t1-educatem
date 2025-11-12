const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: text || 'Erro desconhecido' };
        }
      }

      if (!response.ok) {
        return { error: data.error || 'Erro na requisição' };
      }

      return { data };
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return { error: 'Servidor backend não está rodando. Execute "npm run dev:all" ou "npm run dev:server" em um terminal separado.' };
      }
      return { error: 'Erro de conexão com o servidor' };
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, senha: password }),
      }
    );

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(name: string, email: string, password: string, nivelEnsino: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
          nivel_ensino: nivelEnsino,
        }),
      }
    );

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Trilhas
  async getTrilhas(nivel?: string) {
    const query = nivel ? `?nivel=${nivel}` : '';
    return this.request(`/trilhas${query}`);
  }

  async getTrilha(id: number) {
    return this.request(`/trilhas/${id}`);
  }

  async getAulasByTrilha(trilhaId: number) {
    return this.request(`/trilhas/${trilhaId}/aulas`);
  }

  async getTrilhasComProgresso(idAluno: number) {
    return this.request(`/trilhas/aluno/${idAluno}/com-progresso`);
  }

  async getTrilhasPorTema(tema: string) {
    return this.request(`/trilhas/por-tema/${encodeURIComponent(tema)}`);
  }

  // Aulas
  async getAulas(nivel?: string, trilhaId?: number) {
    const params = new URLSearchParams();
    if (nivel) params.append('nivel', nivel);
    if (trilhaId) params.append('trilha', trilhaId.toString());
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/aulas${query}`);
  }

  async getAula(id: number) {
    return this.request(`/aulas/${id}`);
  }

  async getExerciciosByAula(aulaId: number) {
    return this.request(`/aulas/${aulaId}/exercicios`);
  }

  // Progresso
  async getProgresso(idAluno: number) {
    return this.request(`/progresso/aluno/${idAluno}`);
  }

  async getProgressoAula(idAluno: number, idAula: number) {
    return this.request(`/progresso/aluno/${idAluno}/aula/${idAula}`);
  }

  async saveProgresso(
    idAluno: number,
    idAula: number,
    statusAula: string,
    porcentagemConclusao: number
  ) {
    return this.request('/progresso', {
      method: 'POST',
      body: JSON.stringify({
        id_aluno: idAluno,
        id_aula: idAula,
        status_aula: statusAula,
        porcentagem_conclusao: porcentagemConclusao,
      }),
    });
  }

  // Usuários
  async getUsuario(id: number) {
    return this.request(`/usuarios/${id}`);
  }

  // Gamificação
  async getGamificacao(idAluno: number) {
    return this.request(`/gamificacao/aluno/${idAluno}`);
  }

  async createGamificacao(idAluno: number, tipoRecompensa: string, valorRecompensa: string) {
    return this.request('/gamificacao', {
      method: 'POST',
      body: JSON.stringify({
        id_aluno: idAluno,
        tipo_recompensa: tipoRecompensa,
        valor_recompensa: valorRecompensa,
      }),
    });
  }

  async getEstatisticas(idAluno: number) {
    return this.request(`/gamificacao/aluno/${idAluno}/estatisticas`);
  }

  // Progresso adicional
  async getAulasRecentes(idAluno: number) {
    return this.request(`/progresso/aluno/${idAluno}/recentes`);
  }

  async getProgressoPorTema(idAluno: number) {
    return this.request(`/progresso/aluno/${idAluno}/por-tema`);
  }
}

export const api = new ApiClient(API_URL);

