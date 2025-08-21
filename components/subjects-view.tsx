"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, Plus } from "lucide-react";
import { useSubjects } from "@/hooks/use-api";
import { AddSubjectModal } from "./add-subject-modal";

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  hoursPerWeek: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SubjectsView() {
  const [{ data: subjects, loading, error }, api] = useSubjects<Subject[]>();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      await api.get("/subjects", { active: "true" });
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Materias
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las materias y asignaturas del currículo
          </p>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando materias...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">
            Gestión de Materias
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las materias y asignaturas del currículo
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error al cargar las materias: {error}</p>
              <Button onClick={loadSubjects} className="mt-4">
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
            Gestión de Materias
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las materias y asignaturas del currículo
          </p>
        </div>
        <AddSubjectModal onSubjectAdded={loadSubjects} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Materias ({subjects?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!subjects || subjects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay materias registradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: subject.color + "20" }}
                      >
                        <BookOpen
                          className="w-5 h-5"
                          style={{ color: subject.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{subject.name}</h3>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {subject.code}
                          </Badge>
                          <Badge
                            variant={subject.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {subject.isActive ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {subject.description && (
                    <p className="text-sm text-muted-foreground">
                      {subject.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {subject.hoursPerWeek}h/semana
                    </Badge>
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: subject.color,
                        borderColor: subject.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
