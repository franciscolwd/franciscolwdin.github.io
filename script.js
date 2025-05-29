document.addEventListener('DOMContentLoaded', () => {
    let appState = {
        nombreUsuario: "Atleta Máquina",
        appName: "Gym Máster Pro",
        unidadesPeso: "kg",
        planActivoGeneral: "gimnasio",
        diasEntrenamiento: 6,
        entrenamientosCompletados: {},
        rutinasPersonalizadas: {},
        entrenamientoActual: null, 
        entrenamientoActualOriginalId: null,
        componentesEnEdicion: [], 
        indiceComponenteActual: 0,
        indiceEjercicioActualEnComponente: 0,
        serieActual: 1,
        timerDescansoActivo: null,
        tiempoRestanteDescanso: 0,
        cronometroEntrenamientoGeneralActivo: null,
        tiempoTotalEntrenamientoSegundos: 0,
        cronometroEjercicioActualActivo: null, 
        tiempoEjercicioActualSegundos: 0, 
        modificandoEjercicio: { 
            activo: false, compIndex: null, ejIndex: null, idEjercicioAbiertoEnModal: null 
        }
    };

    // --- BIBLIOTECA DE EJERCICIOS AMPLIADA (MÁQUINAS Y ENFOQUE HIPERTROFIA) ---
    const bibliotecaEjercicios = [
        // Pecho Máquinas
        {
            id: "ej_M_P_001", nombre: "Press de Pecho en Máquina Convergente",
            musculosTrabajados: ["Pecho", "Hombros (Anterior)", "Tríceps"], equipamiento: ["Máquina Press Pecho"],
            descripcion: "1. Ajuste: Altura del asiento para que los agarres queden a la altura media del pecho.\n2. Movimiento: Empuja los agarres hacia adelante y ligeramente hacia adentro (si es convergente), contrayendo el pecho. Controla la fase excéntrica (vuelta).\n3. Respiración: Exhala al empujar, inhala al regresar.\n4. Hipertrofia: Enfócate en la contracción y el rango completo. Mantén la tensión.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Chest+Press", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_P_002", nombre: "Contractora de Pectoral (Peck Deck)",
            musculosTrabajados: ["Pecho (Interno)"], equipamiento: ["Máquina Peck Deck"],
            descripcion: "1. Ajuste: Asiento para que los hombros estén alineados con los pivotes de los brazos de la máquina.\n2. Movimiento: Junta los brazos de la máquina al frente, apretando los pectorales. Mantén una ligera flexión en los codos.\n3. Retorno: Abre lentamente sintiendo el estiramiento.\n4. Hipertrofia: Contracción máxima en el punto de unión. Movimiento controlado.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Peck+Deck+Fly", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_P_003", nombre: "Press Inclinado en Máquina (Smith o Selectorizada)",
            musculosTrabajados: ["Pecho Superior", "Hombros (Anterior)", "Tríceps"], equipamiento: ["Máquina Press Inclinado", "Máquina Smith"],
            descripcion: "1. Ajuste: Similar al press inclinado con mancuernas, enfocado en el haz clavicular del pectoral.\n2. Movimiento: Empuja los agarres o la barra hacia arriba y adelante. Controla la bajada.\n3. Hipertrofia: Permite cargar más peso de forma segura que con peso libre a veces. Siente el trabajo en el pecho superior.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Incline+Machine+Press", series: 3, repeticiones: "8-12", descanso: 75
        },

        // Espalda Máquinas
        {
            id: "ej_M_E_001", nombre: "Jalón Dorsal al Frente (Polea Alta)",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps"], equipamiento: ["Máquina Poleas (Jalón)"],
            descripcion: "1. Agarre: Ancho, prono (palmas hacia afuera).\n2. Movimiento: Tira de la barra hacia la parte superior del pecho, llevando los codos hacia abajo y atrás. Contrae la espalda.\n3. Retorno: Controla la subida de la barra, extendiendo completamente los dorsales.\n4. Hipertrofia: Enfócate en la retracción escapular y en 'tirar con los codos'.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Lat+Pulldown+Front", series: 4, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_E_002", nombre: "Remo Sentado en Máquina (con apoyo pectoral)",
            musculosTrabajados: ["Espalda (Media, Romboides, Dorsales)", "Bíceps"], equipamiento: ["Máquina Remo Sentado"],
            descripcion: "1. Ajuste: Asiento para que el apoyo pectoral permita un rango completo. Agarra los manerales (varios agarres posibles).\n2. Movimiento: Tira de los manerales hacia tu cuerpo, juntando los omóplatos. Mantén el pecho apoyado.\n3. Hipertrofia: Contracción fuerte en la espalda. Varía los agarres para diferentes estímulos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Seated+Row", series: 3, repeticiones: "10-12", descanso: 60
        },
        {
            id: "ej_M_E_003", nombre: "Pullover en Máquina o con Polea Alta",
            musculosTrabajados: ["Espalda (Dorsales)", "Pecho (Serrato)"], equipamiento: ["Máquina Pullover", "Máquina Poleas"],
            descripcion: "1. Movimiento: Con brazos casi rectos, lleva la barra o agarre desde arriba de la cabeza hacia abajo en un arco, contrayendo los dorsales.\n2. Hipertrofia: Excelente para aislar los dorsales y trabajar el serrato. Movimiento controlado.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Pullover", series: 3, repeticiones: "12-15", descanso: 60
        },

        // Piernas Máquinas
        {
            id: "ej_M_PI_001", nombre: "Prensa de Piernas Inclinada (45 Grados)",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales"], equipamiento: ["Máquina Prensa Piernas"],
            descripcion: "1. Posición Pies: Varía para enfocar músculos (altos y anchos para glúteos/isquios; bajos y juntos para cuádriceps).\n2. Movimiento: Baja la plataforma controladamente hasta una buena profundidad. Empuja sin bloquear rodillas.\n3. Hipertrofia: Permite mover mucho peso. Controla la fase excéntrica.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Leg+Press+45", series: 4, repeticiones: "10-15", descanso: 90
        },
        {
            id: "ej_M_PI_002", nombre: "Extensiones de Cuádriceps en Máquina",
            musculosTrabajados: ["Cuádriceps"], equipamiento: ["Máquina Extensiones Cuádriceps"],
            descripcion: "1. Movimiento: Extiende las piernas completamente, apretando los cuádriceps en la cima (isométrica de 1-2 seg).\n2. Retorno: Baja lentamente.\n3. Hipertrofia: Aislamiento puro del cuádriceps. No uses impulso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Leg+Extensions", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_M_PI_003", nombre: "Curl Femoral Tumbado o Sentado en Máquina",
            musculosTrabajados: ["Isquiotibiales"], equipamiento: ["Máquina Curl Femoral"],
            descripcion: "1. Movimiento: Flexiona las rodillas, llevando los talones hacia los glúteos. Contrae los isquios.\n2. Retorno: Extiende lentamente.\n3. Hipertrofia: Siente la contracción en los isquiotibiales. Evita levantar la cadera.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Leg+Curls+Machine", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_PI_004", nombre: "Máquina de Gemelos (Sentado o De pie)",
            musculosTrabajados: ["Gemelos (Sóleo, Gastrocnemio)"], equipamiento: ["Máquina Gemelos"],
            descripcion: "1. Movimiento: Elévate sobre las puntas de los pies lo más alto posible. Pausa en la cima.\n2. Retorno: Baja lentamente sintiendo el estiramiento.\n3. Hipertrofia: Rango completo y contracción máxima. Varía entre sentado (sóleo) y de pie (gastrocnemio).",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Calf+Raise+Machine", series: 4, repeticiones: "15-25", descanso: 45
        },
        {
            id: "ej_M_PI_005", nombre: "Hack Squat en Máquina",
            musculosTrabajados: ["Cuádriceps", "Glúteos"], equipamiento: ["Máquina Hack Squat"],
            descripcion: "1. Posición: Espalda bien apoyada, pies en la plataforma (varía posición para énfasis).\n2. Movimiento: Baja controladamente hasta una buena profundidad. Empuja a través de toda la planta del pie.\n3. Hipertrofia: Excelente para cuádriceps con menos estrés en la espalda baja que la sentadilla libre.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Hack+Squat", series: 3, repeticiones: "8-12", descanso: 90
        },

        // Hombros Máquinas
        {
            id: "ej_M_H_001", nombre: "Press de Hombros en Máquina (Shoulder Press Machine)",
            musculosTrabajados: ["Hombros (Deltoides)", "Tríceps"], equipamiento: ["Máquina Press Hombros"],
            descripcion: "1. Ajuste: Asiento para que los agarres estén a la altura de los hombros.\n2. Movimiento: Empuja los agarres hacia arriba hasta casi la extensión completa. Controla la bajada.\n3. Hipertrofia: Movimiento estable que permite concentrarse en los deltoides.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Shoulder+Press+Machine", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_H_002", nombre: "Elevaciones Laterales en Máquina o Polea Baja",
            musculosTrabajados: ["Hombros (Deltoides Lateral)"], equipamiento: ["Máquina Elev. Laterales", "Máquina Poleas"],
            descripcion: "1. Movimiento: Con la máquina, eleva los brazos/almohadillas lateralmente. Con polea, usa un agarre individual y eleva el brazo lateralmente.\n2. Hipertrofia: Tensión constante en el deltoides lateral. Movimiento controlado, sin impulso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Lateral+Raise", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_M_H_003", nombre: "Pájaros en Máquina Contractora Inversa (Reverse Peck Deck)",
            musculosTrabajados: ["Hombros (Deltoides Posterior)", "Trapecio Medio"], equipamiento: ["Máquina Peck Deck (inversa)"],
            descripcion: "1. Ajuste: Siéntate de cara a la máquina. Agarra los manerales con agarre neutro o prono.\n2. Movimiento: Abre los brazos hacia atrás, juntando los omóplatos. Enfócate en los deltoides posteriores.\n3. Hipertrofia: Aislamiento efectivo para la parte trasera del hombro.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Reverse+Peck+Deck", series: 3, repeticiones: "12-15", descanso: 60
        },

        // Bíceps Máquinas/Poleas
        {
            id: "ej_M_B_001", nombre: "Curl de Bíceps en Máquina (Predicador o Selectorizada)",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Máquina Curl Bíceps"],
            descripcion: "1. Ajuste: Asiento para que los brazos estén bien apoyados en el cojín (si es predicador).\n2. Movimiento: Flexiona los brazos, contrayendo los bíceps al máximo. Baja controladamente.\n3. Hipertrofia: Aísla bien el bíceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Bicep+Curl", series: 3, repeticiones: "10-12", descanso: 60
        },
        {
            id: "ej_M_B_002", nombre: "Curl de Bíceps con Barra en Polea Baja",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Máquina Poleas", "Barra Recta o EZ"],
            descripcion: "1. Movimiento: Similar al curl con barra libre, pero la polea ofrece tensión constante.\n2. Hipertrofia: Excelente para mantener tensión durante todo el rango de movimiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Bicep+Curl", series: 3, repeticiones: "10-15", descanso: 60
        },

        // Tríceps Máquinas/Poleas
        {
            id: "ej_M_T_001", nombre: "Extensiones de Tríceps en Polea Alta (Pushdown con Barra o Cuerda)",
            musculosTrabajados: ["Tríceps"], equipamiento: ["Máquina Poleas", "Barra Recta/V/Cuerda"],
            descripcion: "1. Movimiento: Mantén los codos pegados al cuerpo y extiende los brazos completamente hacia abajo. Aprieta los tríceps.\n2. Retorno: Controla la subida.\n3. Hipertrofia: Varía los agarres para estimular diferentes cabezas del tríceps (cuerda para cabeza lateral/larga, barra V para medial).",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Tricep+Pushdown", series: 4, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_T_002", nombre: "Press Francés en Máquina o Polea Baja (Extensión sobre cabeza)",
            musculosTrabajados: ["Tríceps (Cabeza Larga)"], equipamiento: ["Máquina específica", "Máquina Poleas", "Cuerda"],
            descripcion: "1. Movimiento: Con polea baja y cuerda, de espaldas a la máquina, extiende los brazos sobre la cabeza. Si es máquina, sigue su recorrido.\n2. Hipertrofia: Gran estiramiento y trabajo para la cabeza larga del tríceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Overhead+Cable+Tricep", series: 3, repeticiones: "10-12", descanso: 75
        },

        // Abdominales Máquinas
        {
            id: "ej_M_A_001", nombre: "Encogimientos (Crunches) en Máquina Abdominal",
            musculosTrabajados: ["Abdominales (Recto Abdominal)"], equipamiento: ["Máquina Abdominales"],
            descripcion: "1. Ajuste: Configura la máquina según tu altura.\n2. Movimiento: Flexiona el torso contrayendo los abdominales. Exhala al contraer.\n3. Hipertrofia: Permite añadir carga progresiva a los encogimientos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Ab+Crunch", series: 3, repeticiones: "12-20", descanso: 45
        },
        {
            id: "ej_M_A_002", nombre: "Rotaciones de Torso en Máquina (Rotary Torso)",
            musculosTrabajados: ["Abdominales (Oblicuos)"], equipamiento: ["Máquina Rotary Torso"],
            descripcion: "1. Movimiento: Gira el torso controladamente hacia un lado, contrayendo los oblicuos. Regresa lentamente y repite al otro lado.\n2. Hipertrofia: Trabaja los oblicuos de forma aislada.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Rotary+Torso+Machine", series: 3, repeticiones: "10-15 c/lado", descanso: 45
        },
        // Ejercicios de Peso Libre y Cuerpo que ya estaban (ajustados para hipertrofia)
        {
            id: "ej_P_001_H", nombre: "Flexiones (Push-ups)", 
            musculosTrabajados: ["Pecho", "Hombros", "Tríceps"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición: Manos ligeramente más anchas que los hombros. Cuerpo recto.\n2. Movimiento: Baja controladamente (2-3 seg) hasta que el pecho casi toque el suelo. Siente la tensión en el pecho.\n3. Retorno: Empuja explosivamente hacia arriba.\n4. Respiración: Inhala al bajar, exhala al subir.\n5. Clave Hipertrofia: Concéntrate en la contracción del pectoral. Considera añadir lastre si se vuelven muy fáciles para el rango de 8-15 reps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Flexiones+Hipertrofia", series: 3, repeticiones: "8-15 (al fallo o RIR 1-2)", descanso: 60
        },
        {
            id: "ej_B_002_H", nombre: "Curl de Bíceps con Mancuernas (Supinación)",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Mancuernas"],
            descripcion: "1. Movimiento: Comienza con agarre neutro (palmas enfrentadas) y supina (gira las palmas hacia arriba) mientras subes la mancuerna. Contrae el bíceps.\n2. Retorno: Baja lentamente, revirtiendo el movimiento.\n3. Clave Hipertrofia: La supinación activa más el pico del bíceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Curl+Biceps+Manc+Sup+H", series: 3, repeticiones: "8-12 c/brazo", descanso: 60
        },
        {
            id: "ej_C_005", nombre: "Bicicleta Estática (Calentamiento)", 
            musculosTrabajados: ["Cardio", "Piernas"], equipamiento: ["Bicicleta Estática"],
            descripcion: "Mantén un ritmo constante y moderado. Ideal para calentamiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Bicicleta+Estatica", series: 1, repeticiones: "10 min", descanso: 0
        },
        {
            id: "ej_C_003", nombre: "Estiramientos Dinámicos", 
            musculosTrabajados: ["Movilidad Articular"], equipamiento: ["Peso Corporal"],
            descripcion: "Círculos de brazos, balanceos de piernas, rotaciones de torso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Dinamicos", series: 1, repeticiones: "5 min", descanso: 0
        },
        {
            id: "ej_C_004", nombre: "Estiramientos Estáticos", 
            musculosTrabajados: ["Flexibilidad"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "Mantén cada estiramiento por 20-30 segundos para los músculos trabajados.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Estaticos", series: 1, repeticiones: "5-7 min", descanso: 0
        },
    ];

    // --- PLANES DE ENTRENAMIENTO (HIPERTROFIA - ENFOQUE MÁQUINAS PARA GYM) ---
    const planesEntrenamiento = {
        casa: { // Rutinas de casa adaptadas para hipertrofia
            lunes: { id: "casa_lun", nombre: "Empuje Casa (Pecho, Hombros, Tríceps)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_P_001_H", series: 4, reps: "8-15" }, { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (con peso improvisado)" }, { id_ejercicio: "ej_T_003", series: 3, reps: "8-15 (fondos sillas)" } ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            martes: { id: "casa_mar", nombre: "Tirón Casa (Espalda, Bíceps)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_E_005", series: 4, reps: "8-12" }, { id_ejercicio: "ej_B_002_H", series: 3, reps: "10-15 c/b" } ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
             miercoles: { id: "casa_mie", nombre: "Piernas Casa (General)", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_PI_008", reps: "15 (sin peso)"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_PI_008", series: 4, reps: "10-15" }, { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/p" }, { id_ejercicio: "ej_PI_002", series: 3, reps: "12-15 (con peso improvisado)" }, { id_ejercicio: "ej_PI_007", series: 4, reps: "15-20" } ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            jueves: { id: "casa_jue", nombre: "Hombros y Abdominales Casa", diaSemanaComparable: 4, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (con peso improvisado)" }, { id_ejercicio: "ej_H_003", series: 3, reps: "12-15" }, { id_ejercicio: "ej_A_001", series: 3, reps: "45-60s" }, { id_ejercicio: "ej_A_003", series: 3, reps: "12-15" } ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            viernes: { id: "casa_vie", nombre: "Full Body Casa (Variado)", diaSemanaComparable: 5, componentes: [ 
                 { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_P_001_H", series: 3, reps: "8-12" }, { id_ejercicio: "ej_E_005", series: 3, reps: "8-12" }, { id_ejercicio: "ej_PI_008", series: 3, reps: "10-12" }, { id_ejercicio: "ej_B_002_H", series: 2, reps: "10-12 c/b" }, { id_ejercicio: "ej_A_002", series: 3, reps: "15-20" } ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            sabado: { id: "casa_sab", nombre: "Descanso o Cardio Ligero Casa", diaSemanaComparable: 6, componentes: [
                 { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_003", reps: "5 min"}] },
                 { tipo: "Principal", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "20-30 min (opcional)" } ]},
                 { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
        },
        gimnasio: { 
            lunes: { id: "gym_lun", nombre: "Pecho y Hombro (Anterior/Medial) - Máquinas", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_P_001", series: 4, reps: "8-12" },    
                    { id_ejercicio: "ej_M_P_003", series: 3, reps: "10-12" },   
                    { id_ejercicio: "ej_M_P_002", series: 3, reps: "10-15" },   
                    { id_ejercicio: "ej_M_H_001", series: 3, reps: "8-12" },   
                    { id_ejercicio: "ej_M_H_002", series: 4, reps: "12-15" }    
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            martes: { id: "gym_mar", nombre: "Espalda (Ancho y Densidad) - Máquinas", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_E_001", series: 4, reps: "8-12 (variar agarre)" }, 
                    { id_ejercicio: "ej_E_002", series: 3, reps: "6-10 (si hay barra T o normal)" }, 
                    { id_ejercicio: "ej_M_E_002", series: 3, reps: "10-12 (agarre neutro o prono)" }, 
                    { id_ejercicio: "ej_M_E_003", series: 3, reps: "12-15" }    
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            miercoles: { id: "gym_mie", nombre: "Piernas (Completo) - Máquinas", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_PI_001", series: 4, reps: "8-12 (pesado)" }, 
                    { id_ejercicio: "ej_M_PI_005", series: 3, reps: "10-12" }, 
                    { id_ejercicio: "ej_M_PI_002", series: 3, reps: "12-15" }, 
                    { id_ejercicio: "ej_M_PI_003", series: 3, reps: "10-15" }, 
                    { id_ejercicio: "ej_M_PI_004", series: 4, reps: "12-20" }  
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            jueves: { id: "gym_jue", nombre: "Brazos (Bíceps y Tríceps) - Poleas/Máquinas", diaSemanaComparable: 4, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min (enfocar brazos)"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_B_001", series: 3, reps: "8-12" },   
                    { id_ejercicio: "ej_M_B_002", series: 3, reps: "10-12 (con barra recta)" }, 
                    { id_ejercicio: "ej_B_002_H", series: 3, reps: "10-12 c/b (curl mancuerna inclinado)"}, 
                    { id_ejercicio: "ej_M_T_001", series: 4, reps: "8-12 (con barra V)" },    
                    { id_ejercicio: "ej_M_T_002", series: 3, reps: "10-15 (ext. sobre cabeza con cuerda)" }, 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            viernes: { id: "gym_vie", nombre: "Hombros (Completo) y Abdominales - Máquinas", diaSemanaComparable: 5, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min (enfocar hombros)"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_H_001", series: 4, reps: "8-10" },    
                    { id_ejercicio: "ej_M_H_002", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_M_H_003", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_H_004", series: 3, reps: "10-12 (elev. frontales con disco o mancuerna)" }, 
                    { id_ejercicio: "ej_M_A_001", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_M_A_002", series: 3, reps: "10-12 c/lado" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            sabado: { id: "gym_sab", nombre: "Full Body con Máquinas (Volumen Moderado)", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [ 
                    { id_ejercicio: "ej_M_PI_001", series: 3, reps: "10-12" }, 
                    { id_ejercicio: "ej_M_P_001", series: 3, reps: "10-12" },  
                    { id_ejercicio: "ej_M_E_001", series: 3, reps: "10-12" },  
                    { id_ejercicio: "ej_M_H_001", series: 2, reps: "12-15" },  
                    { id_ejercicio: "ej_M_B_002", series: 2, reps: "12-15" },  
                    { id_ejercicio: "ej_M_T_001", series: 2, reps: "12-15" }   
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
        }
    };

    // --- ELEMENTOS DEL DOM ---
    // (Sin cambios desde la versión anterior)
    const cronometroEntrenamientoGeneralDisplay = document.getElementById('cronometro-entrenamiento-general');
    const cronometroEjercicioActualDisplay = document.getElementById('cronometro-ejercicio-actual');
    const selectDiasEntrenamiento = document.getElementById('select-dias-entrenamiento');
    const inputUserName = document.getElementById('input-user-name');
    const diasMetaSemanaDisplay = document.getElementById('dias-meta-semana');
    const btnCerrarModalBiblioteca = document.getElementById('btn-cerrar-modal-biblioteca');
    //const btnSeleccionarEjercicioModal = document.getElementById('btn-seleccionar-ejercicio-modal'); // No se usa
    const headerTitle = document.getElementById('header-title');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const userNameDisplay = document.getElementById('user-name-display');
    const appNameInput = document.getElementById('input-nombre-app');
    const entrenamientoHoyContainer = document.getElementById('entrenamiento-hoy-container');
    const entrenamientosCompletadosSemanaDisplay = document.getElementById('entrenamientos-completados-semana');
    const btnVerRutinasDesdeHoy = document.getElementById('btn-ver-rutinas-desde-hoy');
    const btnSelectPlanCasa = document.getElementById('btn-select-plan-casa');
    const btnSelectPlanGimnasio = document.getElementById('btn-select-plan-gimnasio');
    const rutinasPlanTitle = document.getElementById('rutinas-plan-title');
    const calendarioRutinasContainer = document.getElementById('calendario-rutinas-container');
    const detallesEntrenamientoDiaSection = document.getElementById('detalles-entrenamiento-dia-section');
    const btnVolverARutinas = document.getElementById('btn-volver-a-rutinas');
    const detalleDiaNombreRutina = document.getElementById('detalle-dia-nombre-rutina');
    const detalleDiaTipoPlan = document.getElementById('detalle-dia-tipo-plan');
    const listaEjerciciosDiaContainer = document.getElementById('lista-ejercicios-dia-container');
    const btnComenzarEntrenamientoDia = document.getElementById('btn-comenzar-entrenamiento-dia');
    const btnGuardarCambiosRutina = document.getElementById('btn-guardar-cambios-rutina');
    const btnRestablecerRutinaDefault = document.getElementById('btn-restablecer-rutina-default');
    const entrenamientoEnProgresoSection = document.getElementById('entrenamiento-en-progreso-section');
    const ejercicioActualNombre = document.getElementById('ejercicio-actual-nombre');
    const ejercicioActualImagen = document.getElementById('ejercicio-actual-imagen');
    const ejercicioActualDescripcion = document.getElementById('ejercicio-actual-descripcion');
    const ejercicioActualSeriesReps = document.getElementById('ejercicio-actual-series-reps');
    const temporizadorDescansoContainer = document.getElementById('temporizador-descanso-container');
    const temporizadorDisplay = document.getElementById('temporizador-display');
    const btnSaltarDescanso = document.getElementById('btn-saltar-descanso');
    const btnEjercicioAnterior = document.getElementById('btn-ejercicio-anterior');
    const btnMarcarSerieCompletada = document.getElementById('btn-marcar-serie-completada');
    const btnSiguienteEjercicio = document.getElementById('btn-siguiente-ejercicio');
    const btnFinalizarEntrenamiento = document.getElementById('btn-finalizar-entrenamiento');
    const inputBuscarBiblioteca = document.getElementById('input-buscar-biblioteca');
    const selectFiltroGrupoMuscular = document.getElementById('select-filtro-grupo-muscular');
    const selectFiltroEquipamiento = document.getElementById('select-filtro-equipamiento');
    const listaBibliotecaEjerciciosContainer = document.getElementById('lista-biblioteca-ejercicios-container');
    const detalleEjercicioModal = document.getElementById('detalle-ejercicio-biblioteca-modal');
    const modalEjercicioNombre = document.getElementById('modal-ejercicio-nombre');
    const modalEjercicioImagen = document.getElementById('modal-ejercicio-imagen');
    const modalEjercicioMusculos = document.getElementById('modal-ejercicio-musculos');
    const modalEjercicioEquipamiento = document.getElementById('modal-ejercicio-equipamiento');
    const modalEjercicioDescripcion = document.getElementById('modal-ejercicio-descripcion');
    const selectUnidadesPeso = document.getElementById('select-unidades-peso');
    const btnGuardarAjustes = document.getElementById('btn-guardar-ajustes');
    const btnRestablecerProgresoTotal = document.getElementById('btn-restablecer-progreso-total');


    // --- FUNCIONES (Lógica principal sin cambios mayores, adaptaciones en renderizado y manejo de estado para nuevas features) ---
    function guardarEstado() {
        localStorage.setItem('entrenadorFitnessAppState_v8_hipertrofiaMaquinas', JSON.stringify(appState));
    }

    function cargarEstado() {
        const estadoGuardado = localStorage.getItem('entrenadorFitnessAppState_v8_hipertrofiaMaquinas');
        const estadoPorDefecto = {
            nombreUsuario: "Atleta Máquina", appName: "Gym Máster Pro", unidadesPeso: "kg",
            planActivoGeneral: "gimnasio", diasEntrenamiento: 6, entrenamientosCompletados: {},
            rutinasPersonalizadas: {}, 
            entrenamientoActual: null, entrenamientoActualOriginalId: null,
            componentesEnEdicion: [], indiceComponenteActual: 0,
            indiceEjercicioActualEnComponente: 0, serieActual: 1, timerDescansoActivo: null,
            tiempoRestanteDescanso: 0, cronometroEntrenamientoGeneralActivo: null,
            tiempoTotalEntrenamientoSegundos: 0, cronometroEjercicioActualActivo: null,
            tiempoEjercicioActualSegundos: 0,
            modificandoEjercicio: { activo: false, compIndex: null, ejIndex: null, idEjercicioAbiertoEnModal: null }
        };
        if (estadoGuardado) {
            const estadoParseado = JSON.parse(estadoGuardado);
            appState = { ...estadoPorDefecto, ...estadoParseado };
            appState.entrenamientosCompletados = estadoParseado.entrenamientosCompletados || {};
            appState.rutinasPersonalizadas = estadoParseado.rutinasPersonalizadas || {};
            appState.diasEntrenamiento = parseInt(appState.diasEntrenamiento) || 6;
        } else {
            appState = estadoPorDefecto;
        }
        appState.timerDescansoActivo = null;
        appState.cronometroEntrenamientoGeneralActivo = null;
        appState.cronometroEjercicioActualActivo = null;
    }

    function cambiarPestana(tabId) {
        tabContents.forEach(content => content.classList.remove('active-tab'));
        const currentTabContent = document.getElementById(tabId);
        if (currentTabContent) currentTabContent.classList.add('active-tab');

        tabButtons.forEach(button => button.classList.remove('active'));
        const currentTabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (currentTabButton) {
            currentTabButton.classList.add('active');
            headerTitle.textContent = currentTabButton.querySelector('span').textContent;
        }
        
        if (tabId === 'hoy-section') renderPantallaHoy();
        if (tabId === 'rutinas-section') renderPantallaRutinas();
        if (tabId === 'biblioteca-section') renderPantallaBiblioteca();
        if (tabId === 'ajustes-section') renderPantallaAjustes();
    }

    function getEjercicioById(id) {
        return bibliotecaEjercicios.find(ej => ej.id === id);
    }
    
    function formatTiempo(totalSegundos) {
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    function formatTiempoGeneral(totalSegundos) {
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);
        const segundos = totalSegundos % 60;
        let tiempoFormateado = "";
        if (horas > 0) tiempoFormateado += `${horas.toString().padStart(2, '0')}:`;
        tiempoFormateado += `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        return tiempoFormateado;
    }

    function iniciarCronometroGeneral() {
        if (appState.cronometroEntrenamientoGeneralActivo) clearInterval(appState.cronometroEntrenamientoGeneralActivo);
        cronometroEntrenamientoGeneralDisplay.textContent = `Total: ${formatTiempoGeneral(appState.tiempoTotalEntrenamientoSegundos)}`;
        cronometroEntrenamientoGeneralDisplay.style.display = 'block';
        appState.cronometroEntrenamientoGeneralActivo = setInterval(() => {
            appState.tiempoTotalEntrenamientoSegundos++;
            cronometroEntrenamientoGeneralDisplay.textContent = `Total: ${formatTiempoGeneral(appState.tiempoTotalEntrenamientoSegundos)}`;
        }, 1000);
    }

    function detenerCronometroGeneral() {
        if (appState.cronometroEntrenamientoGeneralActivo) {
            clearInterval(appState.cronometroEntrenamientoGeneralActivo);
            appState.cronometroEntrenamientoGeneralActivo = null;
        }
    }

    function iniciarCronometroEjercicioActual() {
        if (appState.cronometroEjercicioActualActivo) clearInterval(appState.cronometroEjercicioActualActivo);
        appState.tiempoEjercicioActualSegundos = 0;
        cronometroEjercicioActualDisplay.textContent = `Ejercicio: ${formatTiempo(appState.tiempoEjercicioActualSegundos)}`;
        cronometroEjercicioActualDisplay.style.display = 'block';
        appState.cronometroEjercicioActualActivo = setInterval(() => {
            appState.tiempoEjercicioActualSegundos++;
            cronometroEjercicioActualDisplay.textContent = `Ejercicio: ${formatTiempo(appState.tiempoEjercicioActualSegundos)}`;
        }, 1000);
    }

    function detenerCronometroEjercicioActual() {
        if (appState.cronometroEjercicioActualActivo) {
            clearInterval(appState.cronometroEjercicioActualActivo);
            appState.cronometroEjercicioActualActivo = null;
        }
    }

    function renderPantallaHoy() {
        userNameDisplay.textContent = appState.nombreUsuario;
        document.title = appState.appName;
        headerTitle.textContent = "Hoy";
        diasMetaSemanaDisplay.textContent = appState.diasEntrenamiento;
        
        const hoyDate = new Date();
        const diaNumero = hoyDate.getDay(); 
        const diasSemanaNombres = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
        const hoyNombre = diasSemanaNombres[diaNumero];

        let rutinaDelDiaId = `${appState.planActivoGeneral}_${hoyNombre.substring(0,3)}`;
        let planDelDiaPredeterminado = planesEntrenamiento[appState.planActivoGeneral]?.[hoyNombre];
        let planDelDia = appState.rutinasPersonalizadas[rutinaDelDiaId] || planDelDiaPredeterminado;
        
        if (appState.diasEntrenamiento === 5 && hoyNombre === "sabado") {
            planDelDia = { nombre: "Descanso", id: "descanso_sab" };
        }

        if (planDelDia && planDelDia.componentes && planDelDia.componentes.length > 0 && planDelDia.nombre !== "Descanso") {
            // Usar el ID original del plan predeterminado para chequear si está completado.
            // Las rutinas personalizadas heredan el ID del plan original (ej. "gym_lun")
            // pero el estado de completado se guarda contra el ID del plan original.
            const idOriginalParaCompletado = planDelDiaPredeterminado?.id || planDelDia.id;
            const completado = appState.entrenamientosCompletados[idOriginalParaCompletado];

            entrenamientoHoyContainer.innerHTML = `
                <h3>Tu Entrenamiento: ${planDelDia.nombre} (${appState.planActivoGeneral === 'casa' ? 'Casa' : 'Gym'})</h3>
                <p>${completado ? "¡Completado! 🎉" : "Pendiente"}</p>
                ${!completado ? `<button class="btn btn-start-workout" data-dia="${hoyNombre}" data-plan="${appState.planActivoGeneral}">Iniciar Entrenamiento</button>` : ''}
            `;
            if (!completado) {
                const btnStart = entrenamientoHoyContainer.querySelector('.btn-start-workout');
                if(btnStart) {
                    btnStart.addEventListener('click', (e) => {
                        const dia = e.target.dataset.dia;
                        const plan = e.target.dataset.plan;
                        appState.tiempoTotalEntrenamientoSegundos = 0; 
                        iniciarEntrenamiento(plan, dia);
                    });
                }
            }
        } else {
            entrenamientoHoyContainer.innerHTML = `<h3>Hoy es Día de Descanso. ¡A recargar!</h3>`;
        }
        actualizarResumenSemanal();
    }
    
    function actualizarResumenSemanal() {
        let completados = 0;
        const diasOrdenadosNombres = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        
        for (let i=0; i < appState.diasEntrenamiento; i++) {
            const diaNombre = diasOrdenadosNombres[i];
            const rutinaIdOriginal = planesEntrenamiento[appState.planActivoGeneral]?.[diaNombre]?.id;
            if (rutinaIdOriginal && appState.entrenamientosCompletados[rutinaIdOriginal]) {
                completados++;
            }
        }
        entrenamientosCompletadosSemanaDisplay.textContent = completados;
        diasMetaSemanaDisplay.textContent = appState.diasEntrenamiento;
    }

    function renderPantallaRutinas() {
        rutinasPlanTitle.textContent = `Plan ${appState.planActivoGeneral === 'casa' ? 'Casa' : 'Gimnasio'} (${appState.diasEntrenamiento} días)`;
        calendarioRutinasContainer.innerHTML = '';
        const diasOrdenadosNombres = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        
        for (let i = 0; i < diasOrdenadosNombres.length; i++) {
            const diaNombre = diasOrdenadosNombres[i];
            
            if (appState.diasEntrenamiento === 5 && diaNombre === 'sabado') {
                const diaDiv = document.createElement('div');
                diaDiv.classList.add('card', 'rutina-dia-item', 'rutina-descanso');
                diaDiv.innerHTML = `<h4>Sábado</h4> <p>Descanso</p>`;
                calendarioRutinasContainer.appendChild(diaDiv);
                continue; 
            }
            if (i >= appState.diasEntrenamiento) {
                 continue;
            }

            const rutinaId = `${appState.planActivoGeneral}_${diaNombre.substring(0,3)}`;
            const rutinaPredeterminada = planesEntrenamiento[appState.planActivoGeneral]?.[diaNombre];
            const rutinaDia = appState.rutinasPersonalizadas[rutinaId] || rutinaPredeterminada;

            if (rutinaDia && rutinaDia.nombre && rutinaDia.componentes) {
                const idOriginalParaCompletado = rutinaPredeterminada.id;
                const completado = appState.entrenamientosCompletados[idOriginalParaCompletado];
                const diaDiv = document.createElement('div');
                diaDiv.classList.add('card', 'rutina-dia-item');
                
                if (rutinaDia.nombre === "Descanso") { 
                    diaDiv.innerHTML = `<h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4> <p>Descanso</p>`;
                    diaDiv.classList.add('rutina-descanso');
                } else {
                     diaDiv.innerHTML = `
                        <h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4>
                        <p>${rutinaDia.nombre} ${appState.rutinasPersonalizadas[rutinaId] ? '<i class="fas fa-user-edit" title="Rutina Personalizada"></i>' : ''}</p>
                        <p style="color: ${completado ? 'var(--success-color)' : 'var(--secondary-color)'}; font-weight: bold;">
                            ${completado ? 'Completado <i class="fas fa-check-circle"></i>' : 'Pendiente'}
                        </p>
                    `;
                    diaDiv.addEventListener('click', () => renderDetallesEntrenamientoDia(appState.planActivoGeneral, diaNombre));
                }
                calendarioRutinasContainer.appendChild(diaDiv);
            }
        }
        btnSelectPlanCasa.classList.toggle('active', appState.planActivoGeneral === 'casa');
        btnSelectPlanGimnasio.classList.toggle('active', appState.planActivoGeneral === 'gimnasio');
    }

    function renderDetallesEntrenamientoDia(plan, dia) {
        const rutinaId = `${plan}_${dia.substring(0,3)}`;
        const rutinaPredeterminada = planesEntrenamiento[plan]?.[dia];
        const rutinaPersonalizada = appState.rutinasPersonalizadas[rutinaId];
        const rutinaAVisualizar = rutinaPersonalizada || rutinaPredeterminada;

        if (!rutinaAVisualizar || !rutinaAVisualizar.componentes || rutinaAVisualizar.nombre === "Descanso") {
            alert("Este es un día de descanso o no tiene detalles configurados.");
            cambiarPestana('rutinas-section');
            return;
        }

        appState.componentesEnEdicion = JSON.parse(JSON.stringify(rutinaAVisualizar.componentes));
        appState.entrenamientoActual = { ...rutinaAVisualizar, plan: plan, dia: dia, id: rutinaId }; 
        appState.entrenamientoActualOriginalId = rutinaPredeterminada.id;

        detalleDiaNombreRutina.textContent = rutinaAVisualizar.nombre;
        detalleDiaTipoPlan.textContent = `Plan: ${plan === 'casa' ? 'En Casa' : 'De Gimnasio'} ${rutinaPersonalizada ? '(Personalizada)' : ''}`;
        listaEjerciciosDiaContainer.innerHTML = '';

        appState.componentesEnEdicion.forEach((componente, indexComp) => {
            const compDiv = document.createElement('div');
            compDiv.classList.add('componente-dia');
            compDiv.innerHTML = `<h3>${componente.tipo}</h3>`;
            const ul = document.createElement('ul');
            ul.classList.add('lista-ejercicios-componente');

            componente.ejercicios.forEach((ejDef, indexEj) => {
                const ejercicioData = getEjercicioById(ejDef.id_ejercicio);
                if (ejercicioData) {
                    const li = document.createElement('li');
                    li.classList.add('ejercicio-item');
                    li.innerHTML = `
                        <div class="ejercicio-item-info">
                            <strong class="ejercicio-nombre-link" data-ejercicio-id="${ejercicioData.id}" title="Ver detalles del ejercicio">${ejercicioData.nombre}</strong>
                            <span>Series: ${ejDef.series || ejercicioData.series}, Reps: ${ejDef.reps || ejercicioData.repeticiones}</span>
                        </div>
                        <div class="ejercicio-item-acciones">
                            <button class="btn btn-info btn-sm btn-reemplazar-ej" title="Reemplazar Ejercicio (Auto)" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-sync-alt"></i></button>
                            <button class="btn btn-warning btn-sm btn-cambiar-ej" title="Elegir Otro Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-exchange-alt"></i></button>
                            <button class="btn btn-danger btn-sm btn-quitar-ej" title="Quitar Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    ul.appendChild(li);
                }
            });
            
            const btnAnadirAlComponente = document.createElement('button');
            btnAnadirAlComponente.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-anadir-a-componente');
            btnAnadirAlComponente.innerHTML = '<i class="fas fa-plus"></i> Añadir Ejercicio';
            btnAnadirAlComponente.dataset.compIndex = indexComp;
            ul.appendChild(btnAnadirAlComponente);

            compDiv.appendChild(ul);
            listaEjerciciosDiaContainer.appendChild(compDiv);
        });
        
        asignarListenersBotonesEdicionYVista();
        
        btnRestablecerRutinaDefault.style.display = rutinaPersonalizada ? 'inline-block' : 'none';
        const completado = appState.entrenamientosCompletados[rutinaPredeterminada.id];
        btnComenzarEntrenamientoDia.textContent = completado ? 'Repetir Entrenamiento' : 'Comenzar con estos Ejercicios';
        btnComenzarEntrenamientoDia.className = completado ? 'btn btn-secondary' : 'btn btn-start-workout';
        cambiarPestana('detalles-entrenamiento-dia-section');
    }

    function asignarListenersBotonesEdicionYVista() {
        listaEjerciciosDiaContainer.querySelectorAll('.ejercicio-nombre-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const ejercicioId = e.currentTarget.dataset.ejercicioId;
                appState.modificandoEjercicio.activo = false;
                appState.modificandoEjercicio.idEjercicioAbiertoEnModal = ejercicioId;
                mostrarDetalleEjercicioBiblioteca(ejercicioId);
            });
        });

        listaEjerciciosDiaContainer.querySelectorAll('.btn-quitar-ej').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                const ejIndex = parseInt(e.currentTarget.dataset.ejIndex);
                quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex);
            });
        });
        listaEjerciciosDiaContainer.querySelectorAll('.btn-reemplazar-ej').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                const ejIndex = parseInt(e.currentTarget.dataset.ejIndex);
                reemplazarEjercicioAutomaticamente(compIndex, ejIndex);
            });
        });
        listaEjerciciosDiaContainer.querySelectorAll('.btn-cambiar-ej').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                const ejIndex = parseInt(e.currentTarget.dataset.ejIndex);
                abrirModalBibliotecaParaModificar(compIndex, ejIndex);
            });
        });
        listaEjerciciosDiaContainer.querySelectorAll('.btn-anadir-a-componente').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                abrirModalBibliotecaParaModificar(compIndex, null); 
            });
        });
    }


    function quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex) {
        if (appState.componentesEnEdicion?.[compIndex]?.ejercicios) {
            appState.componentesEnEdicion[compIndex].ejercicios.splice(ejIndex, 1);
            actualizarVistaListaEjerciciosDia(); 
        }
    }

    function reemplazarEjercicioAutomaticamente(compIndex, ejIndex) {
        if (!appState.componentesEnEdicion?.[compIndex]?.ejercicios?.[ejIndex]) return;
        
        const ejercicioActualDef = appState.componentesEnEdicion[compIndex].ejercicios[ejIndex];
        const ejercicioActualData = getEjercicioById(ejercicioActualDef.id_ejercicio);
        if (!ejercicioActualData) return;

        const musculosTarget = ejercicioActualData.musculosTrabajados;
        const equipamientoActualArray = Array.isArray(ejercicioActualData.equipamiento) ? ejercicioActualData.equipamiento : [ejercicioActualData.equipamiento];

        let alternativas = bibliotecaEjercicios.filter(ej => {
            return ej.id !== ejercicioActualData.id && 
                   musculosTarget.some(m => ej.musculosTrabajados.includes(m)) &&
                   !equipamientoActualArray.every(eq => (ej.equipamiento || []).includes(eq)); 
        });

        if (alternativas.length === 0) { 
            alternativas = bibliotecaEjercicios.filter(ej => {
                 return ej.id !== ejercicioActualData.id && musculosTarget.some(m => ej.musculosTrabajados.includes(m));
            });
        }
        
        alternativas.sort((a,b) => {
            const commonA = a.musculosTrabajados.filter(m => musculosTarget.includes(m)).length;
            const commonB = b.musculosTrabajados.filter(m => musculosTarget.includes(m)).length;
            if (commonB !== commonA) return commonB - commonA;
            if (!equipamientoActualArray.includes("Peso Corporal")) {
                const aHasNonBodyweight = (a.equipamiento || []).some(e => e !== "Peso Corporal");
                const bHasNonBodyweight = (b.equipamiento || []).some(e => e !== "Peso Corporal");
                if (aHasNonBodyweight && !bHasNonBodyweight) return -1;
                if (!aHasNonBodyweight && bHasNonBodyweight) return 1;
            }
            return 0;
        });

        if (alternativas.length > 0) {
            const nuevoEjercicioData = alternativas[0]; 
            appState.componentesEnEdicion[compIndex].ejercicios[ejIndex] = {
                id_ejercicio: nuevoEjercicioData.id,
                series: nuevoEjercicioData.series, 
                reps: nuevoEjercicioData.repeticiones
            };
            actualizarVistaListaEjerciciosDia();
            alert(`Ejercicio "${ejercicioActualData.nombre}" reemplazado por "${nuevoEjercicioData.nombre}".\nGuarda los cambios en la rutina si deseas que este cambio sea permanente.`);
        } else {
            alert("No se encontraron alternativas adecuadas con diferente equipamiento para el mismo grupo muscular.");
        }
    }
    
    function guardarCambiosRutinaActual() {
        if (!appState.entrenamientoActual || !appState.entrenamientoActual.id) {
            alert("No hay una rutina activa para guardar.");
            return;
        }
        const rutinaId = appState.entrenamientoActual.id;
        const rutinaModificadaParaGuardar = {
            ...appState.entrenamientoActual, 
            id: rutinaId, // Asegurar que el ID sea el correcto (ej. gym_lun)
            nombre: appState.entrenamientoActual.nombre, // Mantener el nombre original o el personalizado
            diaSemanaComparable: appState.entrenamientoActual.diaSemanaComparable,
            componentes: JSON.parse(JSON.stringify(appState.componentesEnEdicion)) 
        };
        
        appState.rutinasPersonalizadas[rutinaId] = rutinaModificadaParaGuardar;
        guardarEstado();
        alert("Cambios en la rutina guardados.");
        btnRestablecerRutinaDefault.style.display = 'inline-block';
        renderPantallaRutinas(); 
        detalleDiaTipoPlan.textContent = `Plan: ${appState.entrenamientoActual.plan === 'casa' ? 'En Casa' : 'De Gimnasio'} (Personalizada)`;
    }

    function restablecerRutinaActualADefault() {
        if (!appState.entrenamientoActual || !appState.entrenamientoActual.id) return;
        const rutinaId = appState.entrenamientoActual.id;
        if (appState.rutinasPersonalizadas[rutinaId]) {
            if (confirm("¿Restablecer esta rutina a su versión predeterminada?")) {
                delete appState.rutinasPersonalizadas[rutinaId];
                guardarEstado();
                renderDetallesEntrenamientoDia(appState.entrenamientoActual.plan, appState.entrenamientoActual.dia);
                alert("Rutina restablecida.");
                renderPantallaRutinas();
            }
        }
    }
    
    function actualizarVistaListaEjerciciosDia() { 
        if (!appState.entrenamientoActual) return; 
        listaEjerciciosDiaContainer.innerHTML = ''; 
        appState.componentesEnEdicion.forEach((componente, indexComp) => {
            const compDiv = document.createElement('div');
            compDiv.classList.add('componente-dia');
            compDiv.innerHTML = `<h3>${componente.tipo}</h3>`;
            const ul = document.createElement('ul');
            ul.classList.add('lista-ejercicios-componente');

            componente.ejercicios.forEach((ejDef, indexEj) => {
                const ejercicioData = getEjercicioById(ejDef.id_ejercicio);
                if (ejercicioData) {
                    const li = document.createElement('li');
                    li.classList.add('ejercicio-item');
                    li.innerHTML = `
                        <div class="ejercicio-item-info">
                             <strong class="ejercicio-nombre-link" data-ejercicio-id="${ejercicioData.id}" title="Ver detalles del ejercicio">${ejercicioData.nombre}</strong>
                            <span>Series: ${ejDef.series || ejercicioData.series}, Reps: ${ejDef.reps || ejercicioData.repeticiones}</span>
                        </div>
                        <div class="ejercicio-item-acciones">
                            <button class="btn btn-info btn-sm btn-reemplazar-ej" title="Reemplazar Ejercicio (Auto)" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-sync-alt"></i></button>
                            <button class="btn btn-warning btn-sm btn-cambiar-ej" title="Elegir Otro Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-exchange-alt"></i></button>
                            <button class="btn btn-danger btn-sm btn-quitar-ej" title="Quitar Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    ul.appendChild(li);
                }
            });
             const btnAnadirAlComponente = document.createElement('button');
            btnAnadirAlComponente.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-anadir-a-componente');
            btnAnadirAlComponente.innerHTML = '<i class="fas fa-plus"></i> Añadir Ejercicio';
            btnAnadirAlComponente.dataset.compIndex = indexComp;
            ul.appendChild(btnAnadirAlComponente);

            compDiv.appendChild(ul);
            listaEjerciciosDiaContainer.appendChild(compDiv);
        });
        asignarListenersBotonesEdicionYVista();
    }

    function abrirModalBibliotecaParaModificar(compIndex, ejIndex) { 
        appState.modificandoEjercicio.activo = true;
        appState.modificandoEjercicio.compIndex = compIndex;
        appState.modificandoEjercicio.ejIndex = ejIndex;
        
        renderPantallaBiblioteca(true); 
        detalleEjercicioModal.style.display = 'block';
        //btnSeleccionarEjercicioModal.style.display = 'block'; 
        
        modalEjercicioNombre.textContent = ejIndex === null ? "Añadir Ejercicio al Componente" : "Cambiar Ejercicio";
        modalEjercicioImagen.style.display = 'none'; 
        modalEjercicioMusculos.parentElement.style.display = 'none';
        modalEjercicioEquipamiento.parentElement.style.display = 'none';
        modalEjercicioDescripcion.parentElement.style.display = 'block'; 
        modalEjercicioDescripcion.innerHTML = ''; 
        modalEjercicioDescripcion.style.maxHeight = 'calc(100vh - 350px)'; 
        modalEjercicioDescripcion.style.overflowY = 'auto';
        filtrarYRenderizarBiblioteca(true); 
    }
    
    function seleccionarEjercicioDesdeModal(ejercicioIdSeleccionado) {
        if (!appState.modificandoEjercicio.activo) return;
        const { compIndex, ejIndex } = appState.modificandoEjercicio;
        const ejercicioData = getEjercicioById(ejercicioIdSeleccionado);

        if (ejercicioData && appState.componentesEnEdicion?.[compIndex]) {
            const nuevoEjercicioDef = { 
                id_ejercicio: ejercicioData.id, 
                series: ejercicioData.series,
                reps: ejercicioData.repeticiones 
            };
            if (ejIndex !== null) { 
                appState.componentesEnEdicion[compIndex].ejercicios[ejIndex] = nuevoEjercicioDef;
            } else { 
                appState.componentesEnEdicion[compIndex].ejercicios.push(nuevoEjercicioDef);
            }
            actualizarVistaListaEjerciciosDia(); 
        }
        cerrarModalBiblioteca();
    }

    function iniciarEntrenamiento(plan, dia) {
        const rutinaId = `${plan}_${dia.substring(0,3)}`;
        const rutinaOriginalPredeterminada = planesEntrenamiento[plan]?.[dia];
        if (!rutinaOriginalPredeterminada) {
            alert("Error: No se encontró la rutina base para iniciar.");
            return;
        }
        appState.entrenamientoActualOriginalId = rutinaOriginalPredeterminada.id;

        let componentesParaEntrenamiento;
        if (appState.entrenamientoActual && appState.entrenamientoActual.id === rutinaId && appState.componentesEnEdicion.length > 0) {
            componentesParaEntrenamiento = appState.componentesEnEdicion;
        } else {
            componentesParaEntrenamiento = appState.rutinasPersonalizadas[rutinaId]?.componentes || rutinaOriginalPredeterminada.componentes;
        }

        if (!componentesParaEntrenamiento || componentesParaEntrenamiento.length === 0 || componentesParaEntrenamiento.every(c => !c.ejercicios || c.ejercicios.length === 0)) {
            alert("No se puede iniciar: no hay ejercicios definidos o todos fueron quitados.");
            return;
        }
        
        appState.entrenamientoActual = { 
            ...(appState.rutinasPersonalizadas[rutinaId] || rutinaOriginalPredeterminada),
            id: rutinaId, 
            componentes: JSON.parse(JSON.stringify(componentesParaEntrenamiento)), 
            plan: plan, 
            dia: dia, 
            esRepeticion: appState.entrenamientosCompletados[appState.entrenamientoActualOriginalId] === true 
        };

        appState.indiceComponenteActual = 0;
        appState.indiceEjercicioActualEnComponente = 0;
        appState.serieActual = 1;
        appState.tiempoRestanteDescanso = 0;
        if(appState.timerDescansoActivo) clearInterval(appState.timerDescansoActivo);
        appState.timerDescansoActivo = null;
        temporizadorDescansoContainer.style.display = 'none';
        btnMarcarSerieCompletada.style.display = 'inline-block';
        btnSiguienteEjercicio.style.display = 'inline-block';
        btnEjercicioAnterior.style.display = 'inline-block';
        
        appState.tiempoTotalEntrenamientoSegundos = 0;
        iniciarCronometroGeneral();
        renderEjercicioEnProgreso();
        cambiarPestana('entrenamiento-en-progreso-section');
    }

    function renderEjercicioEnProgreso() {
        detenerCronometroEjercicioActual(); 

        if (!appState.entrenamientoActual || !appState.entrenamientoActual.componentes) {
            finalizarEntrenamientoActual(false); return;
        }
        
        while(appState.indiceComponenteActual < appState.entrenamientoActual.componentes.length &&
              (!appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios ||
               appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios.length === 0)) {
            appState.indiceComponenteActual++;
        }
        if (appState.indiceComponenteActual >= appState.entrenamientoActual.componentes.length) {
            finalizarEntrenamientoActual(true); return;
        }

        const componente = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
        if (appState.indiceEjercicioActualEnComponente >= componente.ejercicios.length) {
            appState.indiceEjercicioActualEnComponente = 0; 
            if (componente.ejercicios.length === 0) {
                manejarSiguienteEjercicio(); return;
            }
        }
        const ejercicioDef = componente.ejercicios[appState.indiceEjercicioActualEnComponente];

        if (!ejercicioDef) { 
            manejarSiguienteEjercicio(); 
            return;
        }

        const ejercicioData = getEjercicioById(ejercicioDef.id_ejercicio);
        if (!ejercicioData) {
            ejercicioActualNombre.textContent = "Error: Ejercicio no encontrado";
            ejercicioActualImagen.src = "https://placehold.co/300x200/FF0000/FFFFFF?text=Error+Ejercicio";
            ejercicioActualDescripcion.innerHTML = "Este ejercicio no se encontró.";
            ejercicioActualSeriesReps.textContent = "";
            btnMarcarSerieCompletada.disabled = true;
            detenerCronometroEjercicioActual(); 
            cronometroEjercicioActualDisplay.style.display = 'none';
            return;
        }
        btnMarcarSerieCompletada.disabled = false;

        ejercicioActualNombre.textContent = `${componente.tipo}: ${ejercicioData.nombre}`;
        ejercicioActualImagen.src = ejercicioData.imagenUrl;
        ejercicioActualImagen.alt = ejercicioData.nombre;
        ejercicioActualDescripcion.innerHTML = ejercicioData.descripcion.replace(/\n/g, "<br>");

        const seriesObjetivo = ejercicioDef.series || ejercicioData.series;
        const repeticionesObjetivo = ejercicioDef.reps || ejercicioData.repeticiones;

        if (componente.tipo === "Principal") {
            ejercicioActualSeriesReps.textContent = `Serie ${appState.serieActual}/${seriesObjetivo}, ${repeticionesObjetivo}`;
            btnMarcarSerieCompletada.textContent = 'Marcar Serie';
        } else {
            ejercicioActualSeriesReps.textContent = `${repeticionesObjetivo}`;
            btnMarcarSerieCompletada.textContent = 'Completado';
        }
        
        iniciarCronometroEjercicioActual();
        btnEjercicioAnterior.disabled = (appState.indiceComponenteActual === 0 && appState.indiceEjercicioActualEnComponente === 0 && appState.serieActual === 1);
    }
    
    function manejarSiguienteEjercicio() {
        detenerCronometroEjercicioActual();
        const componente = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
        if (appState.indiceEjercicioActualEnComponente < componente.ejercicios.length - 1) {
            appState.indiceEjercicioActualEnComponente++;
            appState.serieActual = 1;
        } else { 
            appState.indiceComponenteActual++;
            appState.indiceEjercicioActualEnComponente = 0;
            appState.serieActual = 1;
            while(appState.indiceComponenteActual < appState.entrenamientoActual.componentes.length &&
                  (!appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios ||
                   appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios.length === 0)) {
                appState.indiceComponenteActual++;
            }
            if (appState.indiceComponenteActual >= appState.entrenamientoActual.componentes.length) {
                finalizarEntrenamientoActual(true); return;
            }
        }
        renderEjercicioEnProgreso();
    }
    
    function manejarEjercicioAnterior() {
        detenerCronometroEjercicioActual();
        if (appState.serieActual > 1 && appState.entrenamientoActual.componentes[appState.indiceComponenteActual].tipo === "Principal") {
            appState.serieActual--;
        } else {
            if (appState.indiceEjercicioActualEnComponente > 0) {
                appState.indiceEjercicioActualEnComponente--;
            } else { 
                if (appState.indiceComponenteActual > 0) {
                    appState.indiceComponenteActual--;
                    while(appState.indiceComponenteActual >= 0 && 
                          (!appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios ||
                           appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios.length === 0)) {
                        if (appState.indiceComponenteActual === 0 && (!appState.entrenamientoActual.componentes[0].ejercicios || appState.entrenamientoActual.componentes[0].ejercicios.length === 0) ) break; 
                        appState.indiceComponenteActual--;
                    }
                    if (appState.indiceComponenteActual < 0) appState.indiceComponenteActual = 0; 

                    const compAnterior = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
                    appState.indiceEjercicioActualEnComponente = (compAnterior && compAnterior.ejercicios) ? compAnterior.ejercicios.length - 1 : 0;
                }
            }
            const prevComp = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
            if (prevComp && prevComp.ejercicios && prevComp.ejercicios.length > 0 && appState.indiceEjercicioActualEnComponente < prevComp.ejercicios.length) { 
                const prevEjDef = prevComp.ejercicios[appState.indiceEjercicioActualEnComponente];
                 if (prevEjDef && prevComp.tipo === "Principal") {
                    const prevEjData = getEjercicioById(prevEjDef.id_ejercicio);
                    appState.serieActual = prevEjDef.series || prevEjData.series;
                } else {
                    appState.serieActual = 1;
                }
            } else {
                 appState.serieActual = 1; 
            }
        }
        renderEjercicioEnProgreso();
    }

    function marcarSerie() {
        const componente = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
        const ejercicioDef = componente.ejercicios[appState.indiceEjercicioActualEnComponente];
        const ejercicioData = getEjercicioById(ejercicioDef.id_ejercicio);
        const seriesObjetivo = ejercicioDef.series || ejercicioData.series;

        if (componente.tipo !== "Principal" || appState.serieActual >= seriesObjetivo) {
            detenerCronometroEjercicioActual(); 
            const descanso = (componente.tipo !== "Principal") ? 0 : (ejercicioData.descanso || 0);
            iniciarDescanso(descanso); 
            if (descanso === 0) {
                manejarSiguienteEjercicio();
            }
        } else {
            appState.serieActual++;
            iniciarDescanso(ejercicioData.descanso);
            ejercicioActualSeriesReps.textContent = `Serie ${appState.serieActual}/${seriesObjetivo}, ${ejercicioDef.reps || ejercicioData.repeticiones}`;
        }
    }
    
    function iniciarDescanso(segundos) {
        if (appState.timerDescansoActivo) clearInterval(appState.timerDescansoActivo);
        
        if (segundos <=0) {
            temporizadorDescansoContainer.style.display = 'none';
            btnMarcarSerieCompletada.style.display = 'inline-block'; 
            btnSiguienteEjercicio.style.display = 'inline-block';
            btnEjercicioAnterior.style.display = 'inline-block';
            return;
        }

        appState.tiempoRestanteDescanso = segundos;
        temporizadorDisplay.textContent = formatTiempo(segundos);
        temporizadorDescansoContainer.style.display = 'block';
        btnMarcarSerieCompletada.style.display = 'none';
        btnSiguienteEjercicio.style.display = 'none';
        btnEjercicioAnterior.style.display = 'none';

        appState.timerDescansoActivo = setInterval(() => {
            appState.tiempoRestanteDescanso--;
            temporizadorDisplay.textContent = formatTiempo(appState.tiempoRestanteDescanso);
            if (appState.tiempoRestanteDescanso <= 0) {
                clearInterval(appState.timerDescansoActivo);
                appState.timerDescansoActivo = null;
                temporizadorDescansoContainer.style.display = 'none';
                btnMarcarSerieCompletada.style.display = 'inline-block';
                btnSiguienteEjercicio.style.display = 'inline-block';
                btnEjercicioAnterior.style.display = 'inline-block';
            }
        }, 1000);
    }
    
    function finalizarEntrenamientoActual(completado) {
        detenerCronometroGeneral();
        detenerCronometroEjercicioActual();
        cronometroEjercicioActualDisplay.style.display = 'none';

        if (appState.entrenamientoActual && completado && !appState.entrenamientoActual.esRepeticion) {
            const idRutinaOriginal = appState.entrenamientoActualOriginalId; 
            if (idRutinaOriginal) {
                 appState.entrenamientosCompletados[idRutinaOriginal] = true;
            }
        }
        const tiempoTotalFormateado = formatTiempoGeneral(appState.tiempoTotalEntrenamientoSegundos);
        appState.entrenamientoActual = null;
        appState.componentesEnEdicion = [];
        appState.entrenamientoActualOriginalId = null; 
        guardarEstado();
        alert(completado ? `¡Entrenamiento finalizado!\nTiempo total: ${tiempoTotalFormateado}` : "Entrenamiento abandonado.");
        cambiarPestana('hoy-section');
    }

    function renderPantallaBiblioteca(paraSeleccion = false) {
        const targetContainer = paraSeleccion ? modalEjercicioDescripcion : listaBibliotecaEjerciciosContainer;

        if (!paraSeleccion) { 
            //btnSeleccionarEjercicioModal.style.display = 'none'; 
            modalEjercicioMusculos.parentElement.style.display = 'block';
            modalEjercicioEquipamiento.parentElement.style.display = 'block';
            modalEjercicioDescripcion.parentElement.style.display = 'block';
            modalEjercicioImagen.style.display = 'block';
            targetContainer.style.display = 'grid'; 
            modalEjercicioDescripcion.style.maxHeight = '150px';
            modalEjercicioDescripcion.style.overflowY = 'auto';
        } else { 
            //btnSeleccionarEjercicioModal.style.display = 'none'; 
            modalEjercicioMusculos.parentElement.style.display = 'none';
            modalEjercicioEquipamiento.parentElement.style.display = 'none';
            modalEjercicioImagen.style.display = 'none';
            modalEjercicioDescripcion.parentElement.style.display = 'block'; 
            modalEjercicioDescripcion.innerHTML = ''; 
            modalEjercicioDescripcion.style.maxHeight = 'calc(100vh - 350px)'; 
            modalEjercicioDescripcion.style.overflowY = 'auto';
        }

        if (selectFiltroGrupoMuscular.options.length <= 1) {
            const grupos = ["", ...new Set(bibliotecaEjercicios.flatMap(ej => ej.musculosTrabajados))];
            selectFiltroGrupoMuscular.innerHTML = ''; 
            grupos.sort().forEach(g => selectFiltroGrupoMuscular.add(new Option(g || "Grupo Muscular", g)));
        }
        if (selectFiltroEquipamiento.options.length <= 1) {
            const equips = ["", ...new Set(bibliotecaEjercicios.flatMap(ej => ej.equipamiento).filter(e => e))]; 
            selectFiltroEquipamiento.innerHTML = ''; 
            equips.sort().forEach(e => selectFiltroEquipamiento.add(new Option(e || "Equipamiento", e)));
        }
        filtrarYRenderizarBiblioteca(paraSeleccion);
    }

    function filtrarYRenderizarBiblioteca(paraSeleccion = false) {
        const busqueda = inputBuscarBiblioteca.value.toLowerCase();
        const grupo = selectFiltroGrupoMuscular.value;
        const equip = selectFiltroEquipamiento.value;

        const filtrados = bibliotecaEjercicios.filter(ej => {
            const coincideNombre = ej.nombre.toLowerCase().includes(busqueda);
            const coincideGrupo = !grupo || ej.musculosTrabajados.includes(grupo);
            const coincideEquip = !equip || (ej.equipamiento && ej.equipamiento.includes(equip)); 
            return coincideNombre && coincideGrupo && coincideEquip;
        });

        const targetContainer = paraSeleccion ? modalEjercicioDescripcion : listaBibliotecaEjerciciosContainer;
        targetContainer.innerHTML = '';

        if (filtrados.length === 0) {
            targetContainer.innerHTML = "<p>No se encontraron ejercicios.</p>";
            return;
        }
        filtrados.forEach(ej => {
            const div = document.createElement('div');
            if (paraSeleccion) {
                div.classList.add('ejercicio-item-biblioteca-seleccion'); 
                div.innerHTML = `<strong>${ej.nombre}</strong> <br> <small>${ej.musculosTrabajados.join(', ')} / ${(ej.equipamiento || []).join(', ')}</small>`;
                div.addEventListener('click', () => seleccionarEjercicioDesdeModal(ej.id));
            } else {
                div.innerHTML = `
                    <div class="card ejercicio-item-biblioteca"> 
                        <h4>${ej.nombre}</h4>
                        <img src="${ej.imagenUrl}" alt="${ej.nombre}" style="width:80px; height:auto; border-radius:4px; float:right; margin-left:10px;">
                        <p><strong>Músculos:</strong> ${ej.musculosTrabajados.join(', ')}</p>
                        <p><strong>Equipamiento:</strong> ${(ej.equipamiento || []).join(', ')}</p>
                    </div>
                `;
                const cardInterna = div.querySelector('.card');
                cardInterna.addEventListener('click', () => {
                    appState.modificandoEjercicio.idEjercicioAbiertoEnModal = ej.id;
                    mostrarDetalleEjercicioBiblioteca(ej.id);
                });
            }
            targetContainer.appendChild(div);
        });
    }
    
    function mostrarDetalleEjercicioBiblioteca(ejercicioId) { 
        const ejercicio = getEjercicioById(ejercicioId);
        if (!ejercicio) return;

        appState.modificandoEjercicio.activo = false; 
        //btnSeleccionarEjercicioModal.style.display = 'none'; 
        modalEjercicioMusculos.parentElement.style.display = 'block';
        modalEjercicioEquipamiento.parentElement.style.display = 'block';
        modalEjercicioDescripcion.parentElement.style.display = 'block';
        modalEjercicioImagen.style.display = 'block';
        
        modalEjercicioNombre.textContent = ejercicio.nombre;
        modalEjercicioImagen.src = ejercicio.imagenUrl;
        modalEjercicioImagen.alt = ejercicio.nombre;
        modalEjercicioMusculos.textContent = ejercicio.musculosTrabajados.join(', ');
        modalEjercicioEquipamiento.textContent = (ejercicio.equipamiento || []).join(', ');
        modalEjercicioDescripcion.innerHTML = ejercicio.descripcion.replace(/\n/g, "<br>");
        detalleEjercicioModal.style.display = 'block';
    }
    
    function cerrarModalBiblioteca() {
        detalleEjercicioModal.style.display = 'none';
        appState.modificandoEjercicio.activo = false;
        appState.modificandoEjercicio.compIndex = null;
        appState.modificandoEjercicio.ejIndex = null;
        appState.modificandoEjercicio.idEjercicioAbiertoEnModal = null;
        
        inputBuscarBiblioteca.value = "";
        modalEjercicioDescripcion.style.maxHeight = '150px';
        modalEjercicioDescripcion.style.overflowY = 'auto';
        if(document.getElementById('biblioteca-section').classList.contains('active-tab')){
            renderPantallaBiblioteca(false);
        }
    }

    function renderPantallaAjustes() {
        appNameInput.value = appState.appName;
        inputUserName.value = appState.nombreUsuario;
        selectUnidadesPeso.value = appState.unidadesPeso;
        if (selectDiasEntrenamiento) {
             selectDiasEntrenamiento.value = appState.diasEntrenamiento.toString();
        }
    }

    function adaptarRutinasDe6a5Dias() {
        const plan = appState.planActivoGeneral;
        const diaOmitidoNombre = 'sabado';
        const rutinaOmitidaOriginal = planesEntrenamiento[plan]?.[diaOmitidoNombre];

        if (!rutinaOmitidaOriginal || !rutinaOmitidaOriginal.componentes) return;

        let rutinasPersonalizadasCopia = JSON.parse(JSON.stringify(appState.rutinasPersonalizadas));

        const ejerciciosPrincipalesOmitidos = rutinaOmitidaOriginal.componentes
            .filter(c => c.tipo === "Principal")
            .flatMap(c => c.ejercicios);

        if (ejerciciosPrincipalesOmitidos.length === 0) return;

        const diasRestantes = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
        let ejerciciosAnadidosCount = 0;
        const MAX_EJERCICIOS_A_DISTRIBUIR_POR_GRUPO_POR_DIA = 1; 

        for (const ejDefOmitido of ejerciciosPrincipalesOmitidos) {
            const ejercicioDataOmitido = getEjercicioById(ejDefOmitido.id_ejercicio);
            if (!ejercicioDataOmitido) continue;

            let añadidoEsteEjercicio = false;
            // Distribuir preferentemente a días que NO entrenen ese músculo principal, o si no, al menos cargado
            for (const diaDestinoNombre of diasRestantes) {
                if (añadidoEsteEjercicio) break;

                const rutinaIdDestino = `${plan}_${diaDestinoNombre.substring(0,3)}`;
                const rutinaDestinoPredeterminada = planesEntrenamiento[plan]?.[diaDestinoNombre];
                
                if (!rutinasPersonalizadasCopia[rutinaIdDestino]) {
                     if (rutinaDestinoPredeterminada) {
                        rutinasPersonalizadasCopia[rutinaIdDestino] = JSON.parse(JSON.stringify(rutinaDestinoPredeterminada));
                    } else {
                        continue; 
                    }
                }
                let componentesDestino = rutinasPersonalizadasCopia[rutinaIdDestino].componentes;
                
                let componentePrincipalDestino = componentesDestino.find(c => c.tipo === "Principal");
                if (!componentePrincipalDestino) {
                    componentePrincipalDestino = { tipo: "Principal", ejercicios: [] };
                    componentesDestino.push(componentePrincipalDestino);
                }

                let conteoMuscularActual = 0;
                componentePrincipalDestino.ejercicios.forEach(ejExistente => {
                    const ejDataExistente = getEjercicioById(ejExistente.id_ejercicio);
                    if (ejDataExistente && ejDataExistente.musculosTrabajados.some(m => ejercicioDataOmitido.musculosTrabajados.includes(m))) {
                        conteoMuscularActual++;
                    }
                });

                if (componentePrincipalDestino.ejercicios.length < 7 && // Aumentar un poco el límite para la distribución
                    conteoMuscularActual < MAX_EJERCICIOS_A_DISTRIBUIR_POR_GRUPO_POR_DIA &&
                    !componentePrincipalDestino.ejercicios.find(e => e.id_ejercicio === ejDefOmitido.id_ejercicio)) {
                    
                    componentePrincipalDestino.ejercicios.push({ ...ejDefOmitido }); 
                    ejerciciosAnadidosCount++;
                    añadidoEsteEjercicio = true; 
                    console.log(`Ejercicio ${ejercicioDataOmitido.nombre} del sábado añadido al ${diaDestinoNombre}.`);
                }
            }
        }

        const rutinaIdSabado = `${plan}_sab`;
        const sabadoPredeterminado = planesEntrenamiento[plan]?.sabado;
        rutinasPersonalizadasCopia[rutinaIdSabado] = {
            ...(sabadoPredeterminado || { id: rutinaIdSabado, diaSemanaComparable: 6 }),
            nombre: "Descanso", // Marcar explícitamente como descanso
            componentes: []
        };
        
        appState.rutinasPersonalizadas = rutinasPersonalizadasCopia;

        if (ejerciciosAnadidosCount > 0) {
            alert(`${ejerciciosAnadidosCount} ejercicio(s) del sábado se han intentado distribuir. Revisa y ajusta tus rutinas.`);
        } else if (ejerciciosPrincipalesOmitidos.length > 0) {
            alert("No se pudieron distribuir automáticamente los ejercicios del sábado. Considera añadirlos manualmente a otros días o ajustar tus rutinas.");
        }
        guardarEstado();
    }

    // --- EVENT LISTENERS ---
    tabButtons.forEach(button => button.addEventListener('click', () => cambiarPestana(button.dataset.tab)));
    btnVerRutinasDesdeHoy.addEventListener('click', () => cambiarPestana('rutinas-section'));
    btnSelectPlanCasa.addEventListener('click', () => { appState.planActivoGeneral = 'casa'; renderPantallaRutinas(); guardarEstado(); });
    btnSelectPlanGimnasio.addEventListener('click', () => { appState.planActivoGeneral = 'gimnasio'; renderPantallaRutinas(); guardarEstado(); });
    btnVolverARutinas.addEventListener('click', () => cambiarPestana('rutinas-section'));
    btnComenzarEntrenamientoDia.addEventListener('click', () => {
        if (appState.entrenamientoActual) {
            iniciarEntrenamiento(appState.entrenamientoActual.plan, appState.entrenamientoActual.dia);
        }
    });
    btnGuardarCambiosRutina.addEventListener('click', guardarCambiosRutinaActual);
    btnRestablecerRutinaDefault.addEventListener('click', restablecerRutinaActualADefault);
    
    // Entrenamiento
    btnEjercicioAnterior.addEventListener('click', manejarEjercicioAnterior);
    btnMarcarSerieCompletada.addEventListener('click', marcarSerie);
    btnSiguienteEjercicio.addEventListener('click', manejarSiguienteEjercicio);
    btnSaltarDescanso.addEventListener('click', () => {
        if (appState.timerDescansoActivo) clearInterval(appState.timerDescansoActivo);
        appState.timerDescansoActivo = null;
        temporizadorDescansoContainer.style.display = 'none';
        btnMarcarSerieCompletada.style.display = 'inline-block';
        btnSiguienteEjercicio.style.display = 'inline-block';
        btnEjercicioAnterior.style.display = 'inline-block';
    });
    btnFinalizarEntrenamiento.addEventListener('click', () => finalizarEntrenamientoActual(false));
    
    // Biblioteca
    inputBuscarBiblioteca.addEventListener('input', () => filtrarYRenderizarBiblioteca(appState.modificandoEjercicio.activo));
    selectFiltroGrupoMuscular.addEventListener('change', () => filtrarYRenderizarBiblioteca(appState.modificandoEjercicio.activo));
    selectFiltroEquipamiento.addEventListener('change', () => filtrarYRenderizarBiblioteca(appState.modificandoEjercicio.activo));
    btnCerrarModalBiblioteca.addEventListener('click', cerrarModalBiblioteca);
    
    // Ajustes
    btnGuardarAjustes.addEventListener('click', () => {
        const diasEntrenamientoAnteriores = appState.diasEntrenamiento;
        appState.appName = appNameInput.value || "Entrenador Élite";
        appState.nombreUsuario = inputUserName.value || "Atleta";
        appState.unidadesPeso = selectUnidadesPeso.value;
        if (selectDiasEntrenamiento) {
            appState.diasEntrenamiento = parseInt(selectDiasEntrenamiento.value);
        }

        if (diasEntrenamientoAnteriores === 6 && appState.diasEntrenamiento === 5) {
            adaptarRutinasDe6a5Dias();
        } else if (diasEntrenamientoAnteriores === 5 && appState.diasEntrenamiento === 6) {
            const plan = appState.planActivoGeneral;
            const rutinaIdSabado = `${plan}_sab`;
            if (appState.rutinasPersonalizadas[rutinaIdSabado] && appState.rutinasPersonalizadas[rutinaIdSabado].nombre === "Descanso") {
                delete appState.rutinasPersonalizadas[rutinaIdSabado]; // Vuelve a tomar el default de planesEntrenamiento
            }
        }

        guardarEstado();
        renderPantallaHoy(); 
        renderPantallaRutinas();
        alert('Ajustes guardados.');
    });

    btnRestablecerProgresoTotal.addEventListener('click', () => {
        if (confirm("¿Restablecer progreso de entrenamientos completados?")) {
            appState.entrenamientosCompletados = {};
            if (confirm("¿También quieres restablecer TODAS tus rutinas personalizadas a las predeterminadas?")) {
                appState.rutinasPersonalizadas = {};
            }
            guardarEstado();
            actualizarResumenSemanal();
            renderPantallaRutinas();
            renderPantallaHoy();
            alert("Progreso y/o rutinas restablecidas.");
        }
    });

    // --- INICIALIZACIÓN ---
    cargarEstado();
    cambiarPestana('hoy-section'); // Pestaña inicial
});