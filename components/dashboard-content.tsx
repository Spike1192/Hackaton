"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, BookOpen, Building, Clock, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data - En una aplicación real, esto vendría de una API
const teachersData = [
  {
    id: 1,
    name: "Prof. María Pérez",
    subject: "Matemáticas",
    hoursAssigned: 22,
    hoursRequired: 20,
    status: "complete",
  },
  { id: 2, name: "Prof. Juan García", subject: "Lengua", hoursAssigned: 18, hoursRequired: 20, status: "incomplete" },
  { id: 3, name: "Prof. Ana Ramírez", subject: "Ciencias", hoursAssigned: 20, hoursRequired: 20, status: "complete" },
  {
    id: 4,
    name: "Prof. Carlos López",
    subject: "Artística",
    hoursAssigned: 15,
    hoursRequired: 20,
    status: "incomplete",
  },
]

const coursesData = [
  { id: 1, name: "Preescolar A", hoursAssigned: 25, hoursRequired: 30, classroom: "Salón 101" },
  { id: 2, name: "1° Primaria", hoursAssigned: 30, hoursRequired: 30, classroom: "Salón 201" },
  { id: 3, name: "11° Bachillerato", hoursAssigned: 26, hoursRequired: 30, classroom: "Salón 302" },
]

const conflicts = [
  { id: 1, type: "classroom", message: "Salón 302 tiene conflicto el Lunes 10:00-11:00" },
  { id: 2, type: "teacher", message: "Prof. García excede 4h diarias el Martes" },
]

export function DashboardContent() {
  const totalTeachers = teachersData.length
  const completeTeachers = teachersData.filter((t) => t.status === "complete").length
  const totalCourses = coursesData.length
  const completeCourses = coursesData.filter((c) => c.hoursAssigned >= c.hoursRequired).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
          Dashboard Principal
        </h1>
        <p className="text-muted-foreground mt-2">Resumen general del sistema de gestión de horarios</p>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">{completeTeachers} con carga completa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">{completeCourses} con horario completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salones Activos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 con conflictos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">de 180 requeridas</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Conflictos */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertas de Conflictos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.map((conflict) => (
              <Alert key={conflict.id} className="alert-conflict">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{conflict.message}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horas Cumplidas por Docente */}
        <Card>
          <CardHeader>
            <CardTitle>Carga Docente</CardTitle>
            <p className="text-sm text-muted-foreground">Progreso de horas asignadas por profesor</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {teachersData.map((teacher) => {
              const percentage = (teacher.hoursAssigned / teacher.hoursRequired) * 100
              const isComplete = teacher.hoursAssigned >= teacher.hoursRequired

              return (
                <div key={teacher.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {teacher.hoursAssigned}/{teacher.hoursRequired}h
                      </span>
                      {isComplete ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={percentage}
                    className={`h-2 ${isComplete ? "progress-bar-complete" : "progress-bar-incomplete"}`}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Cursos con Carga Pendiente */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Cursos</CardTitle>
            <p className="text-sm text-muted-foreground">Horas asignadas vs requeridas por curso</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {coursesData.map((course) => {
              const percentage = (course.hoursAssigned / course.hoursRequired) * 100
              const isComplete = course.hoursAssigned >= course.hoursRequired
              const missingHours = course.hoursRequired - course.hoursAssigned

              return (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.classroom}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {course.hoursAssigned}/{course.hoursRequired}h
                      </span>
                      {isComplete ? (
                        <Badge variant="default" className="bg-green-500">
                          Completo
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Faltan {missingHours}h</Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
