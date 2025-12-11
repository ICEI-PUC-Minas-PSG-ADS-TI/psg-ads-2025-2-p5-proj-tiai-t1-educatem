import { Button } from "./ui/button";
import { Avatar, Avatar as AvatarComponent, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { User, LogOut, Trophy, BookOpen, Award } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string, courseId?: number, materia?: string) => void;
}

export function Header({
  isLoggedIn,
  userName,
  onLogin,
  onLogout,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e Navegação */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate("home")}
            className="text-2xl font-bold text-primary hover:text-primary/80">
            EducaTem
          </button>

          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => onNavigate("trilhas")}
              className="hover:text-primary transition-colors">
              Trilhas de Estudo
            </button>
            <button
              onClick={() => onNavigate("sobre")}
              className="hover:text-primary transition-colors">
              Sobre
            </button>
            <button
              onClick={() => onNavigate("conquistas")}
              className="hover:text-primary transition-colors">
              Conquistas
            </button>
          </nav>
        </div>

        {/* Área de Usuário */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <AvatarComponent className="h-8 w-8">
                    <AvatarFallback>
                      {userName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </AvatarComponent>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => onNavigate("perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("progresso")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Meu Progresso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("conquistas")}>
                  <Award className="mr-2 h-4 w-4" />
                  Minhas Conquistas
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onLogin}>Entrar</Button>
          )}
        </div>
      </div>
    </header>
  );
}
