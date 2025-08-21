-- =====================================================
-- BASE DE DATOS: TALENTO TECH - SISTEMA DE GESTIÓN DE HORARIOS
-- =====================================================

-- Crear la base de datos
CREATE DATABASE talento_tech_db;

-- Conectar a la base de datos
\c talento_tech_db;

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de niveles educativos
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materias/subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    hours_per_week INTEGER DEFAULT 0,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Color para UI
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de profesores
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    identification_number VARCHAR(20) UNIQUE,
    hire_date DATE,
    max_hours_per_week INTEGER DEFAULT 40,
    min_hours_per_week INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de salones/classrooms
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    floor INTEGER DEFAULT 1,
    capacity INTEGER DEFAULT 30,
    building VARCHAR(50) DEFAULT 'Principal',
    room_type VARCHAR(50) DEFAULT 'Regular', -- Regular, Laboratorio, Gimnasio, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level_id INTEGER REFERENCES levels(id) ON DELETE RESTRICT,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE SET NULL,
    academic_year VARCHAR(9) NOT NULL, -- 2024-2025
    total_students INTEGER DEFAULT 0,
    required_hours_per_week INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estudiantes
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    identification_number VARCHAR(20) UNIQUE,
    birth_date DATE,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLAS DE RELACIÓN
-- =====================================================

-- Relación profesor-materia
CREATE TABLE teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE, -- Materia principal del profesor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, subject_id)
);

-- Relación curso-estudiante
CREATE TABLE course_students (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, graduated, transferred
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id)
);

-- =====================================================
-- TABLA DE HORARIOS
-- =====================================================

-- Tabla principal de horarios
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE RESTRICT,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE RESTRICT,
    classroom_id INTEGER REFERENCES classrooms(id) ON DELETE RESTRICT,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    semester VARCHAR(20) DEFAULT 'Primer Semestre',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Validaciones
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT unique_schedule_slot UNIQUE (
        classroom_id, day_of_week, start_time, end_time, academic_year
    )
);

-- =====================================================
-- TABLAS DE AUDITORÍA Y CONFIGURACIÓN
-- =====================================================

