import { db } from './index';
import { levels, subjects, teachers, classrooms, courses, systemConfig, subjectLevelRestrictions, teacherSubjects } from './schema';

export async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Insertar niveles educativos con horas específicas
    console.log('📚 Insertando niveles educativos...');
    const levelsData = await db.insert(levels).values([
      { 
        name: 'Preescolar', 
        description: 'Educación preescolar para niños de 3 a 5 años',
        requiredHoursPerWeek: 20,
        maxHoursPerDay: 4,
        breakStartTime: '09:30:00',
        breakEndTime: '09:40:00'
      },
      { 
        name: 'Primaria', 
        description: 'Educación primaria de 1° a 6° grado',
        requiredHoursPerWeek: 25,
        maxHoursPerDay: 5,
        breakStartTime: '10:00:00',
        breakEndTime: '10:10:00'
      },
      { 
        name: 'Bachillerato', 
        description: 'Educación secundaria de 7° a 11° grado',
        requiredHoursPerWeek: 30,
        maxHoursPerDay: 6,
        breakStartTime: '10:00:00',
        breakEndTime: '10:10:00'
      },
    ]).returning();

    // Insertar materias básicas con restricciones
    console.log('📖 Insertando materias...');
    const subjectsData = await db.insert(subjects).values([
      { name: 'Matemáticas', code: 'MATH', description: 'Matemáticas básicas y avanzadas', hoursPerWeek: 5, maxHoursPerWeek: 4, color: '#EF4444' },
      { name: 'Lengua y Literatura', code: 'LANG', description: 'Comunicación y literatura', hoursPerWeek: 4, maxHoursPerWeek: 4, color: '#3B82F6' },
      { name: 'Ciencias Naturales', code: 'SCI', description: 'Biología, química y física', hoursPerWeek: 4, maxHoursPerWeek: 4, color: '#10B981' },
      { name: 'Ciencias Sociales', code: 'SOC', description: 'Historia y geografía', hoursPerWeek: 3, maxHoursPerWeek: 4, color: '#F59E0B' },
      { name: 'Educación Artística', code: 'ART', description: 'Arte, música y expresión', hoursPerWeek: 2, maxHoursPerWeek: 4, color: '#8B5CF6' },
      { name: 'Educación Física', code: 'PE', description: 'Deportes y actividad física', hoursPerWeek: 2, maxHoursPerWeek: 4, color: '#06B6D4' },
      { name: 'Inglés', code: 'ENG', description: 'Idioma inglés', hoursPerWeek: 3, maxHoursPerWeek: 4, color: '#84CC16' },
      { name: 'Tecnología', code: 'TECH', description: 'Informática y tecnología', hoursPerWeek: 2, maxHoursPerWeek: 4, color: '#6366F1' },
    ]).returning();

    // Insertar profesores de ejemplo
    console.log('👨‍🏫 Insertando profesores...');
    const teachersData = await db.insert(teachers).values([
      { firstName: 'María', lastName: 'Pérez', email: 'maria.perez@talentotech.edu', phone: '3001234567', identificationNumber: '12345678', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
      { firstName: 'Juan', lastName: 'García', email: 'juan.garcia@talentotech.edu', phone: '3002345678', identificationNumber: '23456789', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
      { firstName: 'Ana', lastName: 'Ramírez', email: 'ana.ramirez@talentotech.edu', phone: '3003456789', identificationNumber: '34567890', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
      { firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@talentotech.edu', phone: '3004567890', identificationNumber: '45678901', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
      { firstName: 'Laura', lastName: 'Martínez', email: 'laura.martinez@talentotech.edu', phone: '3005678901', identificationNumber: '56789012', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
      { firstName: 'Roberto', lastName: 'Hernández', email: 'roberto.hernandez@talentotech.edu', phone: '3006789012', identificationNumber: '67890123', maxHoursPerWeek: 25, minHoursPerWeek: 20, maxHoursPerDay: 4 },
    ]).returning();

    // Insertar salones
    console.log('🏫 Insertando salones...');
    const classroomsData = await db.insert(classrooms).values([
      { name: 'Salón 101', floor: 1, capacity: 25, building: 'Principal', roomType: 'Regular' },
      { name: 'Salón 201', floor: 2, capacity: 30, building: 'Principal', roomType: 'Regular' },
      { name: 'Salón 205', floor: 2, capacity: 30, building: 'Principal', roomType: 'Regular' },
      { name: 'Salón 302', floor: 3, capacity: 25, building: 'Principal', roomType: 'Regular' },
      { name: 'Salón 303', floor: 3, capacity: 25, building: 'Principal', roomType: 'Regular' },
      { name: 'Laboratorio', floor: 1, capacity: 20, building: 'Principal', roomType: 'Laboratorio' },
      { name: 'Gimnasio', floor: 1, capacity: 50, building: 'Deportes', roomType: 'Gimnasio' },
    ]).returning();

    // Insertar cursos de ejemplo
    console.log('📚 Insertando cursos...');
    const coursesData = await db.insert(courses).values([
      { name: 'Preescolar A', levelId: levelsData[0]?.id, classroomId: classroomsData[0]?.id, academicYear: '2024-2025', totalStudents: 20, requiredHoursPerWeek: 20 },
      { name: '1° Primaria', levelId: levelsData[1]?.id, classroomId: classroomsData[1]?.id, academicYear: '2024-2025', totalStudents: 25, requiredHoursPerWeek: 25 },
      { name: '5° Primaria', levelId: levelsData[1]?.id, classroomId: classroomsData[2]?.id, academicYear: '2024-2025', totalStudents: 23, requiredHoursPerWeek: 25 },
      { name: '11° Bachillerato', levelId: levelsData[2]?.id, classroomId: classroomsData[3]?.id, academicYear: '2024-2025', totalStudents: 18, requiredHoursPerWeek: 30 },
    ]).returning();

    // Insertar restricciones de materias por nivel
    console.log('🔒 Insertando restricciones de materias por nivel...');
    await db.insert(subjectLevelRestrictions).values([
      // Preescolar
      { subjectId: subjectsData[4]?.id, levelId: levelsData[0]?.id, maxHoursPerWeek: 3, isRequired: true }, // Artística
      { subjectId: subjectsData[5]?.id, levelId: levelsData[0]?.id, maxHoursPerWeek: 2, isRequired: true }, // Educación Física
      { subjectId: subjectsData[0]?.id, levelId: levelsData[0]?.id, maxHoursPerWeek: 2, isRequired: false }, // Matemáticas básicas
      { subjectId: subjectsData[1]?.id, levelId: levelsData[0]?.id, maxHoursPerWeek: 2, isRequired: false }, // Lengua básica
      
      // Primaria
      { subjectId: subjectsData[0]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 4, isRequired: true }, // Matemáticas
      { subjectId: subjectsData[1]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 4, isRequired: true }, // Lengua
      { subjectId: subjectsData[2]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 3, isRequired: true }, // Ciencias
      { subjectId: subjectsData[3]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 3, isRequired: true }, // Sociales
      { subjectId: subjectsData[4]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 2, isRequired: true }, // Artística
      { subjectId: subjectsData[5]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 2, isRequired: true }, // Educación Física
      { subjectId: subjectsData[6]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 3, isRequired: true }, // Inglés
      { subjectId: subjectsData[7]?.id, levelId: levelsData[1]?.id, maxHoursPerWeek: 2, isRequired: false }, // Tecnología
      
      // Bachillerato
      { subjectId: subjectsData[0]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 4, isRequired: true }, // Matemáticas
      { subjectId: subjectsData[1]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 4, isRequired: true }, // Lengua
      { subjectId: subjectsData[2]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 4, isRequired: true }, // Ciencias
      { subjectId: subjectsData[3]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 3, isRequired: true }, // Sociales
      { subjectId: subjectsData[4]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 2, isRequired: true }, // Artística
      { subjectId: subjectsData[5]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 2, isRequired: true }, // Educación Física
      { subjectId: subjectsData[6]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 3, isRequired: true }, // Inglés
      { subjectId: subjectsData[7]?.id, levelId: levelsData[2]?.id, maxHoursPerWeek: 3, isRequired: true }, // Tecnología
    ]);

    // Insertar relaciones profesor-materia con niveles permitidos
    console.log('👨‍🏫📚 Asignando materias a profesores...');
    await db.insert(teacherSubjects).values([
      // María Pérez - Matemáticas (Preescolar y Bachillerato)
      { 
        teacherId: teachersData[0]?.id, 
        subjectId: subjectsData[0]?.id, 
        allowedLevels: JSON.stringify([levelsData[0]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
      // Juan García - Lengua (Primaria y Bachillerato)
      { 
        teacherId: teachersData[1]?.id, 
        subjectId: subjectsData[1]?.id, 
        allowedLevels: JSON.stringify([levelsData[1]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
      // Ana Ramírez - Ciencias (Primaria y Bachillerato)
      { 
        teacherId: teachersData[2]?.id, 
        subjectId: subjectsData[2]?.id, 
        allowedLevels: JSON.stringify([levelsData[1]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
      // Carlos López - Artística (Preescolar y Bachillerato)
      { 
        teacherId: teachersData[3]?.id, 
        subjectId: subjectsData[4]?.id, 
        allowedLevels: JSON.stringify([levelsData[0]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
      // Laura Martínez - Educación Física (Todos los niveles)
      { 
        teacherId: teachersData[4]?.id, 
        subjectId: subjectsData[5]?.id, 
        allowedLevels: JSON.stringify([levelsData[0]?.id, levelsData[1]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
      // Roberto Hernández - Inglés (Primaria y Bachillerato)
      { 
        teacherId: teachersData[5]?.id, 
        subjectId: subjectsData[6]?.id, 
        allowedLevels: JSON.stringify([levelsData[1]?.id, levelsData[2]?.id]),
        isPrimary: true 
      },
    ]);

    // Insertar configuración del sistema
    console.log('⚙️ Insertando configuración del sistema...');
    await db.insert(systemConfig).values([
      { configKey: 'school_name', configValue: 'Talento Tech', description: 'Nombre de la institución' },
      { configKey: 'academic_year', configValue: '2024-2025', description: 'Año académico actual' },
      { configKey: 'max_hours_per_day', configValue: '4', description: 'Máximo de horas por día para un profesor' },
      { configKey: 'max_hours_per_week', configValue: '25', description: 'Máximo de horas por semana para un profesor' },
      { configKey: 'min_hours_per_week', configValue: '20', description: 'Mínimo de horas por semana para un profesor' },
      { configKey: 'break_duration', configValue: '10', description: 'Duración del descanso en minutos' },
      { configKey: 'class_duration', configValue: '50', description: 'Duración estándar de una clase en minutos' },
      { configKey: 'preescolar_hours', configValue: '20', description: 'Horas requeridas por semana para preescolar' },
      { configKey: 'primaria_hours', configValue: '25', description: 'Horas requeridas por semana para primaria' },
      { configKey: 'bachillerato_hours', configValue: '30', description: 'Horas requeridas por semana para bachillerato' },
    ]);

    console.log('✅ Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en seed:', error);
      process.exit(1);
    });
}
