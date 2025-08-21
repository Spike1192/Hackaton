"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Calendar, Clock } from "lucide-react";
import { useSchedules, useTeachers, useSubjects, useCourses, useClassrooms } from "@/hooks/use-api";

interface AddScheduleModalProps {
  onScheduleAdded: () => void;
}

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

interface Subject {
  id: number;
  name: string;
  color: string;
}

interface Course {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
}

export function AddScheduleModal({ onScheduleAdded }: AddScheduleModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    subjectId: "",
    teacherId: "",
    classroomId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    academicYear: "2024-2025",
    semester: "Primer Semestre",
  });

  const [, schedulesApi] = useSchedules();
  const [, teachersApi] = useTeachers();
  const [, subjectsApi] = useSubjects();
  const [, coursesApi] = useCourses();
  const [, classroomsApi] = useClassrooms();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const DAYS_OF_WEEK = [
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
  ];

  const loadData = async () => {
    try {
      const [teachersData, subjectsData, coursesData, classroomsData] = await Promise.all([
        teachersApi.get("/teachers", { active: "true" }),
        subjectsApi.get("/subjects", { active: "true" }),
        coursesApi.get("/courses", { active: "true" }),
        classroomsApi.get("/classrooms", { active: "true" }),
      ]);

      setTeachers(teachersData || []);
      setSubjects(subjectsData || []);
      setCourses(coursesData || []);
      setClassrooms(classroomsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schedulesApi.post("/schedules", {
        ...formData,
        courseId: parseInt(formData.courseId),
        subjectId: parseInt(formData.subjectId),
        teacherId: parseInt(formData.teacherId),
        classroomId: parseInt(formData.classroomId),
        dayOfWeek: parseInt(formData.dayOfWeek),
      });

      setFormData({
        courseId: "",
        subjectId: "",
        teacherId: "",
        classroomId: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        academicYear: "2024-2025",
        semester: "Primer Semestre",
      });
      setOpen(false);
      onScheduleAdded();
    } catch (error) {
      console.error("Error adding schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Horario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agregar Nuevo Horario
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Curso *</Label>
              <Select value={formData.courseId} onValueChange={(value) => handleInputChange("courseId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectId">Materia *</Label>
              <Select value={formData.subjectId} onValueChange={(value) => handleInputChange("subjectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacherId">Profesor *</Label>
              <Select value={formData.teacherId} onValueChange={(value) => handleInputChange("teacherId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesor" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classroomId">Salón *</Label>
              <Select value={formData.classroomId} onValueChange={(value) => handleInputChange("classroomId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salón" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Día *</Label>
              <Select value={formData.dayOfWeek} onValueChange={(value) => handleInputChange("dayOfWeek", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar día" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora Inicio *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora Fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Año Académico</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => handleInputChange("academicYear", e.target.value)}
                placeholder="2024-2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) => handleInputChange("semester", e.target.value)}
                placeholder="Primer Semestre"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Horario"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
