"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, BookOpen } from "lucide-react"

const coursesData = [
  {
    id: 1,
    name: "Preescolar A",
    level: "Preescolar",
    hoursAssigned: 25,
    hoursRequired: 30,
    classroom: "Salón 101",
    students: 20,
  },
  {
    id: 2,
    name: "1° Primaria",
    level: "Primaria",
    hoursAssigned: 30,
    hoursRequired: 30,
    classroom: "Salón 201",
    students: 25,
  },
  {
    id: 3,
    name: "5° Primaria",
    level: "Primaria",
    hoursAssigned: 28,
    hoursRequired: 30,
    classroom: "Salón 205",
    students: 23,
  },
  {
    id: 4,
    name: "11° Bachillerato",
    level: "Bachillerato",
    hoursAssigned: 26,
    hoursRequired: 30,
    classroom: "Salón 302",
    students: 18,
  },
]

export function CoursesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">Gestión de Cursos</h1>
        <p className="text-muted-foreground mt-2">Administra los horarios y asignaciones por curso</p>
      </div>

      {/* Resumen por Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Preescolar", "Primaria", "Bachillerato"].map((level) => {
          const levelCourses = coursesData.filter((course) => course.level === level)
          const completeCourses = levelCourses.filter((course) => course.hoursAssigned >= course.hoursRequired).length

          return (
            <Card key={level}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{level}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{levelCourses.length}</div>
                <p className="text-xs text-muted-foreground">{completeCourses} con horario completo</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursesData.map((course) => {
              const percentage = (course.hoursAssigned / course.hoursRequired) * 100
              const isComplete = course.hoursAssigned >= course.hoursRequired
              const missingHours = course.hoursRequired - course.hoursAssigned

              return (
                <div key={course.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {course.classroom}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.students} estudiantes
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Horario Semanal
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Horas Asignadas vs Requeridas</span>
                      <span className="font-medium">
                        {course.hoursAssigned}/{course.hoursRequired}h
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={isComplete ? "default" : "destructive"}
                        className={isComplete ? "bg-green-500" : ""}
                      >
                        {isComplete ? "Horario Completo" : `Faltan ${missingHours}h`}
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
