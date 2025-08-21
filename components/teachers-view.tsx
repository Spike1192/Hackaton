"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, User } from "lucide-react"

const teachersData = [
  {
    id: 1,
    name: "Prof. María Pérez",
    subjects: ["Matemáticas", "Álgebra"],
    hoursAssigned: 22,
    hoursRequired: 20,
    status: "complete",
  },
  {
    id: 2,
    name: "Prof. Juan García",
    subjects: ["Lengua", "Literatura"],
    hoursAssigned: 18,
    hoursRequired: 20,
    status: "incomplete",
  },
  {
    id: 3,
    name: "Prof. Ana Ramírez",
    subjects: ["Ciencias", "Biología"],
    hoursAssigned: 20,
    hoursRequired: 20,
    status: "complete",
  },
  {
    id: 4,
    name: "Prof. Carlos López",
    subjects: ["Artística", "Música"],
    hoursAssigned: 15,
    hoursRequired: 20,
    status: "incomplete",
  },
]

export function TeachersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
          Gestión de Profesores
        </h1>
        <p className="text-muted-foreground mt-2">Administra la carga horaria y asignaciones de los docentes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachersData.map((teacher) => {
              const percentage = (teacher.hoursAssigned / teacher.hoursRequired) * 100
              const isComplete = teacher.hoursAssigned >= teacher.hoursRequired

              return (
                <div key={teacher.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <div className="flex gap-1 mt-1">
                          {teacher.subjects.map((subject, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Horario
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Horas Semanales Asignadas</span>
                      <span className="font-medium">
                        {teacher.hoursAssigned}/{teacher.hoursRequired}h
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${isComplete ? "progress-bar-complete" : "progress-bar-incomplete"}`}
                    />
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={isComplete ? "default" : "destructive"}
                        className={isComplete ? "bg-green-500" : ""}
                      >
                        {isComplete ? "Carga Completa" : `Faltan ${teacher.hoursRequired - teacher.hoursAssigned}h`}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}% completado</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
