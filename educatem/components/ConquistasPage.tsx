import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Award, Star, Calendar, Sparkles } from "lucide-react";
import { api } from "../src/lib/api";

interface ConquistasPageProps {
  userId: number;
}

interface Gamificacao {
  id_gamificacao: number;
  tipo_recompensa: string;
  valor_recompensa: string;
  data_conquista: string;
}

interface Estatisticas {
  totalBadges: number;
  completedCourses: number;
  totalMinutes: number;
}

export function ConquistasPage({ userId }: ConquistasPageProps) {
  const [badges, setBadges] = useState<Gamificacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConquistas();
  }, [userId]);

  const loadConquistas = async () => {
    try {
      setLoading(true);

      // Carregar badges
      const badgesResponse = await api.getGamificacao(userId);
      if (badgesResponse.data) {
        setBadges(badgesResponse.data);
      }

      // Carregar estatísticas
      const statsResponse = await api.getEstatisticas(userId);
      if (statsResponse.data) {
        setEstatisticas(statsResponse.data);
      }
    } catch (error) {
      console.error("Erro ao carregar conquistas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return 0;
    const hours = Math.floor(minutes / 60);
    return hours;
  };

  // Agrupar badges por tipo (se necessário)
  const badgesAgrupados = badges.sort(
    (a, b) =>
      new Date(b.data_conquista).getTime() -
      new Date(a.data_conquista).getTime()
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando conquistas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold">Minhas Conquistas</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja todas as badges que você conquistou ao completar trilhas de
            estudo!
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-purple-500" />
                Total de Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{badges.length}</div>
              <p className="text-xs text-muted-foreground">
                Conquistas desbloqueadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Trilhas Completas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {estatisticas?.completedCourses || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Trilhas finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-blue-500" />
                Tempo de Estudo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatDuration(estatisticas?.totalMinutes || 0)}h
              </div>
              <p className="text-xs text-muted-foreground">
                Total de horas estudadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Badges */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Badges Conquistadas
              </CardTitle>
              <CardDescription>
                {badges.length > 0
                  ? `Você conquistou ${badges.length} ${
                      badges.length === 1 ? "badge" : "badges"
                    }! Continue estudando para desbloquear mais.`
                  : "Nenhuma badge conquistada ainda. Complete trilhas para desbloquear badges!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badgesAgrupados.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badgesAgrupados.map((badge) => (
                    <Card
                      key={badge.id_gamificacao}
                      className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-center mb-2">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                            ⭐
                          </div>
                        </div>
                        <CardTitle className="text-center text-base leading-tight">
                          {badge.tipo_recompensa}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="text-center space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            Conquistada
                          </Badge>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(badge.data_conquista)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Trophy className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      Nenhuma conquista ainda
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Complete trilhas de estudo para desbloquear badges e
                      mostrar seu progresso!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mensagem motivacional */}
        {badges.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  🎉 Parabéns pelo seu progresso!
                </p>
                <p className="text-sm text-muted-foreground">
                  Continue estudando para desbloquear ainda mais badges e
                  trilhas!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
