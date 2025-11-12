import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Play, Clock, Search, BookOpen } from "lucide-react"
import { api } from "../src/lib/api"

interface TrilhasPageProps {
  onNavigate: (page: string, courseId?: number) => void
  isLoggedIn: boolean
  userId?: number | null
}

interface Trilha {
  id_trilha: number
  nome_trilha: string
  descricao_trilha: string
  nivel_trilha: string
  total_aulas?: number
  aulas_concluidas?: number
  duracao_total_minutos?: number
  progresso_medio?: number
}

const materias = [
  "Matemática",
  "Português",
  "Ciências",
  "História",
  "Geografia",
  "Artes"
]

export function TrilhasPage({ onNavigate, isLoggedIn, userId }: TrilhasPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("todos")
  const [selectedMateria, setSelectedMateria] = useState<string>("todas")

  useEffect(() => {
    loadTrilhas()
  }, [isLoggedIn, userId, selectedTab, selectedMateria])

  const loadTrilhas = async () => {
    try {
      setLoading(true)
      let response
      
      if (isLoggedIn && userId) {
        response = await api.getTrilhasComProgresso(userId)
      } else {
        response = await api.getTrilhas()
      }

      if (response.error) {
        console.error('Erro ao carregar trilhas:', response.error)
        return
      }

      let trilhasData = response.data || []
      
      // Filtrar por nível se necessário
      if (selectedTab !== "todos") {
        trilhasData = trilhasData.filter((t: Trilha) => t.nivel_trilha === selectedTab)
      }

      // Filtrar por matéria se selecionada
      if (selectedMateria !== "todas") {
        const trilhasPorMateria = await api.getTrilhasPorTema(selectedMateria)
        if (trilhasPorMateria.data) {
          const trilhasIds = new Set(trilhasPorMateria.data.map((t: Trilha) => t.id_trilha))
          trilhasData = trilhasData.filter((t: Trilha) => trilhasIds.has(t.id_trilha))
        }
      }

      setTrilhas(trilhasData)
    } catch (error) {
      console.error('Erro ao carregar trilhas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "fundamental": return "bg-green-100 text-green-800"
      case "medio": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (minutes: number) => {
    if (!minutes) return "0 min"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const calculateProgress = (trilha: Trilha) => {
    if (!trilha.total_aulas || trilha.total_aulas === 0) return 0
    if (!trilha.aulas_concluidas) return 0
    return Math.round((trilha.aulas_concluidas / trilha.total_aulas) * 100)
  }

  const filteredTrilhas = trilhas.filter(trilha =>
    trilha.nome_trilha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trilha.descricao_trilha?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderCourseCard = (trilha: Trilha) => {
    const progress = calculateProgress(trilha)
    const duration = formatDuration(trilha.duracao_total_minutos || 0)

    return (
      <Card key={trilha.id_trilha} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-lg">{trilha.nome_trilha}</CardTitle>
              <Badge className={getLevelColor(trilha.nivel_trilha)}>
                {trilha.nivel_trilha === 'fundamental' ? 'Fundamental' : 'Médio'}
              </Badge>
            </div>
          </div>
          <CardDescription>{trilha.descricao_trilha || 'Sem descrição'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {trilha.total_aulas || 0} aulas
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {duration}
            </div>
          </div>
          
          {isLoggedIn && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={() => onNavigate('curso', trilha.id_trilha)}
            variant={progress > 0 ? "default" : "outline"}
          >
            <Play className="mr-2 h-4 w-4" />
            {progress > 0 ? "Continuar" : "Começar curso"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando trilhas...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1>Trilhas de Estudo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha uma trilha de estudo e comece a aprender!
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar trilhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedMateria} onValueChange={setSelectedMateria}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todas as matérias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as matérias</SelectItem>
              {materias.map((materia) => (
                <SelectItem key={materia} value={materia}>
                  {materia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs por nível */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todas</TabsTrigger>
            <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
            <TabsTrigger value="medio">Médio</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="space-y-6">
            {filteredTrilhas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma trilha encontrada
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrilhas.map(renderCourseCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA para não logados */}
        {!isLoggedIn && (
          <Card className="text-center mt-8">
            <CardHeader>
              <CardTitle>Quer acompanhar seu progresso?</CardTitle>
              <CardDescription>
                Faça login para salvar seu progresso e conquistar badges!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onNavigate('login')}>
                Fazer login
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
