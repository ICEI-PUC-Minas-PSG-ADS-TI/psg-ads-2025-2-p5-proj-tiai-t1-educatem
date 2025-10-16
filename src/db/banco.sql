CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMPTZ
);

CREATE TABLE Alunos (
    id_aluno INT PRIMARY KEY,
    nivel_ensino VARCHAR(50) NOT NULL,
    pontuacao_total INT DEFAULT 0,
    CONSTRAINT fk_aluno_usuario FOREIGN KEY (id_aluno) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_nivel_ensino CHECK (nivel_ensino IN ('fundamental', 'medio'))
);

CREATE TABLE TrilhasEstudo (
    id_trilha SERIAL PRIMARY KEY,
    nome_trilha VARCHAR(100) NOT NULL UNIQUE,
    descricao_trilha TEXT,
    nivel_trilha VARCHAR(50) NOT NULL,
    CONSTRAINT chk_nivel_trilha CHECK (nivel_trilha IN ('fundamental', 'medio'))
);

CREATE TABLE Aulas (
    id_aula SERIAL PRIMARY KEY,
    id_trilha INT NOT NULL,
    titulo_aula VARCHAR(255) NOT NULL,
    descricao_aula TEXT,
    url_video VARCHAR(255) NOT NULL,
    duracao INT NOT NULL,
    tema_aula VARCHAR(100),
    nivel_aula VARCHAR(50) NOT NULL,
    CONSTRAINT fk_aula_trilha FOREIGN KEY (id_trilha) REFERENCES TrilhasEstudo(id_trilha) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_nivel_aula CHECK (nivel_aula IN ('fundamental', 'medio'))
);

CREATE TABLE Exercicios (
    id_exercicio SERIAL PRIMARY KEY,
    id_aula INT NOT NULL,
    titulo_exercicio VARCHAR(255) NOT NULL,
    descricao_exercicio TEXT,
    tipo_exercicio VARCHAR(50) NOT NULL,
    respostas_corretas JSONB NOT NULL,
    CONSTRAINT fk_exercicio_aula FOREIGN KEY (id_aula) REFERENCES Aulas(id_aula) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_tipo_exercicio CHECK (tipo_exercicio IN ('multipla_escolha', 'verdadeiro_falso', 'aberta'))
);

CREATE TABLE ProgressoAlunos (
    id_progresso SERIAL PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_aula INT NOT NULL,
    status_aula VARCHAR(50) NOT NULL,
    porcentagem_conclusao DECIMAL(5,2) DEFAULT 0.00,
    data_ultimo_acesso TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progresso_aluno FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_progresso_aula FOREIGN KEY (id_aula) REFERENCES Aulas(id_aula) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (id_aluno, id_aula),
    CONSTRAINT chk_status_aula CHECK (status_aula IN ('iniciada', 'concluida', 'pendente'))
);

CREATE TABLE Gamificacao (
    id_gamificacao SERIAL PRIMARY KEY,
    id_aluno INT NOT NULL,
    tipo_recompensa VARCHAR(50) NOT NULL,
    valor_recompensa VARCHAR(255) NOT NULL,
    data_conquista TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gamificacao_aluno FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno) ON DELETE CASCADE ON UPDATE CASCADE
);
