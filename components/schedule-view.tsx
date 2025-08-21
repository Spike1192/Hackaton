"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type ViewMode = "teacher" | "course" | "classroom"

const scheduleData = {
  "11-bachillerato": {
    monday: [
      { time: "8:00-9:00", subject: "Matemáticas", teacher: "Prof. Pérez", classroom: "302", type: "math" },
      { time: "9:10-10:00", subject: "Lengua", teacher: "Prof. García", classroom: "302", type: "language" },
      { time: "10:00-10:10", subject: "Descanso", teacher: "", classroom: "", type: "break" },
      { time: "10:10-11:00", subject: "Ciencias", teacher: "Prof. Ramírez", classroom: "302", type: "science" },
    ],
    tuesday: [
      { time: "8:00-9:00", subject: "Artística", teacher: "Prof. López", classroom: "302", type: "arts" },
      { time: "9:10-10:00", subject: "Matemáticas", teacher: "Prof. Pérez", classroom: "302", type: "math" },
    ],
  },
}

export function ScheduleView() {
  const [viewMode, setViewMode] = useState<ViewMode>("course")
  const [selectedItem, setSelectedItem] = useState("11-bachillerato")

  const getBlockClass = (type: string) => {
    switch (type) {
      case "math":
        return "schedule-block-math"
      case "language":
        return "schedule-block-language"
      case "arts":
        return "schedule-block-arts"
      case "science":
        return "schedule-block-science"
      case "break":
        return "schedule-block-break"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">Vista de Horarios</h1>
        <p className="text-muted-foreground mt-2">Gestiona y visualiza los horarios semanales</p>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Vista</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Ver por:</label>
            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Profesor</SelectItem>
                <SelectItem value="course">Curso</SelectItem>
                <SelectItem value="classroom">Salón</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Seleccionar:</label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11-bachillerato">11° Bachillerato</SelectItem>
                <SelectItem value="prof-perez">Prof. Pérez</SelectItem>
                <SelectItem value="salon-302">Salón 302</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button>Generar Horario</Button>
          </div>
        </CardContent>
      </Card>

      {/* Información del Curso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>11° Bachillerato (Salón 302)</span>
            <div className="flex gap-2">
              <Badge variant="outline">Horas asignadas: 26/30</Badge>
              <Badge variant="destructive">Faltan 4 horas</Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Calendario Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day, dayIndex) => (
              <div key={day} className="space-y-2">
                <h3 className="font-semibold text-center py-2 bg-muted rounded">{day}</h3>
                <div className="space-y-1">
                  {dayIndex === 0 &&
                    scheduleData["11-bachillerato"].monday.map((block, index) => (
                      <div key={index} className={`p-2 rounded text-xs ${getBlockClass(block.type)}`}>
                        <div className="font-medium">{block.time}</div>
                        <div>{block.subject}</div>
                        {block.teacher && <div className="opacity-90">{block.teacher}</div>}
                      </div>
                    ))}
                  {dayIndex === 1 &&
                    scheduleData["11-bachillerato"].tuesday.map((block, index) => (
                      <div key={index} className={`p-2 rounded text-xs ${getBlockClass(block.type)}`}>
                        <div className="font-medium">{block.time}</div>
                        <div>{block.subject}</div>
                        {block.teacher && <div className="opacity-90">{block.teacher}</div>}
                      </div>
                    ))}
                  {dayIndex > 1 && (
                    <div className="p-2 rounded text-xs bg-muted text-muted-foreground text-center">Sin asignar</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda de Colores */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda de Materias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded schedule-block-math"></div>
              <span className="text-sm">Matemáticas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded schedule-block-language"></div>
              <span className="text-sm">Lengua</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded schedule-block-arts"></div>
              <span className="text-sm">Artística</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded schedule-block-science"></div>
              <span className="text-sm">Ciencias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded schedule-block-break"></div>
              <span className="text-sm">Descanso</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
