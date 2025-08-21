"use client"

import { Button } from "@/components/ui/button"
import { Users, BookOpen, Building, BarChart3, Clock, Home } from "lucide-react"
import type { ViewType } from "./dashboard"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as ViewType, label: "Dashboard", icon: Home },
    { id: "schedule" as ViewType, label: "Asignar Horarios", icon: Clock },
    { id: "teachers" as ViewType, label: "Ver por Profesor", icon: Users },
    { id: "courses" as ViewType, label: "Ver por Curso", icon: BookOpen },
    { id: "classrooms" as ViewType, label: "Ver por Salón", icon: Building },
    { id: "reports" as ViewType, label: "Reportes", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-sidebar-foreground mb-4 font-[family-name:var(--font-heading)]">
          Menú Principal
        </h2>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
