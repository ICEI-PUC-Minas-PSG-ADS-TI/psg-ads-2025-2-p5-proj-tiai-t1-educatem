import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Trophy, BookOpen, User, Medal } from "lucide-react";
import { api } from "../src/lib/api";

interface PerfilAlunoProps {
  userId: number;
  onNavigate: (page: string) => void;
}

export function PerfilAluno({ userId, onNavigate }: PerfilAlunoProps) {
  const [userData, setUserData] = useState<any>(null);
  const [cursos, setCursos] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const userResponse = await api.getUserProfile(userId);
      const cursosResponse = await api.getCursosCursando(userId);
      const badgesResponse = await api.getGamificacao(userId);

      setUserData(userResponse.data);
      setCursos(cursosResponse.data || []);
      setBadges(badgesResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar perfil", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <User className="h-8 w-8 text-primary" /> Perfil do Aluno
      </h1>

      {/* CARD - INFO DO ALUNO */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <User className="h-6 w-6 text-blue-500" /> Informações do Aluno
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p>Carregando...</p>
          ) : userData ? (
            <div className="flex items-center gap-4">
              <img
                src={userData.foto_perfil || "https://via.placeholder.com/120"}
                alt="Foto do aluno"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <div className="space-y-1">
                <p className="text-lg font-semibold">{userData.nome}</p>
                <p className="text-muted-foreground text-sm">{userData.email}</p>
                <p className="text-sm mt-2">Membro desde: {userData.data_cadastro}</p>
              </div>
            </div>
          ) : (
            <p>Nenhuma informação disponível.</p>
          )}
        </CardContent>
      </Card>

      {/* CARD - CURSOS EM ANDAMENTO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-green-500" /> Cursos em andamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Carregando...</p>
          ) : cursos.length > 0 ? (
            cursos.map((curso) => {
              const progresso = curso.total_aulas
                ? Math.round((curso.aulas_concluidas / curso.total_aulas) * 100)
                : 0;

              return (
                <div key={curso.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{curso.nome_trilha}</p>
                    <span className="text-sm">{progresso}%</span>
                  </div>
                  <Progress value={progresso} />
                  <Button
                    onClick={() => onNavigate("trilhas")}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Continuar curso
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground">Nenhum curso em andamento.</p>
          )}
        </CardContent>
      </Card>

      {/* CARD - MEDALHAS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Medal className="h-6 w-6 text-yellow-500" /> Medalhas e Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          {loading ? (
            <p>Carregando...</p>
          ) : badges.length > 0 ? (
            badges.map((badge) => (
              <Badge key={badge.id_gamificacao} variant="secondary" className="px-4 py-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                {badge.tipo_recompensa}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">Nenhuma medalha conquistada ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
