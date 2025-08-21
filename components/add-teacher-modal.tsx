"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { useTeachers } from "@/hooks/use-api";

interface AddTeacherModalProps {
  onTeacherAdded: () => void;
}

export function AddTeacherModal({ onTeacherAdded }: AddTeacherModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    identificationNumber: "",
    maxHoursPerWeek: 25,
    minHoursPerWeek: 20,
  });

  const [, api] = useTeachers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/teachers", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        identificationNumber: "",
        maxHoursPerWeek: 25,
        minHoursPerWeek: 20,
      });
      setOpen(false);
      onTeacherAdded();
    } catch (error) {
      console.error("Error adding teacher:", error);
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
          Agregar Profesor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Profesor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="María"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="maria.perez@talentotech.edu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="3001234567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificationNumber">
                Número de Identificación *
              </Label>
              <Input
                id="identificationNumber"
                value={formData.identificationNumber}
                onChange={(e) =>
                  handleInputChange("identificationNumber", e.target.value)
                }
                placeholder="12345678"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxHoursPerWeek">
                Horas Máximas por Semana *
              </Label>
              <Input
                id="maxHoursPerWeek"
                type="number"
                min="1"
                max="40"
                value={formData.maxHoursPerWeek}
                onChange={(e) =>
                  handleInputChange("maxHoursPerWeek", parseInt(e.target.value))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minHoursPerWeek">
                Horas Mínimas por Semana *
              </Label>
              <Input
                id="minHoursPerWeek"
                type="number"
                min="1"
                max="40"
                value={formData.minHoursPerWeek}
                onChange={(e) =>
                  handleInputChange("minHoursPerWeek", parseInt(e.target.value))
                }
                required
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
                "Agregar Profesor"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
