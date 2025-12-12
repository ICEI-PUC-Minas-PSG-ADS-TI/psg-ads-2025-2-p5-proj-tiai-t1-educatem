import { Button } from "./ui/button";
import { Avatar as AvatarComponent, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { User, LogOut, Trophy, Award } from "lucide-react";

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
            className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/assets/favicon.png" 
              alt="EducaTem" 
              className="h-8 w-8"
            />
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative h-8 w-8 rounded-full p-0 bg-transparent hover:bg-muted border-none cursor-pointer flex items-center justify-center transition-colors"
                onClick={() => {
                  onNavigate("perfil");
                }}
                title="Ver meu perfil">
                <AvatarComponent className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarFallback>
                    {userName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </AvatarComponent>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
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
            </div>
          ) : (
            <Button onClick={onLogin}>Entrar</Button>
          )}
        </div>
      </div>
    </header>
  );
}
