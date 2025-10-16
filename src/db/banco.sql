CREATE TABLE Usuarios (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME
);

CREATE TABLE Alunos (
    id_aluno INT NOT NULL PRIMARY KEY,
    nivel_ensino ENUM('fundamental', 'medio') NOT NULL,
    pontuacao_total INT DEFAULT 0,
    FOREIGN KEY (id_aluno) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE TrilhasEstudo (
    id_trilha INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_trilha VARCHAR(100) NOT NULL UNIQUE,
    descricao_trilha TEXT,
    nivel_trilha ENUM('fundamental', 'medio') NOT NULL
);

CREATE TABLE Aulas (
    id_aula INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_trilha INT NOT NULL,
    titulo_aula VARCHAR(255) NOT NULL,
    descricao_aula TEXT,
    url_video VARCHAR(255) NOT NULL,
    duracao INT NOT NULL,
    tema_aula VARCHAR(100),
    nivel_aula ENUM('fundamental', 'medio') NOT NULL,
    FOREIGN KEY (id_trilha) REFERENCES TrilhasEstudo(id_trilha) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE Exercicios (
    id_exercicio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_aula INT NOT NULL,
    titulo_exercicio VARCHAR(255) NOT NULL,
    descricao_exercicio TEXT,
    tipo_exercicio ENUM('multipla_escolha', 'verdadeiro_falso', 'aberta') NOT NULL,
    respostas_corretas JSON NOT NULL,
    FOREIGN KEY (id_aula) REFERENCES Aulas(id_aula) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ProgressoAlunos (
    id_progresso INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_aula INT NOT NULL,
    status_aula ENUM('iniciada', 'concluida', 'pendente') NOT NULL,
    porcentagem_conclusao DECIMAL(5,2) DEFAULT 0.00,
    data_ultimo_acesso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_aula) REFERENCES Aulas(id_aula) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (id_aluno, id_aula)
);

CREATE TABLE Gamificacao (
    id_gamificacao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    tipo_recompensa VARCHAR(50) NOT NULL,
    valor_recompensa VARCHAR(255) NOT NULL,
    data_conquista DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_aluno) REFERENCES Alunos(id_aluno) ON DELETE CASCADE ON UPDATE CASCADE
);
