"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Eye, BookOpen, Loader2 } from "lucide-react";
import { useCourses } from "@/hooks/use-api";
import { AddCourseModal } from "./add-course-modal";

interface Course {
  id: number;
  name: string;
  levelId: number;
  classroomId: number;
  academicYear: string;
  totalStudents: number;
  requiredHoursPerWeek: number;
  isActive: boolean;
  level?: {
    name: string;
  };
  classroom?: {
    name: string;
  };
}

export function CoursesView() {
  const [{ data: courses, loading, error }, api] = useCourses<Course[]>();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      await api.get("/courses", { active: "true" });
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Cursos
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra los horarios y asignaciones por curso
          </p>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando cursos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Cursos
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra los horarios y asignaciones por curso
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error al cargar los cursos: {error}</p>
              <Button onClick={loadCourses} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agrupar cursos por nivel
  const coursesByLevel =
    courses?.reduce((acc, course) => {
      const levelName = course.level?.name || "Sin nivel";
      if (!acc[levelName]) {
        acc[levelName] = [];
      }
      acc[levelName].push(course);
      return acc;
    }, {} as Record<string, Course[]>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Cursos
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra los horarios y asignaciones por curso
          </p>
        </div>
        <AddCourseModal onCourseAdded={loadCourses} />
      </div>

      {/* Resumen por Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(coursesByLevel).map(([level, levelCourses]) => {
          const completeCourses = levelCourses.filter(
            (course) => course.requiredHoursPerWeek <= 30 // Asumiendo que 30 es el máximo
          ).length;

          return (
            <Card key={level}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{level}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{levelCourses.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completeCourses} cursos registrados
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cursos ({courses?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!courses || courses.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay cursos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => {
                const percentage = 0; // Por ahora no calculamos horas asignadas
                const isComplete = false;
                const missingHours = course.requiredHoursPerWeek;

                return (
                  <div
                    key={course.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{course.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {course.classroom?.name || "Sin salón"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.totalStudents} estudiantes
                            </Badge>
                            <Badge
                              variant={
                                course.isActive ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {course.isActive ? "Activo" : "Inactivo"}
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
                        <span>Horas Requeridas</span>
                        <span className="font-medium">
                          {course.requiredHoursPerWeek}h
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between items-center">
                        <Badge
                          variant={isComplete ? "default" : "destructive"}
                          className={isComplete ? "bg-green-500" : ""}
                        >
                          {isComplete
                            ? "Horario Completo"
                            : `Requiere ${missingHours}h`}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {course.level?.name || "Sin nivel"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
