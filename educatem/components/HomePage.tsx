import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { BookOpen, Play, Trophy, Clock } from "lucide-react";
import { api } from "../src/lib/api";

interface HomePageProps {
  isLoggedIn: boolean;
  userName?: string;
  onNavigate: (page: string) => void;
  userId?: number | null;
}

interface AulaRecente {
  titulo_aula: string;
  duracao: number;
  nome_trilha: string;
  status_aula: string;
}

interface ProgressoTema {
  tema_aula: string;
  total_aulas: number;
  aulas_concluidas: number;
  progresso_medio: number;
}

export function HomePage({
  isLoggedIn,
  userName,
  onNavigate,
  userId,
}: HomePageProps) {
  const [aulasRecentes, setAulasRecentes] = useState<AulaRecente[]>([]);
  const [progressoTemas, setProgressoTemas] = useState<ProgressoTema[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userId) {
      loadUserData();
    }
  }, [isLoggedIn, userId]);

  const loadUserData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Carregar aulas recentes
      const recentesResponse = await api.getAulasRecentes(userId);
      if (recentesResponse.data) {
        setAulasRecentes(recentesResponse.data);
      }

      // Carregar progresso por tema
      const temasResponse = await api.getProgressoPorTema(userId);
      if (temasResponse.data) {
        setProgressoTemas(temasResponse.data);
      }

      // Carregar badges
      const badgesResponse = await api.getGamificacao(userId);
      if (badgesResponse.data) {
        setBadges(badgesResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const subjects = [
    {
      name: "Matemática",
      courses: 45,
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Português",
      courses: 38,
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Ciências",
      courses: 32,
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "História",
      courses: 28,
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Geografia",
      courses: 25,
      color: "bg-teal-100 text-teal-800",
    },
    {
      name: "Artes",
      courses: 20,
      color: "bg-pink-100 text-pink-800",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header da página */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl">
          {isLoggedIn
            ? `Olá, ${userName}!`
            : "Bem-vindo ao EducaTem"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isLoggedIn
            ? "Continue seus estudos e descubra novos conteúdos incríveis!"
            : "A plataforma de estudos mais divertida para o ensino fundamental. Aprenda com vídeos, exercícios e conquiste badges!"}
        </p>
      </div>

      {/* Área do usuário logado */}
      {isLoggedIn && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Meu Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Carregando...
                </div>
              ) : progressoTemas.length > 0 ? (
                progressoTemas.slice(0, 3).map((tema) => {
                  const progress = tema.total_aulas > 0
                    ? Math.round((tema.aulas_concluidas / tema.total_aulas) * 100)
                    : 0;
                  return (
                    <div key={tema.tema_aula} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{tema.tema_aula}</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum progresso ainda
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Continuar Assistindo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Carregando...
                </div>
              ) : aulasRecentes.length > 0 ? (
                aulasRecentes.map((aula, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div>
                      <p className="text-sm">{aula.titulo_aula}</p>
                      <p className="text-xs text-muted-foreground">
                        {aula.nome_trilha}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('trilhas')}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma aula recente
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Carregando...
                </div>
              ) : badges.length > 0 ? (
                badges.slice(0, 4).map((badge) => (
                  <Badge key={badge.id_gamificacao} variant="secondary">
                    {badge.tipo_recompensa}
                  </Badge>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma conquista ainda
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Matérias disponíveis */}
      <div>
        <h2 className="mb-6">Escolha uma matéria para estudar</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate("trilhas")}
            >
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver trilhas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action para não logados */}
      {!isLoggedIn && (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Pronto para começar?</CardTitle>
            <CardDescription>
              Crie sua conta gratuita e comece a aprender hoje
              mesmo!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              onClick={() => onNavigate("login")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Começar agora
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
