"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AddScheduleModal } from "./add-schedule-modal";
import {
  useSchedules,
  useTeachers,
  useCourses,
  useClassrooms,
  useLevels,
} from "@/hooks/use-api";
import { AlertCircle, CheckCircle, Clock, Users, BookOpen } from "lucide-react";

type ViewMode = "teacher" | "course" | "classroom";

interface ScheduleData {
  id: number;
  courseId: number;
  subjectId: number | null;
  teacherId: number | null;
  classroomId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  courseName: string;
  subjectName: string | null;
  teacherName: string | null;
  classroomName: string;
  levelName: string;
}

export function ScheduleView() {
  const [viewMode, setViewMode] = useState<ViewMode>("course");
  const [selectedItem, setSelectedItem] = useState("");
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);

  const [, schedulesApi] = useSchedules();
  const [, teachersApi] = useTeachers();
  const [, coursesApi] = useCourses();
  const [, classroomsApi] = useClassrooms();
  const [, levelsApi] = useLevels();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedItem && viewMode === "course") {
      loadCourseSchedule(selectedItem);
    }
  }, [selectedItem, viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesData, teachersData, coursesData, classroomsData, levelsData] =
        await Promise.all([
          schedulesApi.get("/schedules", { active: "true" }),
          teachersApi.get("/teachers", { active: "true" }),
          coursesApi.get("/courses", { active: "true" }),
          classroomsApi.get("/classrooms", { active: "true" }),
          levelsApi.get("/levels"),
        ]);

      setSchedules(schedulesData || []);
      setTeachers(teachersData || []);
      setCourses(coursesData || []);
      setClassrooms(classroomsData || []);
      setLevels(levelsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseSchedule = async (courseId: string) => {
    try {
      const courseSchedules = await schedulesApi.get("/schedules", { 
        courseId, 
        active: "true",
        academicYear: "2024-2025"
      });
      
      setSchedules(courseSchedules || []);
      
      // Calcular estadísticas del curso
      if (courseSchedules && courseSchedules.length > 0) {
        const course = courses.find((c: any) => c.id.toString() === courseId);
        if (course) {
          const classHours = courseSchedules.filter((s: any) => !s.isBreak).length;
          const breakHours = courseSchedules.filter((s: any) => s.isBreak).length;
          const level = levels.find((l: any) => l.id === course.levelId);
          
          setCourseStats({
            course,
            level,
            assignedHours: classHours,
            requiredHours: level?.requiredHoursPerWeek || 30,
            breakHours,
            progress: Math.round((classHours / (level?.requiredHoursPerWeek || 30)) * 100),
          });
        }
      }
    } catch (error) {
      console.error("Error loading course schedule:", error);
    }
  };

  const generateSchedule = async () => {
    if (!selectedItem || viewMode !== "course") {
      alert("Selecciona un curso para generar el horario");
      return;
    }

    try {
      setGenerating(true);
      
      const response = await fetch("/api/schedules/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: parseInt(selectedItem),
          academicYear: "2024-2025",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Horario generado exitosamente!\nClases: ${result.totalClasses}\nDescansos: ${result.totalBreaks}`);
        loadCourseSchedule(selectedItem);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      alert("Error generando el horario");
    } finally {
      setGenerating(false);
    }
  };

  const validateRestrictions = async () => {
    if (!selectedItem || viewMode !== "course") return;

    try {
      const response = await fetch(`/api/schedules/generate?courseId=${selectedItem}&academicYear=2024-2025`);
      const result = await response.json();

      if (response.ok) {
        setConflicts(result.breakConflicts || []);
      }
    } catch (error) {
      console.error("Error validating restrictions:", error);
    }
  };

  const getBlockClass = (schedule: ScheduleData) => {
    if (schedule.isBreak) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    
    // Colores por materia
    const subjectColors: { [key: string]: string } = {
      'Matemáticas': 'bg-red-100 border-red-300 text-red-800',
      'Lengua y Literatura': 'bg-blue-100 border-blue-300 text-blue-800',
      'Ciencias Naturales': 'bg-green-100 border-green-300 text-green-800',
      'Ciencias Sociales': 'bg-orange-100 border-orange-300 text-orange-800',
      'Educación Artística': 'bg-purple-100 border-purple-300 text-purple-800',
      'Educación Física': 'bg-cyan-100 border-cyan-300 text-cyan-800',
      'Inglés': 'bg-lime-100 border-lime-300 text-lime-800',
      'Tecnología': 'bg-indigo-100 border-indigo-300 text-indigo-800',
    };

    return subjectColors[schedule.subjectName || ''] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Mostrar solo HH:MM
  };

  const getDayName = (day: number) => {
    const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[day] || '';
  };

  const getScheduleForDay = (day: number) => {
    return schedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
          Vista de Horarios
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y visualiza los horarios semanales con validaciones automáticas
        </p>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Vista</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Ver por:</label>
            <Select
              value={viewMode}
              onValueChange={(value: ViewMode) => setViewMode(value)}
            >
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
            <label className="text-sm font-medium mb-2 block">
              Seleccionar:
            </label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un elemento" />
              </SelectTrigger>
              <SelectContent>
                {viewMode === "course" && courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.levelName})
                  </SelectItem>
                ))}
                {viewMode === "teacher" && teachers.map((teacher: any) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
                {viewMode === "classroom" && classrooms.map((classroom: any) => (
                  <SelectItem key={classroom.id} value={classroom.id.toString()}>
                    {classroom.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <AddScheduleModal onScheduleAdded={loadData} />
            {viewMode === "course" && selectedItem && (
              <>
                <Button 
                  onClick={generateSchedule} 
                  disabled={generating}
                  variant="outline"
                >
                  {generating ? "Generando..." : "Generar Horario"}
                </Button>
                <Button 
                  onClick={validateRestrictions}
                  variant="secondary"
                >
                  Validar Restricciones
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del Curso */}
      {courseStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{courseStats.course.name} ({courseStats.level.name})</span>
              <div className="flex gap-2">
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {courseStats.assignedHours}/{courseStats.requiredHours} horas
                </Badge>
                <Badge variant={courseStats.progress >= 100 ? "default" : "destructive"}>
                  {courseStats.progress}% completo
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso de horas asignadas</span>
                  <span>{courseStats.assignedHours}/{courseStats.requiredHours}</span>
                </div>
                <Progress value={courseStats.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Clases: {courseStats.assignedHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Descansos: {courseStats.breakHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Estudiantes: {courseStats.course.totalStudents}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas de Conflictos */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Conflictos detectados:</strong>
            <ul className="mt-2 space-y-1">
              {conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">
                  • {conflict.description}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Calendario Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando horario...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {viewMode === "course" && selectedItem 
                ? "No hay horario asignado para este curso. Usa 'Generar Horario' para crear uno automáticamente."
                : "Selecciona un elemento para ver su horario"
              }
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className="space-y-2">
                  <h3 className="font-semibold text-center py-2 bg-muted rounded">
                    {getDayName(day)}
                  </h3>
                  <div className="space-y-1">
                    {getScheduleForDay(day).map((schedule, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs border ${getBlockClass(schedule)}`}
                      >
                        <div className="font-medium">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        {schedule.isBreak ? (
                          <div className="font-semibold">Descanso</div>
                        ) : (
                          <>
                            <div className="font-semibold">{schedule.subjectName}</div>
                            {schedule.teacherName && (
                              <div className="opacity-90 text-xs">{schedule.teacherName}</div>
                            )}
                            <div className="opacity-75 text-xs">{schedule.classroomName}</div>
                          </>
                        )}
                      </div>
                    ))}
                    {getScheduleForDay(day).length === 0 && (
                      <div className="p-2 rounded text-xs bg-muted text-muted-foreground text-center">
                        Sin asignar
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-sm">Matemáticas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span className="text-sm">Lengua y Literatura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm">Ciencias Naturales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
              <span className="text-sm">Ciencias Sociales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
              <span className="text-sm">Educación Artística</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-100 border border-cyan-300"></div>
              <span className="text-sm">Educación Física</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-lime-100 border border-lime-300"></div>
              <span className="text-sm">Inglés</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100 border border-indigo-300"></div>
              <span className="text-sm">Tecnología</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
              <span className="text-sm">Descanso</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
