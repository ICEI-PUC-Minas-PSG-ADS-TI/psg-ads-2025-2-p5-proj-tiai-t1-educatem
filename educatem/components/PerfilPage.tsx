import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { 
  Trophy, 
  Star, 
  Clock, 
  BookOpen, 
  Target,
  Calendar,
  Award,
  Flame
} from "lucide-react"
import { api } from "../src/lib/api"

interface PerfilPageProps {
  userName: string
  userEmail: string
  userId: number
}

interface Usuario {
  id_usuario: number
  nome: string
  email: string
  data_cadastro: string
  nivel_ensino: string
  pontuacao_total: number
}

interface ProgressoTema {
  tema_aula: string
  total_aulas: number
  aulas_concluidas: number
  progresso_medio: number
}

interface Gamificacao {
  id_gamificacao: number
  tipo_recompensa: string
  valor_recompensa: string
  data_conquista: string
}

interface Estatisticas {
  totalBadges: number
  completedCourses: number
  totalMinutes: number
}

export function PerfilPage({ userName, userEmail, userId }: PerfilPageProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [progressoTemas, setProgressoTemas] = useState<ProgressoTema[]>([])
  const [badges, setBadges] = useState<Gamificacao[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfileData()
  }, [userId])

  const loadProfileData = async () => {
    try {
      setLoading(true)

      // Carregar dados do usuário
      const usuarioResponse = await api.getUsuario(userId)
      if (usuarioResponse.data) {
        setUsuario(usuarioResponse.data)
      }

      // Carregar progresso por tema
      const temasResponse = await api.getProgressoPorTema(userId)
      if (temasResponse.data) {
        setProgressoTemas(temasResponse.data)
      }

      // Carregar badges
      const badgesResponse = await api.getGamificacao(userId)
      if (badgesResponse.data) {
        setBadges(badgesResponse.data)
      }

      // Carregar estatísticas
      const statsResponse = await api.getEstatisticas(userId)
      if (statsResponse.data) {
        setEstatisticas(statsResponse.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  const formatDuration = (minutes: number) => {
    if (!minutes) return 0
    const hours = Math.floor(minutes / 60)
    return hours
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando perfil...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header do perfil */}
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1>{userName}</h1>
            <p className="text-muted-foreground">{userEmail}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {usuario && (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Membro desde {formatDate(usuario.data_cadastro)}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {usuario.nivel_ensino === 'fundamental' ? 'Fundamental' : 'Médio'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas gerais */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas?.completedCourses || 0}
              </div>
              <p className="text-xs text-muted-foreground">Completados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                Tempo de Estudo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(estatisticas?.totalMinutes || 0)}h
              </div>
              <p className="text-xs text-muted-foreground">Total assistido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Pontuação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuario?.pontuacao_total || 0}
              </div>
              <p className="text-xs text-muted-foreground">Pontos totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-purple-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {badges.length}
              </div>
              <p className="text-xs text-muted-foreground">Badges conquistadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Progresso por matéria */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progresso por Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressoTemas.length > 0 ? (
                  progressoTemas.map((tema) => {
                    const progress = tema.total_aulas > 0
                      ? Math.round((tema.aulas_concluidas / tema.total_aulas) * 100)
                      : 0
                    return (
                      <div key={tema.tema_aula} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tema.tema_aula}</span>
                          <span className="text-sm text-muted-foreground">
                            {progress}% • {tema.aulas_concluidas}/{tema.total_aulas} aulas
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum progresso ainda
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Badges/Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Conquistas
              </CardTitle>
              <CardDescription>
                Continue estudando para desbloquear novas badges!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id_gamificacao} 
                      className="p-3 rounded-lg border bg-primary/5 border-primary/20 text-center space-y-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{badge.tipo_recompensa}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(badge.data_conquista)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Conquistada
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma conquista ainda. Continue estudando!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
