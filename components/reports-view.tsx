"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const teacherDistributionData = [
  { name: "Prof. Pérez", hours: 22, required: 20 },
  { name: "Prof. García", hours: 18, required: 20 },
  { name: "Prof. Ramírez", hours: 20, required: 20 },
  { name: "Prof. López", hours: 15, required: 20 },
]

const courseCompletionData = [
  { name: "Preescolar A", completion: 83 },
  { name: "1° Primaria", completion: 100 },
  { name: "5° Primaria", completion: 93 },
  { name: "11° Bachillerato", completion: 87 },
]

const classroomUsageData = [
  { day: "Lun", usage: 85 },
  { day: "Mar", usage: 92 },
  { day: "Mié", usage: 78 },
  { day: "Jue", usage: 88 },
  { day: "Vie", usage: 75 },
]

const subjectDistribution = [
  { name: "Matemáticas", value: 30, color: "var(--color-chart-1)" },
  { name: "Lengua", value: 25, color: "var(--color-chart-2)" },
  { name: "Ciencias", value: 20, color: "var(--color-chart-4)" },
  { name: "Artística", value: 15, color: "var(--color-chart-3)" },
  { name: "Otros", value: 10, color: "var(--color-chart-5)" },
]

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
          Reportes y Análisis
        </h1>
        <p className="text-muted-foreground mt-2">Visualiza métricas y estadísticas del sistema de horarios</p>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Eficiencia General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Profesores Completos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/4</div>
            <Progress value={50} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cursos Completos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/4</div>
            <Progress value={25} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Conflictos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-2">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Carga Docente */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Carga Docente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teacherDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="var(--color-chart-1)" name="Horas Asignadas" />
                <Bar dataKey="required" fill="var(--color-chart-2)" name="Horas Requeridas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Porcentaje de Cumplimiento por Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Cumplimiento de Horas por Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Completado"]} />
                <Bar dataKey="completion" fill="var(--color-chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso de Salones por Día */}
        <Card>
          <CardHeader>
            <CardTitle>Uso de Salones por Día de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classroomUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Ocupación"]} />
                <Bar dataKey="usage" fill="var(--color-chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Materia */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Horas por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
