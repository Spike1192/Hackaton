"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  User,
  Loader2,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTeachers, useSchedules } from "@/hooks/use-api";
import { AddTeacherModal } from "./add-teacher-modal";
import { TeacherScheduleModal } from "./teacher-schedule-modal";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identificationNumber: string;
  hireDate: string;
  maxHoursPerWeek: number;
  minHoursPerWeek: number;
  maxHoursPerDay: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeacherStats {
  totalHours: number;
  dailyHours: { [key: number]: number };
  subjects: string[];
  courses: string[];
  progress: number;
  hasConflicts: boolean;
}

export function TeachersView() {
  const [{ data: teachers, loading, error }, teachersApi] =
    useTeachers<Teacher[]>();
  const [, schedulesApi] = useSchedules();
  const [teacherStats, setTeacherStats] = useState<{
    [key: number]: TeacherStats;
  }>({});

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (teachers) {
      loadTeacherStats();
    }
  }, [teachers]);

  const loadTeachers = async () => {
    try {
      await teachersApi.get("/teachers", { active: "true" });
    } catch (error) {
      console.error("Error loading teachers:", error);
    }
  };

  const loadTeacherStats = async () => {
    if (!teachers) return;

    const stats: { [key: number]: TeacherStats } = {};

    for (const teacher of teachers) {
      try {
        const schedules = await schedulesApi.get("/schedules", {
          teacherId: teacher.id.toString(),
          active: "true",
          academicYear: "2024-2025",
        });

        if (schedules && schedules.length > 0) {
          const classSchedules = schedules.filter((s: any) => !s.isBreak);
          const totalHours = classSchedules.length;
          const dailyHours: { [key: number]: number } = {};
          const subjects = new Set<string>();
          const courses = new Set<string>();

          classSchedules.forEach((schedule: any) => {
            dailyHours[schedule.dayOfWeek] =
              (dailyHours[schedule.dayOfWeek] || 0) + 1;
            if (schedule.subjectName) subjects.add(schedule.subjectName);
            if (schedule.courseName) courses.add(schedule.courseName);
          });

          const progress = Math.round(
            (totalHours / teacher.maxHoursPerWeek) * 100
          );
          const hasConflicts =
            Object.values(dailyHours).some(
              (hours) => hours > teacher.maxHoursPerDay
            ) ||
            totalHours > teacher.maxHoursPerWeek ||
            totalHours < teacher.minHoursPerWeek;

          stats[teacher.id] = {
            totalHours,
            dailyHours,
            subjects: Array.from(subjects),
            courses: Array.from(courses),
            progress,
            hasConflicts,
          };
        } else {
          stats[teacher.id] = {
            totalHours: 0,
            dailyHours: {},
            subjects: [],
            courses: [],
            progress: 0,
            hasConflicts: false,
          };
        }
      } catch (error) {
        console.error(`Error loading stats for teacher ${teacher.id}:`, error);
      }
    }

    setTeacherStats(stats);
  };

  const getDayName = (day: number) => {
    const days = ["", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return days[day] || "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Profesores
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra la carga horaria y asignaciones de los docentes
          </p>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando profesores...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Profesores
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra la carga horaria y asignaciones de los docentes
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error al cargar los profesores: {error}</p>
              <Button onClick={loadTeachers} className="mt-4">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Profesores
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra la carga horaria y asignaciones de los docentes
          </p>
        </div>
        <AddTeacherModal onTeacherAdded={loadTeachers} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores ({teachers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!teachers || teachers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay profesores registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {teachers.map((teacher) => {
                const stats = teacherStats[teacher.id];
                const isComplete = stats?.totalHours >= teacher.minHoursPerWeek;
                const hasExceeded = stats?.totalHours > teacher.maxHoursPerWeek;

                return (
                  <div
                    key={teacher.id}
                    className="border rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {teacher.firstName} {teacher.lastName}
                          </h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {teacher.email}
                            </Badge>
                            <Badge
                              variant={
                                teacher.isActive ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {teacher.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <TeacherScheduleModal teacher={teacher} />
                    </div>

                    {/* Estadísticas de Horas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Horas Asignadas</span>
                          <span className="font-medium">
                            {stats?.totalHours || 0}/{teacher.maxHoursPerWeek}h
                          </span>
                        </div>
                        <Progress
                          value={stats?.progress || 0}
                          className={`h-2 ${
                            isComplete && !hasExceeded
                              ? "bg-green-200"
                              : "bg-red-200"
                          }`}
                        />
                        <div className="flex justify-between items-center">
                          <Badge
                            variant={
                              isComplete && !hasExceeded
                                ? "default"
                                : "destructive"
                            }
                            className={
                              isComplete && !hasExceeded ? "bg-green-500" : ""
                            }
                          >
                            {hasExceeded
                              ? "Excede máximo"
                              : isComplete
                              ? "Carga completa"
                              : `Mínimo: ${teacher.minHoursPerWeek}h`}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {stats?.progress || 0}% del máximo
                          </span>
                        </div>
                      </div>

                      {/* Horas por Día */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Horas por Día</div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((day) => (
                            <div
                              key={day}
                              className="flex flex-col items-center"
                            >
                              <span className="text-xs text-muted-foreground">
                                {getDayName(day)}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  (stats?.dailyHours[day] || 0) >
                                  teacher.maxHoursPerDay
                                    ? "border-red-500 text-red-700"
                                    : ""
                                }`}
                              >
                                {stats?.dailyHours[day] || 0}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Máx/día: {teacher.maxHoursPerDay}h
                        </div>
                      </div>

                      {/* Materias y Cursos */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Asignaciones</div>
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="font-medium">Materias:</span>{" "}
                            {stats?.subjects.length || 0}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Cursos:</span>{" "}
                            {stats?.courses.length || 0}
                          </div>
                        </div>
                        {stats?.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {stats.subjects
                              .slice(0, 3)
                              .map((subject, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {subject}
                                </Badge>
                              ))}
                            {stats.subjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{stats.subjects.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alertas de Restricciones */}
                    {stats?.hasConflicts && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Conflictos detectados:</strong>
                          <ul className="mt-1 space-y-1">
                            {stats.totalHours < teacher.minHoursPerWeek && (
                              <li className="text-sm">
                                • No cumple el mínimo de{" "}
                                {teacher.minHoursPerWeek} horas por semana
                              </li>
                            )}
                            {stats.totalHours > teacher.maxHoursPerWeek && (
                              <li className="text-sm">
                                • Excede el máximo de {teacher.maxHoursPerWeek}{" "}
                                horas por semana
                              </li>
                            )}
                            {Object.entries(stats.dailyHours).some(
                              ([day, hours]) => hours > teacher.maxHoursPerDay
                            ) && (
                              <li className="text-sm">
                                • Excede el máximo de {teacher.maxHoursPerDay}{" "}
                                horas por día
                              </li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Información Adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Contratado:</span>{" "}
                        {new Date(teacher.hireDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span>{" "}
                        {teacher.phone}
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
