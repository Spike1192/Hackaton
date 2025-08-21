# Sistema de Gestión de Horarios - Talento Tech

Sistema web para la gestión integral de horarios escolares de un colegio con tres niveles educativos: Preescolar, Primaria y Bachillerato.

## 🎯 Características Principales

### Restricciones de Negocio Implementadas

#### **Horarios por Nivel Educativo**

- **Preescolar**: 20 horas semanales (máximo 4 horas por día)
- **Primaria**: 25 horas semanales (máximo 5 horas por día)
- **Bachillerato**: 30 horas semanales (máximo 6 horas por día)

#### **Restricciones de Profesores**

- **Mínimo**: 20 horas por semana
- **Máximo**: 25 horas por semana
- **Máximo por día**: 4 horas
- **Máximo por materia**: 4 horas semanales por curso

#### **Descansos Escalonados**

- **Preescolar**: 9:30 - 9:40 AM
- **Primaria y Bachillerato**: 10:00 - 10:10 AM
- Los descansos no se solapan entre niveles

#### **Asignación de Profesores**

- Los profesores pueden enseñar múltiples materias
- Restricciones por nivel educativo (ej: Matemáticas en Preescolar y Bachillerato)
- Validación automática de conflictos de horarios

## 🚀 Funcionalidades Implementadas

### 1. **Generación Automática de Horarios**

- Algoritmo inteligente que respeta todas las restricciones
- Asignación automática de materias requeridas y opcionales
- Distribución equilibrada de carga horaria
- Detección y registro de conflictos

### 2. **Validación de Restricciones**

- Verificación de horas mínimas y máximas por profesor
- Control de horas por día
- Validación de conflictos de descansos entre niveles
- Alertas en tiempo real de incumplimientos

### 3. **Vistas Especializadas**

- **Vista de Cursos**: Horarios completos con estadísticas
- **Vista de Profesores**: Carga horaria individual con análisis
- **Vista de Salones**: Ocupación y disponibilidad
- **Dashboard**: Resumen general del sistema

### 4. **Gestión de Datos**

- CRUD completo para todas las entidades
- Relaciones complejas entre profesores, materias y niveles
- Configuración flexible del sistema
- Historial de cambios y conflictos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Shadcn/ui, Tailwind CSS
- **Base de Datos**: PostgreSQL con Drizzle ORM
- **Validación**: Esquemas de base de datos con restricciones
- **API**: Next.js API Routes

## 📊 Estructura de la Base de Datos

### Tablas Principales

- `levels`: Niveles educativos con restricciones específicas
- `subjects`: Materias con límites por nivel
- `teachers`: Profesores con restricciones de carga horaria
- `courses`: Cursos asociados a niveles y salones
- `schedules`: Horarios con validaciones automáticas
- `teacher_subjects`: Relaciones profesor-materia con niveles permitidos
- `subject_level_restrictions`: Restricciones específicas por materia y nivel

### Relaciones Clave

- Profesores pueden enseñar múltiples materias
- Materias tienen restricciones por nivel educativo
- Horarios validan conflictos automáticamente
- Descansos se configuran por nivel

## 🎨 Interfaz de Usuario

### Características de UX

- **Colores por Materia**: Sistema visual intuitivo
- **Progreso Visual**: Barras de progreso para horas asignadas
- **Alertas Contextuales**: Notificaciones de conflictos
- **Responsive Design**: Funciona en todos los dispositivos
- **Navegación Intuitiva**: Sidebar con vistas organizadas

### Componentes Principales

- `ScheduleView`: Vista principal de horarios
- `TeacherScheduleView`: Horario específico por profesor
- `TeachersView`: Gestión y análisis de profesores
- `ScheduleGenerator`: Servicio de generación automática

## 🔧 Configuración e Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd TalentoTech

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de base de datos

# Ejecutar migraciones
npx drizzle-kit up:pg

# Poblar datos iniciales
npx tsx lib/db/seed.ts

# Iniciar servidor de desarrollo
pnpm dev
```

### Variables de Entorno

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=talento_tech_db
```

## 📋 Uso del Sistema

### 1. **Configuración Inicial**

- Ejecutar el seed para crear datos de ejemplo
- Verificar que los niveles educativos estén configurados
- Revisar las restricciones de materias por nivel

### 2. **Gestión de Profesores**

- Agregar profesores con sus restricciones
- Asignar materias y niveles permitidos
- Revisar carga horaria automáticamente

### 3. **Generación de Horarios**

- Seleccionar un curso
- Usar "Generar Horario" para creación automática
- Revisar conflictos y validaciones
- Ajustar manualmente si es necesario

### 4. **Monitoreo y Análisis**

- Revisar estadísticas por profesor
- Verificar cumplimiento de restricciones
- Analizar distribución de carga horaria

## 🔍 Validaciones Automáticas

### Conflictos Detectados

- **Profesor**: Múltiples clases en el mismo horario
- **Salón**: Ocupación simultánea
- **Descansos**: Solapamiento entre niveles
- **Horas**: Exceso o déficit de carga horaria
- **Materias**: Más de 4 horas semanales por curso

### Alertas en Tiempo Real

- Indicadores visuales de conflictos
- Mensajes descriptivos de problemas
- Sugerencias de corrección
- Historial de conflictos resueltos

## 📈 Métricas y Reportes

### Estadísticas por Profesor

- Horas asignadas vs. requeridas
- Distribución diaria de clases
- Materias y cursos asignados
- Porcentaje de cumplimiento

### Estadísticas por Curso

- Progreso de horas asignadas
- Distribución de materias
- Horarios de descanso
- Ocupación de salones

## 🔮 Próximas Mejoras

- [ ] Optimización del algoritmo de generación
- [ ] Reportes PDF de horarios
- [ ] Integración con calendarios externos
- [ ] Notificaciones por email
- [ ] Dashboard analítico avanzado
- [ ] API para integración con otros sistemas

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Talento Tech Team** - Desarrollo inicial y mejoras

## 🙏 Agradecimientos

- Comunidad de Next.js
- Equipo de Shadcn/ui
- Contribuidores de Drizzle ORM
