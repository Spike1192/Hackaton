"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { useSchedules } from "@/hooks/use-api";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Schedule {
  id: number;
  courseId: number;
  subjectId: number;
  teacherId: number;
  classroomId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  academicYear: string;
  semester: string;
  isActive: boolean;
  courseName?: string;
  subjectName?: string;
  teacherFirstName?: string;
  teacherLastName?: string;
  classroomName?: string;
  levelName?: string;
}

interface TeacherScheduleModalProps {
  teacher: Teacher;
}

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes", 
  "Martes", 
  "Miércoles", 
  "Jueves", 
  "Viernes", 
  "Sábado"
];

export function TeacherScheduleModal({ teacher }: TeacherScheduleModalProps) {
  const [open, setOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  const [, api] = useSchedules();

  const loadTeacherSchedule = async () => {
    if (!open) return;
    
    setLoading(true);
    try {
      const response = await api.get("/schedules", { 
        teacherId: teacher.id.toString(),
        active: "true"
      });
      setSchedules(response || []);
    } catch (error) {
      console.error("Error loading teacher schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTeacherSchedule();
    }
  }, [open, teacher.id]);

  const getSchedulesByDay = (dayOfWeek: number) => {
    return schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Ver Horario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Horario de {teacher.firstName} {teacher.lastName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando horario...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {DAYS_OF_WEEK.slice(1, 6).map((day, index) => {
              const daySchedules = getSchedulesByDay(index + 1);
              
              return (
                <Card key={day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {daySchedules.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Sin clases programadas</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {daySchedules
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((schedule) => (
                            <div
                              key={schedule.id}
                              className="border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </span>
                                </div>
                                                                 <Badge 
                                   variant="outline"
                                 >
                                   {schedule.subjectName}
                                 </Badge>
                              </div>
                              
                                                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                   <BookOpen className="w-3 h-3" />
                                   <span>{schedule.courseName}</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <MapPin className="w-3 h-3" />
                                   <span>{schedule.classroomName}</span>
                                 </div>
                               </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
