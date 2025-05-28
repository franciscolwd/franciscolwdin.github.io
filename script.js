document.addEventListener('DOMContentLoaded', () => {
    let appState = {
        nombreUsuario: "Atleta Pro",
        appName: "Entrenador Élite",
        unidadesPeso: "kg",
        planActivoGeneral: "casa",
        diasEntrenamiento: 6,
        entrenamientosCompletados: {},
        rutinasPersonalizadas: {}, // NUEVO: para guardar rutinas modificadas
        // Estado del entrenamiento en progreso
        entrenamientoActual: null, 
        entrenamientoActualOriginalId: null, // ID de la rutina original (casa_lun, gym_mar, etc.)
        componentesEnEdicion: [], // Para modificar en la pantalla de detalles antes de guardar o iniciar
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
            activo: false,
            compIndex: null,
            ejIndex: null, 
            idEjercicioAbiertoEnModal: null 
        }
    };

    // --- BIBLIOTECA DE EJERCICIOS (LA MISMA EXTENSA DE ANTES) ---
    const bibliotecaEjercicios = [
        // Pecho
        {
            id: "ej_P_001", nombre: "Flexiones (Push-ups)",
            musculosTrabajados: ["Pecho", "Hombros", "Tríceps"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición inicial: Manos al ancho de los hombros, cuerpo recto desde la cabeza hasta los talones.\n2. Movimiento: Baja el cuerpo doblando los codos hasta que el pecho casi toque el suelo. Mantén el core apretado.\n3. Retorno: Empuja hacia arriba hasta la posición inicial extendiendo los brazos.\n4. Respiración: Inhala al bajar, exhala al subir.\n5. Errores comunes: Dejar caer la cadera, no bajar lo suficiente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Flexiones", series: 3, repeticiones: "AMRAP", descanso: 60
        },
        {
            id: "ej_P_002", nombre: "Press de Banca con Barra",
            musculosTrabajados: ["Pecho", "Hombros", "Tríceps"], equipamiento: ["Barra", "Discos", "Banco Plano"],
            descripcion: "1. Posición inicial: Acostado en el banco, pies firmes en el suelo, agarra la barra un poco más ancha que los hombros.\n2. Movimiento: Baja la barra controladamente hasta tocar el pecho medio-bajo. Codos a 45-75° del torso.\n3. Retorno: Empuja la barra hacia arriba de forma explosiva.\n4. Respiración: Inhala al bajar, exhala al empujar.\n5. Puntos clave: Hombros hacia atrás y abajo (retracción escapular).",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Press+Banca+Barra", series: 4, repeticiones: "6-10", descanso: 90
        },
        {
            id: "ej_P_003", nombre: "Press Inclinado con Mancuernas",
            musculosTrabajados: ["Pecho Superior", "Hombros", "Tríceps"], equipamiento: ["Mancuernas", "Banco Inclinado"],
            descripcion: "1. Posición inicial: Sentado en banco inclinado (30-45°), mancuernas a la altura del pecho, palmas hacia adelante.\n2. Movimiento: Empuja las mancuernas hacia arriba y ligeramente hacia adentro hasta que los brazos estén extendidos.\n3. Retorno: Baja las mancuernas controladamente.\n4. Respiración: Inhala al bajar, exhala al subir.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Press+Inclinado+Manc", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_P_004", nombre: "Aperturas con Mancuernas (Flyes)",
            musculosTrabajados: ["Pecho"], equipamiento: ["Mancuernas", "Banco Plano"],
            descripcion: "1. Posición inicial: Acostado en banco plano, mancuernas sobre el pecho, brazos casi extendidos, palmas enfrentadas.\n2. Movimiento: Baja las mancuernas hacia los lados describiendo un arco amplio, manteniendo una ligera flexión en los codos. Siente el estiramiento en el pecho.\n3. Retorno: Vuelve a la posición inicial contrayendo el pecho.\n4. Respiración: Inhala al abrir, exhala al cerrar.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Aperturas+Mancuernas", series: 3, repeticiones: "10-15", descanso: 60
        },
        // Espalda
        {
            id: "ej_E_001", nombre: "Dominadas (Pull-ups)",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps"], equipamiento: ["Barra de Dominadas", "Peso Corporal"],
            descripcion: "1. Posición inicial: Agarra la barra con las palmas hacia afuera (pronación), un poco más anchas que los hombros. Cuelga con los brazos extendidos.\n2. Movimiento: Tira de tu cuerpo hacia arriba hasta que la barbilla sobrepase la barra. Enfócate en usar los músculos de la espalda.\n3. Retorno: Baja de forma controlada.\n4. Variación: Usar agarre supino (palmas hacia adentro) para más énfasis en bíceps (Chin-ups).",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Dominadas", series: 3, repeticiones: "AMRAP", descanso: 90
        },
        {
            id: "ej_E_002", nombre: "Remo con Barra",
            musculosTrabajados: ["Espalda (Dorsales, Romboides, Trapecio)", "Bíceps"], equipamiento: ["Barra", "Discos"],
            descripcion: "1. Posición inicial: De pie, rodillas ligeramente flexionadas, inclina el torso hacia adelante (45-90°), espalda recta. Agarra la barra con agarre prono o supino.\n2. Movimiento: Tira de la barra hacia tu abdomen bajo o pecho, contrayendo los músculos de la espalda.\n3. Retorno: Baja la barra controladamente.\n4. Puntos clave: Mantén la espalda recta y el core activado.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Remo+con+Barra", series: 4, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_E_003", nombre: "Jalón al Pecho (Lat Pulldown)",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps"], equipamiento: ["Máquina de Jalones"],
            descripcion: "1. Posición inicial: Sentado en la máquina, ajusta el rodillo sobre los muslos. Agarra la barra ancha con agarre prono.\n2. Movimiento: Tira de la barra hacia la parte superior del pecho, inclinándote ligeramente hacia atrás. Contrae los omóplatos.\n3. Retorno: Sube la barra controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Jalon+al+Pecho", series: 3, repeticiones: "10-12", descanso: 75
        },
        {
            id: "ej_E_004", nombre: "Remo Sentado en Polea (Cable Row)",
            musculosTrabajados: ["Espalda (Dorsales, Romboides)", "Bíceps"], equipamiento: ["Máquina de Remo en Polea", "Agarre V o Barra Recta"],
            descripcion: "1. Posición inicial: Sentado con los pies apoyados, espalda recta. Agarra el maneral.\n2. Movimiento: Tira del maneral hacia tu abdomen, manteniendo el torso erguido y contrayendo la espalda.\n3. Retorno: Extiende los brazos controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Remo+Sentado+Polea", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_E_005", nombre: "Remo Invertido con TRX (o barra baja)",
            musculosTrabajados: ["Espalda", "Bíceps", "Core"], equipamiento: ["TRX", "Barra baja", "Peso Corporal"],
            descripcion: "1. Posición: Cuerpo recto, colgado del TRX o barra. Cuanto más horizontal, más difícil.\n2. Movimiento: Tira del pecho hacia las manos, contrayendo la espalda.\n3. Retorno: Baja controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Remo+TRX", series: 3, repeticiones: "10-15", descanso: 60
        },
        // Piernas
        {
            id: "ej_PI_001", nombre: "Sentadilla con Barra (Back Squat)",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales", "Core"], equipamiento: ["Barra", "Discos", "Rack"],
            descripcion: "1. Posición inicial: Barra apoyada sobre los trapecios (o deltoides posteriores). Pies al ancho de hombros, puntas ligeramente hacia afuera.\n2. Movimiento: Baja la cadera como si te sentaras, manteniendo la espalda recta y el pecho erguido. Baja hasta que los muslos estén paralelos al suelo o más.\n3. Retorno: Empuja con los talones para subir.\n4. Respiración: Inhala al bajar, exhala al subir.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Sentadilla+Barra", series: 4, repeticiones: "8-12", descanso: 90
        },
        {
            id: "ej_PI_002", nombre: "Peso Muerto Rumano (RDL)",
            musculosTrabajados: ["Isquiotibiales", "Glúteos", "Espalda Baja"], equipamiento: ["Barra", "Mancuernas"],
            descripcion: "1. Posición inicial: De pie, barra o mancuernas al frente, rodillas ligeramente flexionadas.\n2. Movimiento: Inclina el torso hacia adelante desde las caderas, manteniendo la espalda recta y la barra/mancuernas cerca de las piernas. Siente el estiramiento en los isquios.\n3. Retorno: Vuelve a la posición inicial extendiendo las caderas y contrayendo los glúteos.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Peso+Muerto+Rumano", series: 3, repeticiones: "10-15", descanso: 75
        },
        {
            id: "ej_PI_003", nombre: "Prensa de Piernas (Leg Press)",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales"], equipamiento: ["Máquina de Prensa de Piernas"],
            descripcion: "1. Posición inicial: Sentado en la máquina, pies en la plataforma al ancho de los hombros.\n2. Movimiento: Baja la plataforma doblando las rodillas hasta un ángulo de 90° o más (según movilidad).\n3. Retorno: Empuja la plataforma sin bloquear completamente las rodillas.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Prensa+Piernas", series: 4, repeticiones: "10-15", descanso: 75
        },
        {
            id: "ej_PI_004", nombre: "Zancadas con Mancuernas (Dumbbell Lunges)",
            musculosTrabajados: ["Cuádriceps", "Glúteos"], equipamiento: ["Mancuernas", "Peso Corporal"],
            descripcion: "1. Posición inicial: De pie, sosteniendo una mancuerna en cada mano.\n2. Movimiento: Da un paso largo hacia adelante y baja la cadera hasta que ambas rodillas formen un ángulo de 90°. La rodilla trasera casi toca el suelo.\n3. Retorno: Empuja con el pie delantero para volver a la posición inicial. Alterna piernas.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Zancadas+Mancuernas", series: 3, repeticiones: "10-12 c/pierna", descanso: 60
        },
        {
            id: "ej_PI_005", nombre: "Extensiones de Cuádriceps (Leg Extensions)",
            musculosTrabajados: ["Cuádriceps"], equipamiento: ["Máquina de Extensiones"],
            descripcion: "1. Posición inicial: Sentado en la máquina, tobillos debajo del rodillo acolchado.\n2. Movimiento: Extiende las piernas hasta que estén rectas, contrayendo los cuádriceps.\n3. Retorno: Baja el peso controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Extensiones+Cuads", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_PI_006", nombre: "Curl Femoral Tumbado (Lying Leg Curls)",
            musculosTrabajados: ["Isquiotibiales"], equipamiento: ["Máquina de Curl Femoral"],
            descripcion: "1. Posición inicial: Acostado boca abajo en la máquina, rodillos justo encima de los tobillos.\n2. Movimiento: Flexiona las rodillas llevando los talones hacia los glúteos.\n3. Retorno: Baja el peso controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Curl+Femoral+Tumbado", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_PI_007", nombre: "Elevaciones de Gemelos (Calf Raises)",
            musculosTrabajados: ["Gemelos"], equipamiento: ["Peso Corporal", "Mancuernas", "Máquina de Gemelos"],
            descripcion: "1. Posición inicial: De pie, con las puntas de los pies sobre un escalón o plataforma (opcional para mayor rango).\n2. Movimiento: Elévate sobre las puntas de los pies lo más alto posible.\n3. Retorno: Baja los talones lentamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Elevaciones+Gemelos", series: 4, repeticiones: "15-25", descanso: 45
        },
        {
            id: "ej_PI_008", nombre: "Sentadilla Goblet",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Core"], equipamiento: ["Mancuerna", "Kettlebell"],
            descripcion: "1. Posición: Sostén una mancuerna o kettlebell verticalmente contra tu pecho.\n2. Movimiento: Realiza una sentadilla profunda, manteniendo el torso erguido.\n3. Puntos clave: Excelente para aprender la forma de la sentadilla y trabajar el core.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Sentadilla+Goblet", series: 3, repeticiones: "10-15", descanso: 60
        },
        // Hombros
        {
            id: "ej_H_001", nombre: "Press Militar con Barra (Overhead Press)",
            musculosTrabajados: ["Hombros (Deltoides)", "Tríceps"], equipamiento: ["Barra", "Discos"],
            descripcion: "1. Posición inicial: De pie, barra a la altura de los hombros/clavícula, agarre prono un poco más ancho que los hombros.\n2. Movimiento: Empuja la barra verticalmente hacia arriba hasta extender los brazos. Pasa la cabeza ligeramente hacia adelante una vez que la barra supera la frente.\n3. Retorno: Baja la barra controladamente.\n4. Puntos clave: Core apretado, glúteos contraídos para estabilidad.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Press+Militar+Barra", series: 4, repeticiones: "6-10", descanso: 90
        },
        {
            id: "ej_H_002", nombre: "Press de Hombros con Mancuernas (Sentado o De pie)",
            musculosTrabajados: ["Hombros (Deltoides)", "Tríceps"], equipamiento: ["Mancuernas", "Banco (opcional)"],
            descripcion: "1. Posición inicial: Sentado o de pie, mancuernas a la altura de los hombros, palmas hacia adelante.\n2. Movimiento: Empuja las mancuernas hacia arriba hasta extender los brazos.\n3. Retorno: Baja controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Press+Hombro+Manc", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_H_003", nombre: "Elevaciones Laterales con Mancuernas",
            musculosTrabajados: ["Hombros (Deltoides Lateral)"], equipamiento: ["Mancuernas"],
            descripcion: "1. Posición inicial: De pie, mancuernas a los lados, ligera flexión en los codos.\n2. Movimiento: Eleva los brazos hacia los lados hasta que estén paralelos al suelo. No uses impulso.\n3. Retorno: Baja controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Elevaciones+Laterales", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_H_004", nombre: "Elevaciones Frontales con Mancuernas",
            musculosTrabajados: ["Hombros (Deltoides Anterior)"], equipamiento: ["Mancuernas", "Disco"],
            descripcion: "1. Posición inicial: De pie, mancuernas o disco al frente de los muslos.\n2. Movimiento: Eleva los brazos rectos hacia el frente hasta la altura de los hombros.\n3. Retorno: Baja controladamente. Puedes alternar brazos.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Elevaciones+Frontales", series: 3, repeticiones: "10-15", descanso: 60
        },
        // Brazos (Bíceps y Tríceps)
        {
            id: "ej_B_001", nombre: "Curl de Bíceps con Barra",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Barra Recta", "Barra EZ"],
            descripcion: "1. Posición inicial: De pie, agarra la barra con las palmas hacia arriba (supinación), al ancho de los hombros.\n2. Movimiento: Flexiona los codos llevando la barra hacia tus hombros. Mantén los codos pegados al cuerpo.\n3. Retorno: Baja la barra controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Curl+Biceps+Barra", series: 3, repeticiones: "8-12", descanso: 60
        },
        {
            id: "ej_B_002", nombre: "Curl de Bíceps con Mancuernas (Alterno o Simultáneo)",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Mancuernas"],
            descripcion: "1. Posición inicial: De pie o sentado, mancuernas a los lados, palmas hacia adelante o neutras (martillo).\n2. Movimiento: Flexiona los codos, llevando las mancuernas hacia los hombros. Puedes supinar la muñeca durante el movimiento si empiezas con agarre neutro.\n3. Retorno: Baja controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Curl+Biceps+Manc", series: 3, repeticiones: "10-15 c/brazo", descanso: 60
        },
        {
            id: "ej_T_001", nombre: "Press Francés (Skullcrushers)",
            musculosTrabajados: ["Tríceps"], equipamiento: ["Barra EZ", "Mancuernas", "Banco Plano"],
            descripcion: "1. Posición inicial: Acostado en banco plano, sostén la barra EZ o mancuernas sobre tu pecho con los brazos extendidos.\n2. Movimiento: Baja el peso hacia tu frente o detrás de la cabeza doblando los codos. Mantén los codos apuntando hacia arriba.\n3. Retorno: Extiende los brazos.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Press+Frances", series: 3, repeticiones: "10-12", descanso: 60
        },
        {
            id: "ej_T_002", nombre: "Extensiones de Tríceps en Polea Alta (Pushdowns)",
            musculosTrabajados: ["Tríceps"], equipamiento: ["Máquina de Poleas", "Cuerda", "Barra V"],
            descripcion: "1. Posición inicial: De pie frente a la polea alta, agarra el accesorio.\n2. Movimiento: Extiende los brazos hacia abajo hasta que estén completamente rectos. Mantén los codos pegados al cuerpo.\n3. Retorno: Sube controladamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Extension+Triceps+Polea", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_T_003", nombre: "Fondos en Paralelas (Dips)",
            musculosTrabajados: ["Tríceps", "Pecho", "Hombros"], equipamiento: ["Barras Paralelas", "Máquina de Fondos Asistidos"],
            descripcion: "1. Posición inicial: Sostente en las barras paralelas con los brazos extendidos.\n2. Movimiento: Baja el cuerpo doblando los codos hasta que los hombros estén por debajo de los codos o sientas un buen estiramiento. Inclínate ligeramente hacia adelante para más énfasis en pecho, más vertical para tríceps.\n3. Retorno: Empuja hacia arriba.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Fondos+Paralelas", series: 3, repeticiones: "AMRAP", descanso: 75
        },
        // Abdominales y Core
        {
            id: "ej_A_001", nombre: "Plancha Abdominal (Plank)",
            musculosTrabajados: ["Abdominales", "Core", "Espalda Baja"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición inicial: Apoya los antebrazos y las puntas de los pies en el suelo. Cuerpo recto desde la cabeza hasta los talones.\n2. Mantenimiento: Contrae los abdominales y glúteos. Evita que la cadera se caiga o se eleve demasiado.\n3. Duración: Mantén la posición por el tiempo especificado.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Plancha+Abdominal", series: 3, repeticiones: "30-60s", descanso: 45
        },
        {
            id: "ej_A_002", nombre: "Crunches (Encogimientos Abdominales)",
            musculosTrabajados: ["Abdominales (Recto Abdominal)"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición inicial: Acostado boca arriba, rodillas flexionadas, pies en el suelo. Manos detrás de la cabeza o cruzadas en el pecho.\n2. Movimiento: Levanta la cabeza y los hombros del suelo contrayendo los abdominales. La espalda baja debe permanecer en contacto con el suelo.\n3. Retorno: Baja lentamente.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Crunches", series: 3, repeticiones: "15-25", descanso: 45
        },
        {
            id: "ej_A_003", nombre: "Elevaciones de Piernas (Leg Raises)",
            musculosTrabajados: ["Abdominales Inferiores", "Flexores de Cadera"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición inicial: Acostado boca arriba, piernas extendidas. Manos debajo de los glúteos o a los lados para apoyo.\n2. Movimiento: Levanta las piernas rectas hasta que formen un ángulo de 90° con el torso. Mantén la espalda baja pegada al suelo.\n3. Retorno: Baja las piernas lentamente sin que toquen el suelo.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Elevaciones+Piernas", series: 3, repeticiones: "12-20", descanso: 60
        },
        // Cardio y Calentamiento/Enfriamiento General
        {
            id: "ej_C_001", nombre: "Salto de Comba (Jumping Rope)",
            musculosTrabajados: ["Cardio", "Piernas", "Coordinación"], equipamiento: ["Comba"],
            descripcion: "Mantén un ritmo constante. Variaciones: pies juntos, alternando pies, rodillas altas, saltos dobles.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Salto+Comba", series: 1, repeticiones: "3-10 min", descanso: 0
        },
        {
            id: "ej_C_002", nombre: "Jumping Jacks",
            musculosTrabajados: ["Cardio", "Cuerpo Completo"], equipamiento: ["Peso Corporal"],
            descripcion: "Un ejercicio clásico de calentamiento para elevar la frecuencia cardíaca.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Jumping+Jacks", series: 1, repeticiones: "20-30 reps o 1-2 min", descanso: 0
        },
        {
            id: "ej_C_003", nombre: "Estiramientos Dinámicos (General)",
            musculosTrabajados: ["Movilidad Articular"], equipamiento: ["Peso Corporal"],
            descripcion: "Incluye círculos de brazos, balanceos de piernas, rotaciones de torso. Prepara el cuerpo para el movimiento.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Estiramientos+Dinamicos", series: 1, repeticiones: "5-10 min", descanso: 0
        },
        {
            id: "ej_C_004", nombre: "Estiramientos Estáticos (General)",
            musculosTrabajados: ["Flexibilidad"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "Mantén cada estiramiento por 20-30 segundos. Enfócate en los músculos trabajados durante la sesión.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Estiramientos+Estaticos", series: 1, repeticiones: "5-10 min", descanso: 0
        },
        {
            id: "ej_C_005", nombre: "Bicicleta Estática (Cardio Ligero)",
            musculosTrabajados: ["Cardio", "Piernas"], equipamiento: ["Bicicleta Estática"],
            descripcion: "Mantén un ritmo constante y moderado. Ideal para calentamiento o enfriamiento.",
            imagenUrl: "https://placehold.co/300x200/2c3e50/ecf0f1?text=Bicicleta+Estatica", series: 1, repeticiones: "10-15 min", descanso: 0
        },
    ];

    // --- PLANES DE ENTRENAMIENTO (Corregidos y con calentamiento de bici en gym) ---
    const planesEntrenamiento = { // Contendrá las rutinas PREDETERMINADAS
        casa: { 
            lunes: { id: "casa_lun", nombre: "Empuje (Pecho, Hombros, Tríceps)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_P_001", series: 3, reps: "AMRAP" },
                    { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (adaptado casa)" },
                    { id_ejercicio: "ej_T_003", series: 3, reps: "AMRAP (fondos en sillas)" }
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            martes: { id: "casa_mar", nombre: "Tirón (Espalda, Bíceps)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_005", series: 4, reps: "10-15" }, 
                    { id_ejercicio: "ej_B_002", series: 3, reps: "10-15 c/brazo" }
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            miercoles: { id: "casa_mie", nombre: "Piernas (Isquios, Glúteos)", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (sin peso)"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_008", series: 4, reps: "12-15" }, 
                    { id_ejercicio: "ej_PI_002", series: 3, reps: "12-15 (con peso improvisado)" }, 
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/pierna" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            jueves: { id: "casa_jue", nombre: "Hombros y Abdominales", diaSemanaComparable: 4, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_H_003", series: 3, reps: "12-15" }, 
                    { id_ejercicio: "ej_H_004", series: 3, reps: "12-15" }, 
                    { id_ejercicio: "ej_A_001", series: 3, reps: "45-60s" }, 
                    { id_ejercicio: "ej_A_002", series: 3, reps: "15-20" }  
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            viernes: { id: "casa_vie", nombre: "Full Body Ligero", diaSemanaComparable: 5, componentes: [ 
                 { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_P_001", series: 2, reps: "AMRAP" }, 
                    { id_ejercicio: "ej_E_005", series: 2, reps: "10-12" }, 
                    { id_ejercicio: "ej_PI_008", series: 2, reps: "10-12" }, 
                    { id_ejercicio: "ej_B_002", series: 2, reps: "10-12 c/brazo" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            sabado: { id: "casa_sab", nombre: "Piernas (Cuádriceps, Gemelos) y Core", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_PI_008", reps: "10 (sin peso)"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_004", series: 4, reps: "12-15 c/pierna" }, 
                    { id_ejercicio: "ej_PI_007", series: 4, reps: "20-25" }, 
                    { id_ejercicio: "ej_A_003", series: 3, reps: "15-20" }  
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
        },
        gimnasio: { 
            lunes: { id: "gym_lun", nombre: "Empuje (Pecho, Hombros, Tríceps)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_P_002", series: 4, reps: "6-10" },    
                    { id_ejercicio: "ej_P_003", series: 3, reps: "8-12" },    
                    { id_ejercicio: "ej_H_002", series: 3, reps: "8-12" },    
                    { id_ejercicio: "ej_P_004", series: 3, reps: "10-15" }, 
                    { id_ejercicio: "ej_T_002", series: 3, reps: "10-15" },
                    { id_ejercicio: "ej_T_001", series: 3, reps: "10-12" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            martes: { id: "gym_mar", nombre: "Tirón (Espalda, Bíceps)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_001", series: 4, reps: "AMRAP o 6-10" }, 
                    { id_ejercicio: "ej_E_002", series: 3, reps: "8-10" },    
                    { id_ejercicio: "ej_E_003", series: 3, reps: "10-12" },   
                    { id_ejercicio: "ej_E_004", series: 3, reps: "10-12" }, 
                    { id_ejercicio: "ej_B_001", series: 3, reps: "8-12" },
                    { id_ejercicio: "ej_B_002", series: 3, reps: "10-12 c/brazo (martillo)" }
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            miercoles: { id: "gym_mie", nombre: "Piernas (Isquios, Glúteos)", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_001", series: 4, reps: "8-10" }, 
                    { id_ejercicio: "ej_PI_002", series: 3, reps: "10-12" },   
                    { id_ejercicio: "ej_PI_006", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_PI_003", series: 3, reps: "12-15" },
                    { id_ejercicio: "ej_PI_007", series: 3, reps: "15-20" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            jueves: { id: "gym_jue", nombre: "Hombros y Trapecios", diaSemanaComparable: 4, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_H_001", series: 4, reps: "6-10" },    
                    { id_ejercicio: "ej_H_003", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_H_004", series: 3, reps: "12-15" }, 
                    { id_ejercicio: "ej_E_002", series: 3, reps: "10-12 (remo al mentón para trapecio)" }, 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            viernes: { id: "gym_vie", nombre: "Espalda (Ancho y Densidad) y Bíceps (Volumen)", diaSemanaComparable: 5, componentes: [ // CORREGIDO
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_003", series: 4, reps: "8-12 (agarre ancho)" }, 
                    { id_ejercicio: "ej_E_004", series: 3, reps: "10-12 (agarre V)" }, 
                    { id_ejercicio: "ej_E_002", series: 3, reps: "10-12 (agarre supino)" }, 
                    { id_ejercicio: "ej_B_001", series: 3, reps: "10-15 (barra EZ)" },
                    { id_ejercicio: "ej_B_002", series: 3, reps: "12-15 c/brazo (curl martillo)" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            sabado: { id: "gym_sab", nombre: "Piernas (Énfasis Cuádriceps) y Core", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_001", series: 3, reps: "10-12 (Front squat o Zercher Squat)" }, 
                    { id_ejercicio: "ej_PI_005", series: 4, reps: "12-15" },   
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/pierna (zancadas caminando con mancuernas)" },
                    { id_ejercicio: "ej_PI_007", series: 4, reps: "15-20 (en máquina o con barra)" }, 
                    { id_ejercicio: "ej_A_003", series: 3, reps: "15-20 (colgado si es posible)" },
                    { id_ejercicio: "ej_A_001", series: 3, reps: "60s (con peso en la espalda si es posible)" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
        }
    };

    // --- ELEMENTOS DEL DOM ---
    const cronometroEntrenamientoGeneralDisplay = document.getElementById('cronometro-entrenamiento-general');
    const cronometroEjercicioActualDisplay = document.getElementById('cronometro-ejercicio-actual');
    const selectDiasEntrenamiento = document.getElementById('select-dias-entrenamiento');
    const inputUserName = document.getElementById('input-user-name');
    const diasMetaSemanaDisplay = document.getElementById('dias-meta-semana');
    const btnCerrarModalBiblioteca = document.getElementById('btn-cerrar-modal-biblioteca');
    const btnSeleccionarEjercicioModal = document.getElementById('btn-seleccionar-ejercicio-modal');
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
    const btnGuardarCambiosRutina = document.getElementById('btn-guardar-cambios-rutina'); // NUEVO
    const btnRestablecerRutinaDefault = document.getElementById('btn-restablecer-rutina-default'); // NUEVO
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

    // --- FUNCIONES ---
    function guardarEstado() {
        localStorage.setItem('entrenadorFitnessAppState_v5', JSON.stringify(appState)); // Nueva versión
    }

    function cargarEstado() {
        const estadoGuardado = localStorage.getItem('entrenadorFitnessAppState_v5');
        const estadoPorDefecto = {
            nombreUsuario: "Atleta Pro", appName: "Entrenador Élite", unidadesPeso: "kg",
            planActivoGeneral: "casa", diasEntrenamiento: 6, entrenamientosCompletados: {},
            rutinasPersonalizadas: {}, // Inicializar
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
            appState.rutinasPersonalizadas = estadoParseado.rutinasPersonalizadas || {}; // Cargar rutinas personalizadas
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
        let planDelDia = appState.rutinasPersonalizadas[rutinaDelDiaId] || planesEntrenamiento[appState.planActivoGeneral]?.[hoyNombre];
        
        if (appState.diasEntrenamiento === 5 && hoyNombre === "sabado") {
            planDelDia = { nombre: "Descanso", id: "descanso_sab" }; // id para consistencia, aunque no se guarda progreso de descanso
        }

        if (planDelDia && planDelDia.componentes && planDelDia.componentes.length > 0 && planDelDia.nombre !== "Descanso") {
            const completado = appState.entrenamientosCompletados[planDelDia.id];
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
        const diasConsiderados = appState.diasEntrenamiento === 5 
            ? ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] 
            : ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        
        diasConsiderados.forEach(dia => {
            const rutinaId = `${appState.planActivoGeneral}_${dia.substring(0,3)}`;
            // const planDia = appState.rutinasPersonalizadas[rutinaId] || planesEntrenamiento[appState.planActivoGeneral]?.[dia];
            // if (planDia && appState.entrenamientosCompletados[planDia.id]) {
            if (appState.entrenamientosCompletados[rutinaId]) { // Usar el ID original para marcar completado
                completados++;
            }
        });
        entrenamientosCompletadosSemanaDisplay.textContent = completados;
        diasMetaSemanaDisplay.textContent = appState.diasEntrenamiento;
    }

    function renderPantallaRutinas() {
        rutinasPlanTitle.textContent = `Plan ${appState.planActivoGeneral === 'casa' ? 'Casa' : 'Gimnasio'} (${appState.diasEntrenamiento} días)`;
        calendarioRutinasContainer.innerHTML = '';
        const diasOrdenadosNombres = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        
        for (let i = 0; i < diasOrdenadosNombres.length; i++) {
            const diaNombre = diasOrdenadosNombres[i];
            const rutinaId = `${appState.planActivoGeneral}_${diaNombre.substring(0,3)}`;
            const rutinaPredeterminada = planesEntrenamiento[appState.planActivoGeneral]?.[diaNombre];
            const rutinaDia = appState.rutinasPersonalizadas[rutinaId] || rutinaPredeterminada;

            if (appState.diasEntrenamiento === 5 && diaNombre === 'sabado') {
                const diaDiv = document.createElement('div');
                diaDiv.classList.add('card', 'rutina-dia-item', 'rutina-descanso');
                diaDiv.innerHTML = `<h4>Sábado</h4> <p>Descanso</p>`;
                calendarioRutinasContainer.appendChild(diaDiv);
                continue; 
            }

            if (rutinaDia && rutinaDia.nombre && rutinaDia.componentes) { // Asegurar que la rutina exista
                const completado = appState.entrenamientosCompletados[rutinaDia.id]; // El id debe ser el original del plan
                const diaDiv = document.createElement('div');
                diaDiv.classList.add('card', 'rutina-dia-item');
                
                if (rutinaDia.nombre === "Descanso" && appState.diasEntrenamiento === 6) { // Mostrar días de descanso si son parte del plan de 6 días
                    diaDiv.innerHTML = `<h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4> <p>Descanso</p>`;
                    diaDiv.classList.add('rutina-descanso');
                } else if (rutinaDia.nombre !== "Descanso") {
                     diaDiv.innerHTML = `
                        <h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4>
                        <p>${rutinaDia.nombre}</p>
                        <p style="color: ${completado ? 'var(--success-color)' : 'var(--secondary-color)'}; font-weight: bold;">
                            ${completado ? 'Completado <i class="fas fa-check-circle"></i>' : 'Pendiente'}
                        </p>
                    `;
                    diaDiv.addEventListener('click', () => renderDetallesEntrenamientoDia(appState.planActivoGeneral, diaNombre));
                } else {
                    // No renderizar si es un día de descanso implícito por ser 5 días y no es sábado (ya manejado)
                    continue;
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

        if (!rutinaAVisualizar || !rutinaAVisualizar.componentes || rutinaAVisualizar.componentes.length === 0 || rutinaAVisualizar.nombre === "Descanso") {
            alert("Este es un día de descanso o no tiene detalles configurados.");
            cambiarPestana('rutinas-section');
            return;
        }

        appState.componentesEnEdicion = JSON.parse(JSON.stringify(rutinaAVisualizar.componentes));
        // Guardar referencia a la rutina original (o personalizada si existe) para el botón "Comenzar" y "Guardar"
        appState.entrenamientoActual = { ...rutinaAVisualizar, plan: plan, dia: dia, id: rutinaId }; 
        appState.entrenamientoActualOriginalId = rutinaPredeterminada.id; // Siempre el ID del plan original

        detalleDiaNombreRutina.textContent = rutinaAVisualizar.nombre;
        detalleDiaTipoPlan.textContent = `Plan: ${plan === 'casa' ? 'En Casa' : 'De Gimnasio'}`;
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
                            <strong>${ejercicioData.nombre}</strong>
                            <span>Series: ${ejDef.series || ejercicioData.series}, Reps: ${ejDef.reps || ejercicioData.repeticiones}</span>
                        </div>
                        <div class="ejercicio-item-acciones">
                            <button class="btn btn-warning btn-sm btn-cambiar-ej" title="Cambiar Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-exchange-alt"></i></button>
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
        
        listaEjerciciosDiaContainer.querySelectorAll('.btn-quitar-ej').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                const ejIndex = parseInt(e.currentTarget.dataset.ejIndex);
                quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex);
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
        
        // Mostrar botón de restablecer si es una rutina personalizada
        btnRestablecerRutinaDefault.style.display = rutinaPersonalizada ? 'inline-block' : 'none';
        
        const completado = appState.entrenamientosCompletados[rutinaPredeterminada.id]; // Usar ID original para completado
        btnComenzarEntrenamientoDia.textContent = completado ? 'Repetir Entrenamiento' : 'Comenzar Entrenamiento con estos Ejercicios';
        btnComenzarEntrenamientoDia.className = completado ? 'btn btn-secondary' : 'btn btn-start-workout';
        cambiarPestana('detalles-entrenamiento-dia-section');
    }

    function quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex) {
        if (appState.componentesEnEdicion?.[compIndex]?.ejercicios) {
            appState.componentesEnEdicion[compIndex].ejercicios.splice(ejIndex, 1);
            // Re-renderizar solo la lista de ejercicios, no toda la pantalla de detalles
            // para evitar perder el estado de appState.entrenamientoActual si no es necesario
            actualizarVistaListaEjerciciosDia(); 
        }
    }
    
    function guardarCambiosRutinaActual() {
        if (!appState.entrenamientoActual || !appState.entrenamientoActual.id) {
            alert("No hay una rutina activa para guardar.");
            return;
        }
        const rutinaId = appState.entrenamientoActual.id; // Este es el ID único como 'casa_lun'
        // Guardar los componentesEnEdicion en rutinasPersonalizadas
        appState.rutinasPersonalizadas[rutinaId] = JSON.parse(JSON.stringify(appState.componentesEnEdicion));
        guardarEstado();
        alert("Cambios en la rutina guardados persistentemente.");
        btnRestablecerRutinaDefault.style.display = 'inline-block'; // Mostrar botón de restablecer ahora
    }

    function restablecerRutinaActualADefault() {
        if (!appState.entrenamientoActual || !appState.entrenamientoActual.id) return;
        const rutinaId = appState.entrenamientoActual.id;
        if (appState.rutinasPersonalizadas[rutinaId]) {
            if (confirm("¿Seguro que quieres restablecer esta rutina a su versión predeterminada? Se perderán tus cambios guardados.")) {
                delete appState.rutinasPersonalizadas[rutinaId];
                guardarEstado();
                // Volver a renderizar la pantalla de detalles con la rutina predeterminada
                renderDetallesEntrenamientoDia(appState.entrenamientoActual.plan, appState.entrenamientoActual.dia);
                alert("Rutina restablecida a la predeterminada.");
            }
        }
    }
    
    function actualizarVistaListaEjerciciosDia() { // Función auxiliar para re-renderizar solo la lista
        if (!appState.entrenamientoActual) return; // Necesitamos el contexto de la rutina actual
        listaEjerciciosDiaContainer.innerHTML = ''; // Limpiar contenedor
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
                            <strong>${ejercicioData.nombre}</strong>
                            <span>Series: ${ejDef.series || ejercicioData.series}, Reps: ${ejDef.reps || ejercicioData.repeticiones}</span>
                        </div>
                        <div class="ejercicio-item-acciones">
                            <button class="btn btn-warning btn-sm btn-cambiar-ej" title="Cambiar Ejercicio" data-comp-index="${indexComp}" data-ej-index="${indexEj}"><i class="fas fa-exchange-alt"></i></button>
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
        // Re-asignar listeners a los nuevos botones
        listaEjerciciosDiaContainer.querySelectorAll('.btn-quitar-ej').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const compIndex = parseInt(e.currentTarget.dataset.compIndex);
                const ejIndex = parseInt(e.currentTarget.dataset.ejIndex);
                quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex);
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


    function abrirModalBibliotecaParaModificar(compIndex, ejIndex) { // ejIndex es null si se añade
        appState.modificandoEjercicio.activo = true;
        appState.modificandoEjercicio.compIndex = compIndex;
        appState.modificandoEjercicio.ejIndex = ejIndex;
        
        renderPantallaBiblioteca(true); 
        detalleEjercicioModal.style.display = 'block';
        btnSeleccionarEjercicioModal.style.display = 'block'; 
        
        modalEjercicioNombre.textContent = ejIndex === null ? "Añadir Ejercicio al Componente" : "Cambiar Ejercicio";
        modalEjercicioImagen.style.display = 'none'; 
        modalEjercicioMusculos.parentElement.style.display = 'none';
        modalEjercicioEquipamiento.parentElement.style.display = 'none';
        modalEjercicioDescripcion.parentElement.style.display = 'block'; // Mostrar el div para la lista
        modalEjercicioDescripcion.innerHTML = ''; // Limpiar para la lista
        modalEjercicioDescripcion.style.maxHeight = 'calc(100vh - 400px)'; // Más espacio para la lista
        modalEjercicioDescripcion.style.overflowY = 'auto';
        // La lista se renderizará aquí por `filtrarYRenderizarBiblioteca(true)`
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
            actualizarVistaListaEjerciciosDia(); // Re-renderizar solo la lista
        }
        cerrarModalBiblioteca();
    }

    function iniciarEntrenamiento(plan, dia) {
        const rutinaId = `${plan}_${dia.substring(0,3)}`;
        // Para iniciar, siempre usamos los componentesEnEdicion, que reflejan la última vista del usuario.
        // Si el usuario guardó, componentesEnEdicion ya es igual a rutinasPersonalizadas[rutinaId].
        // Si no guardó, entrena con los cambios temporales.
        const componentesParaEntrenamiento = appState.componentesEnEdicion && appState.componentesEnEdicion.length > 0
                                           ? appState.componentesEnEdicion
                                           : (appState.rutinasPersonalizadas[rutinaId]?.componentes || planesEntrenamiento[plan]?.[dia]?.componentes);


        if (!componentesParaEntrenamiento || componentesParaEntrenamiento.length === 0 || componentesParaEntrenamiento.every(c => !c.ejercicios || c.ejercicios.length === 0)) {
            alert("No se puede iniciar: no hay ejercicios definidos o todos fueron quitados.");
            return;
        }
        
        const rutinaOriginal = planesEntrenamiento[plan]?.[dia];
        appState.entrenamientoActualOriginalId = rutinaOriginal.id; // Importante para marcar completado

        appState.entrenamientoActual = { 
            ...(rutinaOriginal || {}), // Base para nombre, etc.
            id: rutinaId, // Usar el ID consistente para la sesión
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
        // Asegurar que el índice de ejercicio es válido para el componente actual
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
                    while(appState.indiceComponenteActual > 0 &&
                          (!appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios ||
                           appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios.length === 0)) {
                        appState.indiceComponenteActual--;
                    }
                    const compAnterior = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
                    appState.indiceEjercicioActualEnComponente = (compAnterior && compAnterior.ejercicios) ? compAnterior.ejercicios.length - 1 : 0;
                }
            }
            const prevComp = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
            if (prevComp && prevComp.ejercicios && prevComp.ejercicios.length > 0) {
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
            const idRutinaOriginal = appState.entrenamientoActualOriginalId; // Usar el ID original guardado
            if (idRutinaOriginal) {
                 appState.entrenamientosCompletados[idRutinaOriginal] = true;
            }
        }
        const tiempoTotalFormateado = formatTiempoGeneral(appState.tiempoTotalEntrenamientoSegundos);
        appState.entrenamientoActual = null;
        appState.componentesEnEdicion = []; // Limpiar componentes en edición
        appState.entrenamientoActualOriginalId = null; 
        guardarEstado();
        alert(completado ? `¡Entrenamiento finalizado!\nTiempo total: ${tiempoTotalFormateado}` : "Entrenamiento abandonado.");
        cambiarPestana('hoy-section');
    }

    function renderPantallaBiblioteca(paraSeleccion = false) {
        const targetContainer = paraSeleccion ? modalEjercicioDescripcion : listaBibliotecaEjerciciosContainer;

        if (!paraSeleccion) { // Configuración para vista normal de biblioteca
            btnSeleccionarEjercicioModal.style.display = 'none';
            modalEjercicioMusculos.parentElement.style.display = 'block';
            modalEjercicioEquipamiento.parentElement.style.display = 'block';
            modalEjercicioDescripcion.parentElement.style.display = 'block';
            modalEjercicioImagen.style.display = 'block';
            targetContainer.style.display = 'grid'; // O el display que uses para la lista principal
            modalEjercicioDescripcion.style.maxHeight = '150px';
            modalEjercicioDescripcion.style.overflowY = 'auto';
        } else { // Configuración para modo selección dentro del modal
            btnSeleccionarEjercicioModal.style.display = 'none'; // El botón general del modal no se usa para seleccionar items individuales
            modalEjercicioMusculos.parentElement.style.display = 'none';
            modalEjercicioEquipamiento.parentElement.style.display = 'none';
            modalEjercicioImagen.style.display = 'none';
            modalEjercicioDescripcion.innerHTML = ''; 
            modalEjercicioDescripcion.style.maxHeight = 'calc(100vh - 400px)'; 
            modalEjercicioDescripcion.style.overflowY = 'auto';
        }

        if (selectFiltroGrupoMuscular.options.length <= 1) {
            const grupos = ["", ...new Set(bibliotecaEjercicios.flatMap(ej => ej.musculosTrabajados))];
            selectFiltroGrupoMuscular.innerHTML = ''; 
            grupos.sort().forEach(g => selectFiltroGrupoMuscular.add(new Option(g || "Grupo Muscular", g)));
        }
        if (selectFiltroEquipamiento.options.length <= 1) {
            const equips = ["", ...new Set(bibliotecaEjercicios.flatMap(ej => ej.equipamiento))];
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
            const coincideEquip = !equip || ej.equipamiento.includes(equip);
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
                div.style.padding = '12px';
                div.style.borderBottom = '1px solid var(--border-color)';
                div.style.cursor = 'pointer';
                div.innerHTML = `<strong>${ej.nombre}</strong> <br> <small>${ej.musculosTrabajados.join(', ')} / ${ej.equipamiento.join(', ')}</small>`;
                div.addEventListener('click', () => seleccionarEjercicioDesdeModal(ej.id));
            } else {
                div.innerHTML = `
                    <div class="card ejercicio-item-biblioteca"> 
                        <h4>${ej.nombre}</h4>
                        <img src="${ej.imagenUrl}" alt="${ej.nombre}" style="width:80px; height:auto; border-radius:4px; float:right; margin-left:10px;">
                        <p><strong>Músculos:</strong> ${ej.musculosTrabajados.join(', ')}</p>
                        <p><strong>Equipamiento:</strong> ${ej.equipamiento.join(', ')}</p>
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
        btnSeleccionarEjercicioModal.style.display = 'none';
        modalEjercicioMusculos.parentElement.style.display = 'block';
        modalEjercicioEquipamiento.parentElement.style.display = 'block';
        modalEjercicioDescripcion.parentElement.style.display = 'block';
        modalEjercicioImagen.style.display = 'block';
        //listaBibliotecaEjerciciosContainer.style.display = 'grid'; // Esto no debe estar aquí, es para la pestaña
        
        modalEjercicioNombre.textContent = ejercicio.nombre;
        modalEjercicioImagen.src = ejercicio.imagenUrl;
        modalEjercicioImagen.alt = ejercicio.nombre;
        modalEjercicioMusculos.textContent = ejercicio.musculosTrabajados.join(', ');
        modalEjercicioEquipamiento.textContent = ejercicio.equipamiento.join(', ');
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
        // No resetear filtros principales de la biblioteca al cerrar modal de selección
        // selectFiltroGrupoMuscular.value = ""; 
        // selectFiltroEquipamiento.value = "";
        
        // Restaurar el contenedor de descripción del modal y re-renderizar biblioteca si es necesario
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

    // --- EVENT LISTENERS ---
    tabButtons.forEach(button => button.addEventListener('click', () => cambiarPestana(button.dataset.tab)));
    btnVerRutinasDesdeHoy.addEventListener('click', () => cambiarPestana('rutinas-section'));
    btnSelectPlanCasa.addEventListener('click', () => { appState.planActivoGeneral = 'casa'; renderPantallaRutinas(); guardarEstado(); });
    btnSelectPlanGimnasio.addEventListener('click', () => { appState.planActivoGeneral = 'gimnasio'; renderPantallaRutinas(); guardarEstado(); });
    btnVolverARutinas.addEventListener('click', () => cambiarPestana('rutinas-section'));
    btnComenzarEntrenamientoDia.addEventListener('click', () => {
        if (appState.entrenamientoActual) { // entrenamientoActual se setea en renderDetalles
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
    
    btnSeleccionarEjercicioModal.addEventListener('click', () => {
        // Este botón es más un "Hecho" o "Cerrar" si la selección ocurre al hacer clic en el item de la lista
        // La lógica de selección real está en el event listener de los items de la biblioteca en modo selección
        cerrarModalBiblioteca(); 
    });
    
    // Ajustes
    btnGuardarAjustes.addEventListener('click', () => {
        appState.appName = appNameInput.value || "Entrenador Élite";
        appState.nombreUsuario = inputUserName.value || "Atleta";
        appState.unidadesPeso = selectUnidadesPeso.value;
        if (selectDiasEntrenamiento) {
            appState.diasEntrenamiento = parseInt(selectDiasEntrenamiento.value);
        }
        guardarEstado();
        renderPantallaHoy(); 
        renderPantallaRutinas();
        alert('Ajustes guardados.');
    });
    btnRestablecerProgresoTotal.addEventListener('click', () => {
        if (confirm("¿Restablecer progreso de entrenamientos completados?")) {
            appState.entrenamientosCompletados = {};
            guardarEstado();
            actualizarResumenSemanal();
            if (document.getElementById('rutinas-section').classList.contains('active-tab')) {
                 renderPantallaRutinas();
            }
            alert("Progreso de entrenamientos completados restablecido.");
        }
    });

    // --- INICIALIZACIÓN ---
    cargarEstado();
    cambiarPestana('hoy-section');
});