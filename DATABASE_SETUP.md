# Configuración de la Base de Datos - Talento Tech

## Requisitos Previos

1. **PostgreSQL** instalado y ejecutándose
2. **Node.js** y **npm** instalados
3. **Dependencias del proyecto** instaladas

## Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con la siguiente configuración:

```env
# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=talento_tech_db

# Configuración de Next.js
NEXTAUTH_SECRET=tu-secret-key-aqui
NEXTAUTH_URL=http://localhost:3000
```

## Pasos para Configurar la Base de Datos

### 1. Crear la Base de Datos

```sql
CREATE DATABASE talento_tech_db;
```

### 2. Generar las Migraciones

```bash
npm run db:generate
```

### 3. Aplicar las Migraciones

```bash
npm run db:push
```

### 4. Poblar la Base de Datos con Datos Iniciales

```bash
npm run db:seed
```

## Scripts Disponibles

- `npm run db:generate` - Genera las migraciones basadas en el esquema
- `npm run db:push` - Aplica las migraciones a la base de datos
- `npm run db:studio` - Abre Drizzle Studio para gestionar la base de datos
- `npm run db:seed` - Pobla la base de datos con datos de ejemplo

## Estructura de la Base de Datos

### Tablas Principales

1. **levels** - Niveles educativos (Preescolar, Primaria, Bachillerato)
2. **subjects** - Materias académicas
3. **teachers** - Profesores
4. **classrooms** - Salones de clase
5. **courses** - Cursos por nivel y año
6. **students** - Estudiantes
7. **schedules** - Horarios de clases
8. **system_config** - Configuración del sistema

### Tablas de Relación

1. **teacher_subjects** - Relación profesor-materia
2. **course_students** - Relación curso-estudiante
3. **schedule_conflicts** - Conflictos de horarios

## APIs Disponibles

### Profesores

- `GET /api/teachers` - Obtener todos los profesores
- `POST /api/teachers` - Crear un nuevo profesor
- `GET /api/teachers/[id]` - Obtener un profesor específico
- `PUT /api/teachers/[id]` - Actualizar un profesor
- `DELETE /api/teachers/[id]` - Eliminar un profesor (soft delete)

### Materias

- `GET /api/subjects` - Obtener todas las materias
- `POST /api/subjects` - Crear una nueva materia
- `GET /api/subjects/[id]` - Obtener una materia específica
- `PUT /api/subjects/[id]` - Actualizar una materia
- `DELETE /api/subjects/[id]` - Eliminar una materia (soft delete)

### Salones

- `GET /api/classrooms` - Obtener todos los salones
- `POST /api/classrooms` - Crear un nuevo salón

### Cursos

- `GET /api/courses` - Obtener todos los cursos
- `POST /api/courses` - Crear un nuevo curso

### Horarios

- `GET /api/schedules` - Obtener todos los horarios
- `POST /api/schedules` - Crear un nuevo horario (con validaciones de conflictos)

### Niveles

- `GET /api/levels` - Obtener todos los niveles
- `POST /api/levels` - Crear un nuevo nivel

## Validaciones de Horarios

El sistema incluye validaciones automáticas para evitar conflictos:

1. **Conflictos de Salón** - Un salón no puede tener dos clases al mismo tiempo
2. **Conflictos de Profesor** - Un profesor no puede tener dos clases al mismo tiempo
3. **Validación de Horarios** - La hora de inicio debe ser menor que la hora de fin

## Datos de Ejemplo

El script de seed incluye:

- 3 niveles educativos
- 8 materias básicas
- 4 profesores de ejemplo
- 7 salones de diferentes tipos
- 4 cursos de ejemplo
- Configuración básica del sistema

## Solución de Problemas

### Error de Conexión

- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `.env.local`
- Asegúrate de que la base de datos exista

### Error de Migración

- Ejecuta `npm run db:generate` antes de `npm run db:push`
- Verifica que no haya conflictos en el esquema

### Error de Seed

- Asegúrate de que las migraciones se hayan aplicado correctamente
- Verifica que la base de datos esté vacía o usa `onConflictDoNothing()`
