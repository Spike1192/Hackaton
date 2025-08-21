"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, Clock } from "lucide-react"

const classroomsData = [
  { id: 1, name: "Salón 101", floor: 1, capacity: 25, status: "available", course: "Preescolar A", conflicts: 0 },
  { id: 2, name: "Salón 201", floor: 2, capacity: 30, status: "occupied", course: "1° Primaria", conflicts: 0 },
  { id: 3, name: "Salón 205", floor: 2, capacity: 30, status: "occupied", course: "5° Primaria", conflicts: 1 },
  { id: 4, name: "Salón 302", floor: 3, capacity: 25, status: "conflict", course: "11° Bachillerato", conflicts: 2 },
  { id: 5, name: "Salón 303", floor: 3, capacity: 25, status: "available", course: "", conflicts: 0 },
  { id: 6, name: "Laboratorio", floor: 1, capacity: 20, status: "occupied", course: "Ciencias", conflicts: 0 },
]

export function ClassroomsView() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-blue-500"
      case "conflict":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupado"
      case "conflict":
        return "Conflicto"
      default:
        return "Desconocido"
    }
  }

  const availableRooms = classroomsData.filter((room) => room.status === "available").length
  const occupiedRooms = classroomsData.filter((room) => room.status === "occupied").length
  const conflictRooms = classroomsData.filter((room) => room.status === "conflict").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">Estado de Salones</h1>
        <p className="text-muted-foreground mt-2">Visualiza el uso y disponibilidad de los salones</p>
      </div>

      {/* Resumen de Estados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableRooms}</div>
            <p className="text-xs text-muted-foreground">salones libres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Ocupados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedRooms}</div>
            <p className="text-xs text-muted-foreground">en uso normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              Conflictos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conflictRooms}</div>
            <p className="text-xs text-muted-foreground">requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Plano Visual de Salones */}
      <Card>
        <CardHeader>
          <CardTitle>Plano de Salones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((floor) => (
              <div key={floor}>
                <h3 className="font-semibold mb-3">Piso {floor}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {classroomsData
                    .filter((room) => room.floor === floor)
                    .map((room) => (
                      <div
                        key={room.id}
                        className="border-2 rounded-lg p-3 text-center space-y-2 hover:shadow-md transition-shadow"
                        style={{
                          borderColor: `var(--color-${room.status === "available" ? "green" : room.status === "occupied" ? "blue" : "destructive"}-500)`,
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium text-sm">{room.name}</span>
                        </div>

                        <div className={`w-full h-2 rounded ${getStatusColor(room.status)}`}></div>

                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(room.status)} text-white border-0`}
                          >
                            {getStatusText(room.status)}
                          </Badge>

                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Users className="w-3 h-3" />
                            {room.capacity}
                          </div>

                          {room.course && <div className="text-xs font-medium">{room.course}</div>}

                          {room.conflicts > 0 && (
                            <div className="text-xs text-destructive flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3" />
                              {room.conflicts} conflicto{room.conflicts > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardHeader>
          <CardTitle>Leyenda de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Disponible - Salón libre para asignación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Ocupado - En uso normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive"></div>
              <span className="text-sm">Conflicto - Solapamiento de horarios detectado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
