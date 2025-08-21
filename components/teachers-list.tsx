'use client';

import { useEffect } from 'react';
import { useTeachers } from '@/hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, User, Mail, Phone } from 'lucide-react';

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TeachersList() {
  const [{ data: teachers, loading, error }, api] = useTeachers<Teacher[]>();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      await api.get('/teachers', { active: 'true' });
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando profesores...</span>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!teachers || teachers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay profesores registrados</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {getInitials(teacher.firstName, teacher.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  {teacher.firstName} {teacher.lastName}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={teacher.isActive ? "default" : "secondary"}>
                    {teacher.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{teacher.email}</span>
            </div>
            {teacher.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{teacher.phone}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Máx. horas/sem:</span>
                <span className="ml-1 font-medium">{teacher.maxHoursPerWeek}</span>
              </div>
              <div>
                <span className="text-gray-500">Mín. horas/sem:</span>
                <span className="ml-1 font-medium">{teacher.minHoursPerWeek}</span>
              </div>
            </div>
            {teacher.identificationNumber && (
              <div className="text-sm text-gray-500">
                ID: {teacher.identificationNumber}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
