
# 3. Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="2-Planejamento-Projeto.md"> Planejamento do Projeto do Software (Cronograma) </a></span>

> Nesta seção, você vai detalhar os requisitos do seu sistema e as restrições do projeto, organizando as funcionalidades e características que a solução deve ter.

---

## 3.1 Requisitos Funcionais

Preencha o Quadro abaixo com os requisitos funcionais que **detalham as funcionalidades que seu sistema deverá oferecer**.  
Cada requisito deve representar uma característica única da solução e ser claro para orientar o desenvolvimento.


|ID     | Descrição do Requisito                                                                                            | Prioridade |
|-------|-----------------------------------------------------------------------------------------------------------------|------------|
|RF-01  | O sistema deve permitir que o aluno crie uma conta para acessar as aulas e funcionalidades.                       | ALTA       | 
|RF-02  | O sistema deve permitir que o usuário faça login e logout de forma segura.                                        | MÉDIA      |
|RF-03  | O sistema deve disponibilizar trilhas de estudo organizadas por temas e níveis.                                   | ALTA       |
|RF-04  | O sistema deve permitir que o aluno assista às vídeo aulas online.                                                | MÉDIA      |
|RF-05  | O sistema deve fornecer feedback imediato após a realização dos exercícios.                                       | BAIXA      |
|RF-06  | O sistema deve permitir acesso via diferentes dispositivos (computador, tablet, smartphone).                      | BAIXA      |
|RF-07  | O sistema deve permitir que o aluno revise conteúdos já assistidos                                                | MÉDIA      |
|RF-08  | O sistema deve incluir elementos gamificados (como pontos, badges ou níveis) para motivar o aluno.                | BAIXA      |
|RF-09  | O sistema deve acompanhar o progresso do aluno em cada trilha de estudo.                                          | ALTA       |
|RF-10  | O sistema deve disponibilizar exercícios em tempo real para o aluno praticar após cada aula.                      | BAIXA      |

---

## 3.2 Histórias de Usuário

> Cada história de usuário deve ser escrita no formato:  
>  
> **Como [persona], eu quero [funcionalidade], para que [benefício/motivo].**  seguindo o modelo e conceitos ensinados na disciplina de       
> Engenharia de Requisitos.   
---
⚠️ **ATENÇÃO:** Escreva de forma que cada história de usuário esteja associada a um requisito funcional específico para facilitar o acompanhamento e validação. Por exemplo:

> **História 1 (relacionada ao Requisito RF-001):**  
> Como usuário, quero registrar minhas tarefas para não esquecer de fazê-las.  
>  
> **História 2 (relacionada ao Requisito RF-002):**  
> Como administrador, quero alterar permissões para controlar o acesso ao sistema.  
>  
> Para melhor organização, as histórias podem ser agrupadas por contexto ou módulo funcional.

---

### ✏️ Escreva aqui as histórias de usuário do seu projeto:

<div style="border: 2px dashed #999999; padding: 15px; margin: 10px 0;">
  
<!-- Espaço para escrever o texto -->  
<b>Módulo: Cadastro e Autenticação</b><br><br>

- <b>História 1 (relacionada ao Requisito RF01):</b><br>
Como estudante, quero me cadastrar na plataforma, para que eu possa acessar as vídeo aulas e outras funcionalidades.<br><br>

- <b>História 2 (relacionada ao Requisito RF02):</b><br>
Como aluno, quero fazer login e logout de forma segura, para proteger meus dados pessoais e progresso.<br><br>

- <b>História 3 (relacionada ao Requisito RF12):</b><br>
Como usuário, quero recuperar minha senha caso a esqueça, para continuar acessando minha conta sem dificuldades.<br><br>

<b>Módulo: Trilhas de Estudo e Conteúdo</b><br><br>

- <b>História 4 (relacionada ao Requisito RF03):</b><br>
Como estudante, quero navegar por trilhas de estudo organizadas por temas e níveis, para estudar de forma estruturada conforme minha necessidade.<br><br>

- <b>História 5 (relacionada ao Requisito RF04):</b><br>
Como aluno, quero assistir vídeo aulas online, para aprender de maneira acessível e flexível.<br><br>

- <b>História 6 (relacionada ao Requisito RF08):</b><br>
Como estudante, quero revisar conteúdos já assistidos, para reforçar o aprendizado antes das provas.<br><br>

<b>Módulo: Exercícios e Prática</b><br><br>

- <b>História 7 (relacionada ao Requisito RF05):</b><br>
Como aluno, quero realizar exercícios interativos em tempo real, para praticar e fixar o conteúdo aprendido.<br><br>

- <b>História 8 (relacionada ao Requisito RF10):</b><br>
Como estudante, quero receber feedback imediato após os exercícios, para entender meus erros e melhorar rapidamente.<br><br>

<b>Módulo: Progresso e Gamificação</b><br><br>

- <b>História 9 (relacionada ao Requisito RF06):</b><br>
Como aluno, quero acompanhar meu progresso nas trilhas de estudo, para saber o quanto já avancei e o que ainda preciso estudar.<br><br>

- <b>História 10 (relacionada ao Requisito RF07):</b><br>
Como estudante, quero ganhar pontos e badges ao completar atividades, para me sentir motivado a continuar estudando.<br><br>

<b>Módulo: Usabilidade e Acessibilidade</b><br><br>

- <b>História 11 (relacionada ao Requisito RF09):</b><br>
Como aluno, quero acessar a plataforma por diferentes dispositivos, como celular, tablet ou computador, para estudar onde e quando quiser.<br><br>

