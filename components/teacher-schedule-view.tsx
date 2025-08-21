"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSchedules, useTeachers } from "@/hooks/use-api";
import { Clock, BookOpen, AlertCircle, CheckCircle } from "lucide-react";

interface TeacherSchedule {
  id: number;
  courseId: number;
  subjectId: number;
  teacherId: number;
  classroomId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  courseName: string;
  subjectName: string;
  classroomName: string;
  levelName: string;
}

interface TeacherStats {
  totalHours: number;
  maxHoursPerWeek: number;
  minHoursPerWeek: number;
  maxHoursPerDay: number;
  progress: number;
  dailyHours: { [key: number]: number };
  weeklyHours: number;
}

export function TeacherScheduleView({ teacherId }: { teacherId: number }) {
  const [schedules, setSchedules] = useState<TeacherSchedule[]>([]);
  const [teacher, setTeacher] = useState<any>(null);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(false);

  const [, schedulesApi] = useSchedules();
  const [, teachersApi] = useTeachers();

  useEffect(() => {
    if (teacherId) {
      loadTeacherSchedule();
    }
  }, [teacherId]);

  const loadTeacherSchedule = async () => {
    try {
      setLoading(true);
      
      const [schedulesData, teacherData] = await Promise.all([
        schedulesApi.get("/schedules", { 
          teacherId: teacherId.toString(), 
          active: "true",
          academicYear: "2024-2025"
        }),
        teachersApi.get(`/teachers/${teacherId}`)
      ]);

      setSchedules(schedulesData || []);
      setTeacher(teacherData);

      // Calcular estadísticas
      if (schedulesData && teacherData) {
        const classSchedules = schedulesData.filter((s: any) => !s.isBreak);
        const totalHours = classSchedules.length;
        const dailyHours: { [key: number]: number } = {};
        
        classSchedules.forEach((schedule: any) => {
          dailyHours[schedule.dayOfWeek] = (dailyHours[schedule.dayOfWeek] || 0) + 1;
        });

        const maxDailyHours = Math.max(...Object.values(dailyHours));
        const progress = Math.round((totalHours / teacherData.maxHoursPerWeek) * 100);

        setStats({
          totalHours,
          maxHoursPerWeek: teacherData.maxHoursPerWeek,
          minHoursPerWeek: teacherData.minHoursPerWeek,
          maxHoursPerDay: teacherData.maxHoursPerDay,
          progress,
          dailyHours,
          weeklyHours: totalHours,
        });
      }
    } catch (error) {
      console.error("Error loading teacher schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (day: number) => {
    const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[day] || '';
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getScheduleForDay = (day: number) => {
    return schedules.filter(s => s.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getSubjectColor = (subjectName: string) => {
    const colors: { [key: string]: string } = {
      'Matemáticas': 'bg-red-100 border-red-300 text-red-800',
      'Lengua y Literatura': 'bg-blue-100 border-blue-300 text-blue-800',
      'Ciencias Naturales': 'bg-green-100 border-green-300 text-green-800',
      'Ciencias Sociales': 'bg-orange-100 border-orange-300 text-orange-800',
      'Educación Artística': 'bg-purple-100 border-purple-300 text-purple-800',
      'Educación Física': 'bg-cyan-100 border-cyan-300 text-cyan-800',
      'Inglés': 'bg-lime-100 border-lime-300 text-lime-800',
      'Tecnología': 'bg-indigo-100 border-indigo-300 text-indigo-800',
    };
    return colors[subjectName] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Cargando horario del profesor...</div>;
  }

  if (!teacher) {
    return <div className="text-center py-8 text-muted-foreground">Profesor no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Información del Profesor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Horario de {teacher.firstName} {teacher.lastName}</span>
            <div className="flex gap-2">
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {stats?.totalHours || 0}/{stats?.maxHoursPerWeek || 0} horas
              </Badge>
              <Badge variant={stats?.progress && stats.progress >= 100 ? "default" : "destructive"}>
                {stats?.progress || 0}% completo
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso de horas asignadas</span>
                <span>{stats?.totalHours || 0}/{stats?.maxHoursPerWeek || 0}</span>
              </div>
              <Progress value={stats?.progress || 0} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Total: {stats?.totalHours || 0} horas</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm">Mínimo: {stats?.minHoursPerWeek || 0} horas</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Máximo: {stats?.maxHoursPerWeek || 0} horas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Máx/día: {stats?.maxHoursPerDay || 0} horas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Restricciones */}
      {stats && (
        <>
          {stats.totalHours < stats.minHoursPerWeek && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El profesor no cumple con el mínimo de {stats.minHoursPerWeek} horas por semana. 
                Actualmente tiene {stats.totalHours} horas asignadas.
              </AlertDescription>
            </Alert>
          )}
          
          {stats.totalHours > stats.maxHoursPerWeek && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El profesor excede el máximo de {stats.maxHoursPerWeek} horas por semana. 
                Actualmente tiene {stats.totalHours} horas asignadas.
              </AlertDescription>
            </Alert>
          )}

          {Object.entries(stats.dailyHours).some(([day, hours]) => hours > stats.maxHoursPerDay) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El profesor excede el máximo de {stats.maxHoursPerDay} horas por día en algunos días de la semana.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Horario Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Horario Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay horario asignado para este profesor
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((day) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-center py-2 bg-muted rounded px-2">
                      {getDayName(day)}
                    </h3>
                    {stats?.dailyHours[day] && (
                      <Badge variant="outline" className="text-xs">
                        {stats.dailyHours[day]}h
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    {getScheduleForDay(day).map((schedule, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-xs border ${getSubjectColor(schedule.subjectName)}`}
                      >
                        <div className="font-medium">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <div className="font-semibold">{schedule.subjectName}</div>
                        <div className="opacity-90 text-xs">{schedule.courseName}</div>
                        <div className="opacity-75 text-xs">{schedule.classroomName}</div>
                      </div>
                    ))}
                    {getScheduleForDay(day).length === 0 && (
                      <div className="p-2 rounded text-xs bg-muted text-muted-foreground text-center">
                        Sin clases
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen por Materia */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen por Materia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(
                schedules.reduce((acc: { [key: string]: number }, schedule) => {
                  if (!schedule.isBreak) {
                    acc[schedule.subjectName] = (acc[schedule.subjectName] || 0) + 1;
                  }
                  return acc;
                }, {})
              ).map(([subject, hours]) => (
                <div key={subject} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{subject}</span>
                  <Badge variant="outline">{hours} horas</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
