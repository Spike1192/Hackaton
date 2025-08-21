import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"

export function Navbar() {
  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CE</span>
            </div>
            <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-heading)]">
              Colegio Ejemplo
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Inicio</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Profesores</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Cursos</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Salones</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Reportes</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Administrador</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
