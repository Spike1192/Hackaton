"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, GraduationCap } from "lucide-react";
import { useCourses, useLevels, useClassrooms } from "@/hooks/use-api";

interface AddCourseModalProps {
  onCourseAdded: () => void;
}

interface Level {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
}

export function AddCourseModal({ onCourseAdded }: AddCourseModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    levelId: "",
    classroomId: "",
    academicYear: "2024-2025",
    totalStudents: 25,
    requiredHoursPerWeek: 30,
  });

  const [, coursesApi] = useCourses();
  const [, levelsApi] = useLevels();
  const [, classroomsApi] = useClassrooms();

  const [levels, setLevels] = useState<Level[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const loadData = async () => {
    try {
      const [levelsData, classroomsData] = await Promise.all([
        levelsApi.get("/levels"),
        classroomsApi.get("/classrooms", { active: "true" }),
      ]);

      setLevels(levelsData || []);
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
      await coursesApi.post("/courses", {
        ...formData,
        levelId: parseInt(formData.levelId),
        classroomId: parseInt(formData.classroomId),
      });

      setFormData({
        name: "",
        levelId: "",
        classroomId: "",
        academicYear: "2024-2025",
        totalStudents: 25,
        requiredHoursPerWeek: 30,
      });
      setOpen(false);
      onCourseAdded();
    } catch (error) {
      console.error("Error adding course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Curso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Agregar Nuevo Curso
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Curso *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="1° Primaria"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="levelId">Nivel Educativo *</Label>
              <Select
                value={formData.levelId}
                onValueChange={(value) => handleInputChange("levelId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classroomId">Salón Asignado *</Label>
              <Select
                value={formData.classroomId}
                onValueChange={(value) =>
                  handleInputChange("classroomId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salón" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((classroom) => (
                    <SelectItem
                      key={classroom.id}
                      value={classroom.id.toString()}
                    >
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academicYear">Año Académico</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) =>
                  handleInputChange("academicYear", e.target.value)
                }
                placeholder="2024-2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalStudents">Total Estudiantes</Label>
              <Input
                id="totalStudents"
                type="number"
                min="1"
                max="50"
                value={formData.totalStudents}
                onChange={(e) =>
                  handleInputChange("totalStudents", parseInt(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requiredHoursPerWeek">Horas Requeridas</Label>
              <Input
                id="requiredHoursPerWeek"
                type="number"
                min="1"
                max="40"
                value={formData.requiredHoursPerWeek}
                onChange={(e) =>
                  handleInputChange(
                    "requiredHoursPerWeek",
                    parseInt(e.target.value)
                  )
                }
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
                "Agregar Curso"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
