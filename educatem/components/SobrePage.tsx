import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Users, Target, Award, GraduationCap, Heart, Globe, TrendingUp } from "lucide-react";

interface SobrePageProps {
  onNavigate: (page: string, courseId?: number, materia?: string) => void;
  isLoggedIn: boolean;
}

export function SobrePage({ onNavigate, isLoggedIn }: SobrePageProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">Sobre o EducaTem</h1>
        <p className="text-xl text-muted-foreground">
          Bem-vindo ao EducaTem! Somos uma plataforma educacional online criada para transformar a forma 
          como você aprende. Oferecemos uma experiência completa de estudo com vídeo aulas, exercícios 
          práticos e ferramentas que tornam o aprendizado mais divertido e eficaz.
        </p>
      </div>

      {/* Problema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-500" />
            Nossa Missão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sabemos que estudar pode ser desafiador, especialmente quando você precisa revisar conteúdos 
            em casa. Muitas vezes, as opções disponíveis são limitadas ou não se encaixam no seu estilo 
            de aprendizado. Por isso, criamos o EducaTem com o propósito de oferecer uma alternativa 
            completa e gratuita para quem quer aprender de verdade.
          </p>
          <p className="text-muted-foreground">
            Acreditamos que todo mundo merece ter acesso a uma educação de qualidade, independentemente 
            de onde esteja ou de suas condições financeiras. Nossa plataforma foi pensada para ser 
            simples de usar, mas poderosa em recursos, ajudando estudantes a alcançarem seus objetivos 
            acadêmicos de forma mais eficiente e prazerosa.
          </p>
        </CardContent>
      </Card>

      {/* Objetivos */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Nossos Objetivos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Objetivo Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Criar um ambiente digital completo onde estudantes possam aprender de forma autônoma, 
                com conteúdos de qualidade que cobrem as principais disciplinas do ensino fundamental e médio. 
                Queremos democratizar o acesso à educação e tornar o aprendizado algo prazeroso e acessível 
                para todos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Objetivos Específicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-muted-foreground">
                  Disponibilizar aulas em vídeo de alta qualidade, categorizadas por disciplina e série, 
                  para que você encontre exatamente o que precisa estudar de forma rápida e intuitiva
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-muted-foreground">
                  Oferecer ferramentas interativas como exercícios práticos, sistema de gamificação com 
                  conquistas e badges, além de relatórios detalhados do seu progresso ao longo do tempo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Justificativa */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Por que escolher o EducaTem?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            O EducaTem nasceu da necessidade de oferecer uma solução educacional que realmente funcione. 
            Entendemos que cada estudante tem seu próprio ritmo e estilo de aprendizado, e por isso 
            desenvolvemos uma plataforma flexível que se adapta às suas necessidades.
          </p>
          <p className="text-muted-foreground">
            Com o crescimento do ensino à distância e a busca por alternativas de estudo complementar, 
            criamos uma ferramenta que combina o melhor dos dois mundos: a qualidade de conteúdo estruturado 
            com a liberdade de estudar quando e onde quiser. Aqui você encontra:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-background">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Acesso Universal</h3>
              <p className="text-sm text-muted-foreground">Estude de qualquer dispositivo, a qualquer hora</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <h3 className="font-semibold mb-1">Estude no Seu Tempo</h3>
              <p className="text-sm text-muted-foreground">Pause, retome e revise quando precisar</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1">Aprendizado Divertido</h3>
              <p className="text-sm text-muted-foreground">Ganhe badges e acompanhe sua evolução</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Público-Alvo */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Público-Alvo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Estudantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Jovens estudantes que querem melhorar suas notas, revisar conteúdos ou se preparar para 
                provas importantes. Se você está no ensino fundamental ou médio e busca uma forma eficaz 
                de estudar, este é o seu lugar!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Educadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Professores e educadores que desejam indicar materiais de apoio para seus alunos ou 
                encontrar recursos didáticos complementares para enriquecer suas aulas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Famílias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pais, mães e responsáveis que querem acompanhar o desenvolvimento educacional de seus 
                filhos e oferecer suporte no processo de aprendizado em casa.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Características */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">O que nos torna especiais</CardTitle>
          <CardDescription className="text-center">
            Recursos pensados para tornar seu aprendizado mais eficiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="rounded-full bg-blue-100 p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiplataforma</h3>
              <p className="text-sm text-muted-foreground">
                Funciona perfeitamente no computador, tablet ou celular
              </p>
            </div>
            <div className="text-center p-4">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Conteúdo Estruturado</h3>
              <p className="text-sm text-muted-foreground">
                Aulas organizadas em trilhas de aprendizado progressivo
              </p>
            </div>
            <div className="text-center p-4">
              <div className="rounded-full bg-purple-100 p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Gamificação</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de conquistas e badges para manter você motivado
              </p>
            </div>
            <div className="text-center p-4">
              <div className="rounded-full bg-yellow-100 p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Gratuito</h3>
              <p className="text-sm text-muted-foreground">
                Todos os recursos disponíveis sem nenhum custo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="text-center bg-primary/5">
        <CardHeader>
          <CardTitle>Vamos começar juntos essa jornada?</CardTitle>
          <CardDescription>
            Descubra nossas trilhas de conhecimento e dê o primeiro passo rumo ao seu sucesso acadêmico!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate("trilhas")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Explorar Trilhas
            </Button>
            {!isLoggedIn && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate("login")}
              >
                Criar Conta Gratuita
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