- <b>História 12 (relacionada ao Requisito RF11):</b><br>
Como estudante, quero pesquisar e filtrar aulas por tema e nível, para encontrar rapidamente o conteúdo que desejo estudar.<br><br>

</div>

---

## 3.3 Requisitos Não Funcionais

Preencha o Quadro abaixo com os requisitos não funcionais que definem **características desejadas para o sistema que irão desenvolver**, como desempenho, segurança, usabilidade, etc.  
> Lembre-se que esses requisitos são importantes para garantir a qualidade da solução.

|ID     | Descrição do Requisito                                                                              |Prioridade |
|-------|-----------------------------------------------------------------------------------------------------|-----------|
|RNF-01 | O sistema deve carregar as páginas em até 3 segundos para garantir uma boa experiência ao usuário.  | MÉDIA     | 
|RNF-02 | O sistema deve proteger as informações dos clientes por meio de criptografia e medidas de segurança.| ALTA      | 
|RNF-03 | A plataforma deve estar disponível 99,5% do tempo para garantir o acesso constante dos alunos.      | ALTA      |
|RNF-04 | A interface do sistema deve ser intuitiva e acessível para usuários de diferentes faixas etárias.   | ALTA      |
|RNF-05 | O sistema deve suportar o acesso simultâneo de pelo menos 10.000 usuários                           | MÉDIA     |
          sem perda significativa de desempenho.                                      
|RNF-06 | O sistema deve ser compatível com os principais navegadores web e dispositivos móveis.              | ALTA      |

---

## 3.4 Restrições do Projeto

> Restrições são limitações externas impostas ao projeto que devem ser rigorosamente obedecidas durante o desenvolvimento. Elas podem estar relacionadas a prazos, tecnologias obrigatórias ou proibidas, ambiente de execução, normas legais ou políticas internas da organização. Diferente dos requisitos não funcionais, que indicam características desejadas do sistema, as restrições determinam limites fixos que influenciam as decisões de projeto.

O Quadro abaixo deve ser preenchida com as restrições específicas que **impactam seu projeto**. Caso não haja alguma restrição adicional além das já listadas, mantenha a tabela conforme está.

| ID  | Restrição                                                              |
|------|-----------------------------------------------------------------------|
| R-01   | O projeto deverá ser entregue até o final do semestre letivo 2025/2. |
| R-02   | O sistema deve ser acessível via internet para permitir uso em qualquer localização. |
| R-03   | O software deve ser compatível com Windows, Linux, Android e iOS.   |
| R-04   | A plataforma deve atender às normas de acessibilidade para pessoas com deficiência (WCAG 2.1). |
| R-05   | O uso de tecnologias web modernas (React para frontend e Node.js para backend) deve ser respeitado. |
| R-06   | O sistema deve garantir backups automáticos diários dos dados dos usuários e progresso acadêmico. |
| R-07   | A plataforma deve funcionar adequadamente em dispositivos com conexão de internet limitada (3G/4G). |
| R-08   | O conteúdo das vídeo aulas deve respeitar direitos autorais e licenças de uso educacional. |

---
## 3.5 Regras de Negócio

> Regras de Negócio definem as condições e políticas que o sistema deve seguir para garantir o correto funcionamento alinhado ao negócio.  
>  
> Elas indicam **quando** e **como** certas ações devem ocorrer, usando o padrão:  
>  
> **Se (condição) for verdadeira, então (ação) deve ser tomada.**  
>  
> Exemplo:  
> - "Um usuário só poderá finalizar um cadastro se todos os dados forem inseridos e validados com sucesso."  
>  
> Também pode ser escrito assim (if/then):  
> - "Se o usuário tem saldo acima de X, então a opção de empréstimo estará liberada."

---

 A tabela abaixo deve ser preenchida com as regras de negócio que **impactam seu projeto**. Os textos no quadro são apenas ilustrativos.

|ID    | Regra de Negócio                                                                              |
|-------|-------------------------------------------------------------------------------------------   |
|RN-01 | O aluno só pode acessar conteúdos da trilha correspondente ao seu nível cadastrado (fundamental ou médio). |
|RN-02 | O sistema deve liberar exercícios somente após o aluno assistir pelo menos 80% da vídeo aula correspondente. |
|RN-03 | O aluno deve completar pelo menos 70% dos exercícios de uma aula para desbloquear a próxima aula da trilha. |
|RN-04 | O aluno só pode fazer a recuperação de senha mediante confirmação via e-mail cadastrado no sistema. |
|RN-05 | O progresso do aluno só é atualizado após o término completo da aula ou exercício, com confirmação de salvamento. |
|RN-06 | Pontos e badges só são concedidos quando o aluno atinge pelo menos 60% de acerto nos exercícios. |
|RN-07 | O sistema deve permitir apenas um cadastro por e-mail para evitar contas duplicadas. |
|RN-08 | Vídeo aulas devem ter duração máxima de 15 minutos para otimizar o aprendizado e manter o foco do aluno. |
|RN-09 | O aluno pode assistir às aulas quantas vezes quiser, mas o progresso é contabilizado apenas na primeira visualização completa. |
|RN-10 | O sistema deve bloquear temporariamente (24h) contas com mais de 5 tentativas de login incorretas consecutivas. |

💡 **Dica:** Explique sempre o motivo ou impacto da regra no sistema.

---
> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