-- Tabla de conflictos de horarios
CREATE TABLE schedule_conflicts (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL, -- teacher_overlap, classroom_overlap, teacher_hours_exceeded
    conflict_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'warning', -- warning, error, critical
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_active ON teachers(is_active);
CREATE INDEX idx_subjects_active ON subjects(is_active);
CREATE INDEX idx_classrooms_active ON classrooms(is_active);
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_courses_academic_year ON courses(academic_year);
CREATE INDEX idx_schedules_course ON schedules(course_id);
CREATE INDEX idx_schedules_teacher ON schedules(teacher_id);
CREATE INDEX idx_schedules_classroom ON schedules(classroom_id);
CREATE INDEX idx_schedules_day_time ON schedules(day_of_week, start_time, end_time);
CREATE INDEX idx_schedules_academic_year ON schedules(academic_year);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar niveles educativos
INSERT INTO levels (name, description) VALUES
('Preescolar', 'Educación preescolar para niños de 3 a 5 años'),
('Primaria', 'Educación primaria de 1° a 6° grado'),
('Bachillerato', 'Educación secundaria de 7° a 11° grado');

-- Insertar materias básicas
INSERT INTO subjects (name, code, description, hours_per_week, color) VALUES
('Matemáticas', 'MATH', 'Matemáticas básicas y avanzadas', 5, '#EF4444'),
('Lengua y Literatura', 'LANG', 'Comunicación y literatura', 4, '#3B82F6'),
('Ciencias Naturales', 'SCI', 'Biología, química y física', 4, '#10B981'),
('Ciencias Sociales', 'SOC', 'Historia y geografía', 3, '#F59E0B'),
('Educación Artística', 'ART', 'Arte, música y expresión', 2, '#8B5CF6'),
('Educación Física', 'PE', 'Deportes y actividad física', 2, '#06B6D4'),
('Inglés', 'ENG', 'Idioma inglés', 3, '#84CC16'),
('Tecnología', 'TECH', 'Informática y tecnología', 2, '#6366F1');

-- Insertar profesores de ejemplo
INSERT INTO teachers (first_name, last_name, email, phone, identification_number, max_hours_per_week, min_hours_per_week) VALUES
('María', 'Pérez', 'maria.perez@talentotech.edu', '3001234567', '12345678', 25, 20),
('Juan', 'García', 'juan.garcia@talentotech.edu', '3002345678', '23456789', 25, 20),
('Ana', 'Ramírez', 'ana.ramirez@talentotech.edu', '3003456789', '34567890', 25, 20),
('Carlos', 'López', 'carlos.lopez@talentotech.edu', '3004567890', '45678901', 25, 20);

-- Insertar salones
INSERT INTO classrooms (name, floor, capacity, building, room_type) VALUES
('Salón 101', 1, 25, 'Principal', 'Regular'),
('Salón 201', 2, 30, 'Principal', 'Regular'),
('Salón 205', 2, 30, 'Principal', 'Regular'),
('Salón 302', 3, 25, 'Principal', 'Regular'),
('Salón 303', 3, 25, 'Principal', 'Regular'),
('Laboratorio', 1, 20, 'Principal', 'Laboratorio'),
('Gimnasio', 1, 50, 'Deportes', 'Gimnasio');

-- Insertar cursos de ejemplo
INSERT INTO courses (name, level_id, classroom_id, academic_year, total_students, required_hours_per_week) VALUES
('Preescolar A', 1, 1, '2024-2025', 20, 25),
('1° Primaria', 2, 2, '2024-2025', 25, 30),
('5° Primaria', 2, 3, '2024-2025', 23, 30),
('11° Bachillerato', 3, 4, '2024-2025', 18, 30);

-- Asignar materias a profesores
INSERT INTO teacher_subjects (teacher_id, subject_id, is_primary) VALUES
(1, 1, TRUE), -- Prof. Pérez - Matemáticas (principal)
(1, 2, FALSE), -- Prof. Pérez - Lengua
(2, 2, TRUE), -- Prof. García - Lengua (principal)
(3, 3, TRUE), -- Prof. Ramírez - Ciencias (principal)
(4, 5, TRUE); -- Prof. López - Artística (principal)

-- Insertar configuración del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES
('school_name', 'Talento Tech', 'Nombre de la institución'),
('academic_year', '2024-2025', 'Año académico actual'),
('max_hours_per_day', '8', 'Máximo de horas por día para un profesor'),
('max_hours_per_week', '40', 'Máximo de horas por semana para un profesor'),
('min_hours_per_week', '20', 'Mínimo de horas por semana para un profesor'),
('break_duration', '10', 'Duración del descanso en minutos'),
('class_duration', '50', 'Duración estándar de una clase en minutos');

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para validar conflictos de horarios
CREATE OR REPLACE FUNCTION check_schedule_conflicts()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si hay conflictos de salón
    IF EXISTS (
        SELECT 1 FROM schedules 
        WHERE classroom_id = NEW.classroom_id 
        AND day_of_week = NEW.day_of_week 
        AND academic_year = NEW.academic_year
        AND id != COALESCE(NEW.id, 0)
        AND (
            (start_time <= NEW.start_time AND end_time > NEW.start_time) OR
            (start_time < NEW.end_time AND end_time >= NEW.end_time) OR
            (start_time >= NEW.start_time AND end_time <= NEW.end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Conflicto de horario: El salón ya está ocupado en este horario';
    END IF;
    
    -- Verificar si hay conflictos de profesor
    IF EXISTS (
        SELECT 1 FROM schedules 
        WHERE teacher_id = NEW.teacher_id 
        AND day_of_week = NEW.day_of_week 
        AND academic_year = NEW.academic_year
        AND id != COALESCE(NEW.id, 0)
        AND (
            (start_time <= NEW.start_time AND end_time > NEW.start_time) OR
            (start_time < NEW.end_time AND end_time >= NEW.end_time) OR
            (start_time >= NEW.start_time AND end_time <= NEW.end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Conflicto de horario: El profesor ya tiene clase en este horario';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para validar conflictos
CREATE TRIGGER check_schedule_conflicts_trigger 
    BEFORE INSERT OR UPDATE ON schedules 
    FOR EACH ROW EXECUTE FUNCTION check_schedule_conflicts();

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para obtener información completa de horarios
CREATE VIEW schedule_details AS
SELECT 
    s.id,
    c.name as course_name,
    l.name as level_name,
    sub.name as subject_name,
    t.first_name || ' ' || t.last_name as teacher_name,
    cl.name as classroom_name,
    s.day_of_week,
    s.start_time,
    s.end_time,
    s.academic_year,
    s.semester
FROM schedules s
JOIN courses c ON s.course_id = c.id
JOIN levels l ON c.level_id = l.id
JOIN subjects sub ON s.subject_id = sub.id
JOIN teachers t ON s.teacher_id = t.id
JOIN classrooms cl ON s.classroom_id = cl.id
WHERE s.is_active = TRUE;

-- Vista para obtener carga horaria de profesores
CREATE VIEW teacher_workload AS
SELECT 
    t.id,
    t.first_name || ' ' || t.last_name as teacher_name,
    t.email,
    COUNT(s.id) as total_classes,
    SUM(EXTRACT(EPOCH FROM (s.end_time - s.start_time))/3600) as total_hours,
    t.max_hours_per_week,
    t.min_hours_per_week
FROM teachers t
LEFT JOIN schedules s ON t.id = s.teacher_id AND s.is_active = TRUE
GROUP BY t.id, t.first_name, t.last_name, t.email, t.max_hours_per_week, t.min_hours_per_week;

-- Vista para obtener ocupación de salones
CREATE VIEW classroom_usage AS
SELECT 
    cl.id,
    cl.name as classroom_name,
    cl.capacity,
    COUNT(s.id) as total_classes,
    COUNT(DISTINCT s.course_id) as courses_using,
    COUNT(DISTINCT s.teacher_id) as teachers_using
FROM classrooms cl
LEFT JOIN schedules s ON cl.id = s.classroom_id AND s.is_active = TRUE
GROUP BY cl.id, cl.name, cl.capacity;

-- =====================================================
-- PERMISOS Y ROLES
-- =====================================================

-- Crear roles para diferentes tipos de usuarios
CREATE ROLE talento_tech_admin;
CREATE ROLE talento_tech_teacher;
CREATE ROLE talento_tech_viewer;

-- Asignar permisos
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO talento_tech_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO talento_tech_admin;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO talento_tech_teacher;
GRANT SELECT, INSERT, UPDATE ON schedules TO talento_tech_teacher;
GRANT SELECT ON schedule_details TO talento_tech_teacher;
GRANT SELECT ON teacher_workload TO talento_tech_teacher;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO talento_tech_viewer;
GRANT SELECT ON schedule_details TO talento_tech_viewer;
GRANT SELECT ON teacher_workload TO talento_tech_viewer;
GRANT SELECT ON classroom_usage TO talento_tech_viewer;

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

-- Comentarios para documentación
COMMENT ON DATABASE talento_tech_db IS 'Base de datos para el sistema de gestión de horarios de Talento Tech';
COMMENT ON TABLE teachers IS 'Información de los profesores de la institución';
COMMENT ON TABLE courses IS 'Cursos académicos por nivel y año';
COMMENT ON TABLE schedules IS 'Horarios de clases con validaciones de conflictos';
COMMENT ON TABLE schedule_conflicts IS 'Registro de conflictos detectados en horarios';

-- Mensaje de finalización
SELECT 'Base de datos Talento Tech creada exitosamente!' as status;