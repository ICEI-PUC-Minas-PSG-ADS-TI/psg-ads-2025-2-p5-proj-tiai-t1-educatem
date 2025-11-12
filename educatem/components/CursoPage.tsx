import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { 
  Play, 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  Award,
  Lock
} from "lucide-react"
import { api } from "../src/lib/api"

interface CursoPageProps {
  courseId: number
  onNavigate: (page: string) => void
  isLoggedIn: boolean
  userId?: number | null
}

interface Aula {
  id_aula: number
  titulo_aula: string
  descricao_aula: string
  url_video: string
  duracao: number
  tema_aula: string
  nivel_aula: string
}

interface Trilha {
  id_trilha: number
  nome_trilha: string
  descricao_trilha: string
  nivel_trilha: string
}

interface ProgressoAula {
  id_progresso: number
  id_aluno: number
  id_aula: number
  status_aula: string
  porcentagem_conclusao: number
}

export function CursoPage({ courseId, onNavigate, isLoggedIn, userId }: CursoPageProps) {
  const [currentLesson, setCurrentLesson] = useState<number | null>(null)
  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [aulas, setAulas] = useState<Aula[]>([])
  const [progressos, setProgressos] = useState<Record<number, ProgressoAula>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourseData()
  }, [courseId, isLoggedIn, userId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      // Carregar trilha
      const trilhaResponse = await api.getTrilha(courseId)
      if (trilhaResponse.error) {
        console.error('Erro ao carregar trilha:', trilhaResponse.error)
        return
      }
      setTrilha(trilhaResponse.data)

      // Carregar aulas da trilha
      const aulasResponse = await api.getAulasByTrilha(courseId)
      if (aulasResponse.error) {
        console.error('Erro ao carregar aulas:', aulasResponse.error)
        return
      }
      const aulasData = aulasResponse.data || []
      setAulas(aulasData)

      // Definir primeira aula como atual se não houver
      if (aulasData.length > 0 && !currentLesson) {
        setCurrentLesson(aulasData[0].id_aula)
      }

      // Carregar progressos se logado
      if (isLoggedIn && userId) {
        const progressosMap: Record<number, ProgressoAula> = {}
        for (const aula of aulasData) {
          const progressoResponse = await api.getProgressoAula(userId, aula.id_aula)
          if (progressoResponse.data) {
            progressosMap[aula.id_aula] = progressoResponse.data
          }
        }
        setProgressos(progressosMap)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do curso:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonComplete = async (aulaId: number) => {
    if (!isLoggedIn || !userId) return

    const progresso = progressos[aulaId]
    const newStatus = progresso?.status_aula === 'concluida' ? 'iniciada' : 'concluida'
    const newPorcentagem = newStatus === 'concluida' ? 100 : 50

    try {
      const response = await api.saveProgresso(userId, aulaId, newStatus, newPorcentagem)
      if (response.error) {
        console.error('Erro ao salvar progresso:', response.error)
        return
      }

      setProgressos(prev => ({
        ...prev,
        [aulaId]: response.data
      }))
    } catch (error) {
      console.error('Erro ao salvar progresso:', error)
    }
  }

  const isLessonCompleted = (aulaId: number) => {
    return progressos[aulaId]?.status_aula === 'concluida'
  }

  const isLessonAccessible = (aulaId: number) => {
    if (!isLoggedIn) {
      // Não logados podem ver apenas as 2 primeiras aulas
      const index = aulas.findIndex(a => a.id_aula === aulaId)
      return index < 2
    }
    return true
  }

  const completedLessons = aulas.filter(a => isLessonCompleted(a.id_aula))
  const progressPercentage = aulas.length > 0 
    ? Math.round((completedLessons.length / aulas.length) * 100)
    : 0

  const totalDuration = aulas.reduce((sum, aula) => sum + aula.duracao, 0)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando curso...</div>
      </div>
    )
  }

  if (!trilha) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Trilha não encontrada</div>
      </div>
    )
  }

  const currentAula = aulas.find(a => a.id_aula === currentLesson)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => onNavigate('trilhas')} className="hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span>Trilhas</span>
          <span>/</span>
          <span className="text-foreground">{trilha.nome_trilha}</span>
        </div>

        {/* Header do curso */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1>{trilha.nome_trilha}</h1>
              <p className="text-muted-foreground mt-2">{trilha.descricao_trilha || 'Sem descrição'}</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge>{trilha.nivel_trilha === 'fundamental' ? 'Fundamental' : 'Médio'}</Badge>
              </div>
            </div>

            {/* Player de vídeo */}
            <Card>
              <CardContent className="p-0">
                {currentAula ? (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Play className="h-12 w-12 mx-auto" />
                      <p className="font-medium">{currentAula.titulo_aula}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration(currentAula.duracao)}
                      </p>
                      {currentAula.url_video && (
                        <Button 
                          onClick={() => window.open(currentAula.url_video, '_blank')}
                          className="mt-4"
                        >
                          Assistir Vídeo
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground">
                    <p>Selecione uma aula</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progresso e estatísticas */}
            {isLoggedIn && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Seu Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso do curso</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{completedLessons.length}</div>
                      <div className="text-xs text-muted-foreground">Aulas concluídas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{aulas.length - completedLessons.length}</div>
                      <div className="text-xs text-muted-foreground">Restantes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
                      <div className="text-xs text-muted-foreground">Duração total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Lista de aulas */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conteúdo do Curso
                </CardTitle>
                <CardDescription>
                  {aulas.length} aulas • {formatDuration(totalDuration)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {aulas.map((aula, index) => {
                    const isCompleted = isLessonCompleted(aula.id_aula)
                    const isCurrent = aula.id_aula === currentLesson
                    const isAccessible = isLessonAccessible(aula.id_aula)
                    
                    return (
                      <div
                        key={aula.id_aula}
                        className={`flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-muted transition-colors ${
                          isCurrent ? 'bg-primary/10' : ''
                        } ${!isAccessible ? 'opacity-50' : 'cursor-pointer'}`}
                        onClick={() => isAccessible && setCurrentLesson(aula.id_aula)}
                      >
                        {!isAccessible ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : isCompleted ? (
                          <CheckCircle 
                            className="h-4 w-4 text-green-500 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLessonComplete(aula.id_aula)
                            }}
                          />
                        ) : (
                          <Circle 
                            className="h-4 w-4 text-muted-foreground cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLessonComplete(aula.id_aula)
                            }}
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${isCurrent ? 'font-medium' : ''}`}>
                            {aula.titulo_aula}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDuration(aula.duracao)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA para não logados */}
            {!isLoggedIn && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Acesso Limitado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Faça login para acessar todas as aulas e acompanhar seu progresso!
                  </p>
                  <Button className="w-full" onClick={() => onNavigate('login')}>
                    Fazer Login
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

