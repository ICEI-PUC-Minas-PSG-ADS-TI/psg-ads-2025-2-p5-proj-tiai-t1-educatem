import { useState, useEffect } from "react"
import { Header } from "./components/Header"
import { HomePage } from "./components/HomePage"
import { TrilhasPage } from "./components/TrilhasPage"
import { CursoPage } from "./components/CursoPage"
import { PerfilPage } from "./components/PerfilPage"
import { LoginModal } from "./components/LoginModal"
import { api } from "./src/lib/api"

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.setToken(token)
      // You might want to verify the token here
      // For now, we'll just check if token exists
    }
  }, [])

  const handleNavigate = (page: string, courseId?: number) => {
    setCurrentPage(page)
    if (courseId) {
      setCurrentCourseId(courseId)
    }
    
    // Se tentar acessar área restrita sem login, mostrar modal
    if ((page === 'perfil' || page === 'progresso') && !isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    // Se clicar em "login", mostrar modal
    if (page === 'login') {
      setShowLoginModal(true)
      return
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      
      if (response.error) {
        alert(response.error)
        return
      }

      if (response.data) {
        setIsLoggedIn(true)
        setUserEmail(response.data.user.email)
        setUserName(response.data.user.nome)
        setUserId(response.data.user.id)
        setShowLoginModal(false)
        
        // Se estava tentando acessar uma página restrita, redirecionar
        if (currentPage === 'login') {
          setCurrentPage('home')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Erro ao fazer login')
    }
  }

  const handleRegister = async (name: string, email: string, password: string, nivelEnsino?: string) => {
    try {
      const nivel = nivelEnsino || 'medio' // Default to 'medio' if not provided
      const response = await api.register(name, email, password, nivel)
      
      if (response.error) {
        alert(response.error)
        return
      }

      if (response.data) {
        setIsLoggedIn(true)
        setUserName(response.data.user.nome)
        setUserEmail(response.data.user.email)
        setUserId(response.data.user.id)
        setShowLoginModal(false)
        
        if (currentPage === 'login') {
          setCurrentPage('home')
        }
      }
    } catch (error) {
      console.error('Register error:', error)
      alert('Erro ao criar conta')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setUserEmail('')
    setUserId(null)
    api.setToken(null)
    setCurrentPage('home')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'trilhas':
        return <TrilhasPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} userId={userId} />
      case 'curso':
        return (
          <CursoPage 
            courseId={currentCourseId!} 
            onNavigate={handleNavigate} 
            isLoggedIn={isLoggedIn}
            userId={userId}
          />
        )
      case 'perfil':
        return isLoggedIn ? (
          <PerfilPage userName={userName} userEmail={userEmail} userId={userId!} />
        ) : (
          <HomePage isLoggedIn={isLoggedIn} userName={userName} onNavigate={handleNavigate} userId={userId} />
        )
      case 'progresso':
        return isLoggedIn ? (
          <PerfilPage userName={userName} userEmail={userEmail} userId={userId!} />
        ) : (
          <HomePage isLoggedIn={isLoggedIn} userName={userName} onNavigate={handleNavigate} userId={userId} />
        )
      default:
        return <HomePage isLoggedIn={isLoggedIn} userName={userName} onNavigate={handleNavigate} userId={userId} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <main>
        {renderCurrentPage()}
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  )
}