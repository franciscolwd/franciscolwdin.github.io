document.addEventListener('DOMContentLoaded', () => {
    let appState = {
        nombreUsuario: "Atleta Hipertrofia",
        appName: "Proyecto Hipertrofia",
        unidadesPeso: "kg",
        planActivoGeneral: "gimnasio", // Por defecto gimnasio para hipertrofia
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
            activo: false,
            compIndex: null,
            ejIndex: null, 
            idEjercicioAbiertoEnModal: null 
        }
    };

    // --- BIBLIOTECA DE EJERCICIOS (ENFOQUE HIPERTROFIA) ---
    const bibliotecaEjercicios = [
        // Pecho
        {
            id: "ej_P_001", nombre: "Flexiones (Push-ups) - Hipertrofia",
            musculosTrabajados: ["Pecho", "Hombros", "Tríceps"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "1. Posición: Manos ligeramente más anchas que los hombros. Cuerpo recto.\n2. Movimiento: Baja controladamente (2-3 seg) hasta que el pecho casi toque el suelo. Siente la tensión en el pecho.\n3. Retorno: Empuja explosivamente hacia arriba.\n4. Respiración: Inhala al bajar, exhala al subir.\n5. Clave Hipertrofia: Concéntrate en la contracción del pectoral. Considera añadir lastre si se vuelven muy fáciles para el rango de 8-15 reps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Flexiones+Hipertrofia", series: 3, repeticiones: "8-15 (al fallo o RIR 1-2)", descanso: 60 // RIR = Reps In Reserve
        },
        {
            id: "ej_P_002", nombre: "Press de Banca con Barra - Hipertrofia",
            musculosTrabajados: ["Pecho", "Hombros", "Tríceps"], equipamiento: ["Barra", "Discos", "Banco Plano"],
            descripcion: "1. Setup: Pies firmes, escápulas retraídas y deprimidas, ligero arco lumbar.\n2. Agarre: Un poco más ancho que los hombros.\n3. Movimiento: Baja la barra controladamente (2 seg) hasta el pecho medio-bajo. Codos a 45-75°.\n4. Retorno: Empuja la barra explosivamente. Contrae el pecho en la cima.\n5. Clave Hipertrofia: Mantén la tensión constante en el pecho. No rebotes la barra.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Press+Banca+Hipertrofia", series: 3, repeticiones: "6-10", descanso: 90
        },
        {
            id: "ej_P_003", nombre: "Press Inclinado con Mancuernas - Hipertrofia",
            musculosTrabajados: ["Pecho Superior", "Hombros", "Tríceps"], equipamiento: ["Mancuernas", "Banco Inclinado"],
            descripcion: "1. Banco: Inclinación de 30-45°.\n2. Movimiento: Baja las mancuernas lentamente hasta los lados del pecho superior, sintiendo el estiramiento.\n3. Retorno: Empuja hacia arriba y ligeramente hacia adentro, contrayendo el pectoral superior.\n4. Clave Hipertrofia: Rango de movimiento completo y control.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Press+Inclinado+Manc+H", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_P_004", nombre: "Aperturas con Mancuernas (Flyes) - Hipertrofia",
            musculosTrabajados: ["Pecho"], equipamiento: ["Mancuernas", "Banco Plano"],
            descripcion: "1. Movimiento: Baja las mancuernas en un arco amplio, manteniendo una ligera flexión en los codos. Enfócate en el estiramiento del pecho.\n2. Retorno: Contrae el pecho para juntar las mancuernas, sin que se toquen arriba para mantener tensión.\n3. Clave Hipertrofia: Movimiento controlado, no uses pesos excesivos que comprometan la forma.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Aperturas+Manc+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_P_005", nombre: "Fondos en Paralelas (Pecho) - Hipertrofia", // Enfasis pecho
            musculosTrabajados: ["Pecho Inferior", "Tríceps", "Hombros"], equipamiento: ["Barras Paralelas"],
            descripcion: "1. Agarre: Ancho, inclina el torso ligeramente hacia adelante.\n2. Movimiento: Baja lentamente hasta sentir un buen estiramiento en el pecho. Codos ligeramente hacia afuera.\n3. Retorno: Empuja hacia arriba contrayendo el pecho.\n4. Clave Hipertrofia: Si es muy fácil, añade lastre. Rango de movimiento completo.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Fondos+Pecho+H", series: 3, repeticiones: "8-12 (o AMRAP si es con peso corporal)", descanso: 75
        },
        // Espalda
        {
            id: "ej_E_001", nombre: "Dominadas (Pull-ups) - Hipertrofia",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps"], equipamiento: ["Barra de Dominadas", "Peso Corporal", "Lastre (opcional)"],
            descripcion: "1. Agarre: Prono, un poco más ancho que los hombros.\n2. Movimiento: Tira explosivamente hasta que la barbilla sobrepase la barra. Contrae la espalda.\n3. Retorno: Baja controladamente (2-3 seg), sintiendo el estiramiento en los dorsales.\n4. Clave Hipertrofia: Rango completo. Si puedes hacer más de 12, considera añadir lastre.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Dominadas+Hipertrofia", series: 3, repeticiones: "6-12 (o AMRAP)", descanso: 90
        },
        {
            id: "ej_E_002", nombre: "Remo con Barra - Hipertrofia",
            musculosTrabajados: ["Espalda (Dorsales, Romboides, Trapecio)", "Bíceps"], equipamiento: ["Barra", "Discos"],
            descripcion: "1. Postura: Torso inclinado (casi paralelo al suelo para remo Pendlay, o 45° para remo Yates), espalda recta.\n2. Movimiento: Tira de la barra hacia el abdomen/pecho bajo, retrayendo las escápulas fuertemente.\n3. Retorno: Baja la barra controladamente, manteniendo la tensión.\n4. Clave Hipertrofia: Conexión mente-músculo con la espalda, no solo tirar con los brazos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Remo+Barra+H", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_E_003", nombre: "Jalón al Pecho (Lat Pulldown) - Hipertrofia",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps"], equipamiento: ["Máquina de Jalones"],
            descripcion: "1. Agarre: Ancho y prono.\n2. Movimiento: Tira de la barra hacia la parte superior del pecho. Enfócate en llevar los codos hacia abajo y atrás, contrayendo los dorsales.\n3. Retorno: Controla la subida, sintiendo el estiramiento.\n4. Clave Hipertrofia: Evita el balanceo excesivo. Siente el 'apretón' en la espalda.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Jalon+Pecho+H", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_E_004", nombre: "Remo Sentado en Polea (Agarre Estrecho) - Hipertrofia",
            musculosTrabajados: ["Espalda (Densidad, Romboides)", "Bíceps"], equipamiento: ["Máquina de Remo en Polea", "Agarre V"],
            descripcion: "1. Movimiento: Tira del agarre V hacia tu abdomen, manteniendo el torso erguido. Aprieta los omóplatos juntos en la contracción máxima.\n2. Retorno: Permite un estiramiento completo de los omóplatos hacia adelante sin encorvar la lumbar.\n3. Clave Hipertrofia: Contracción máxima y estiramiento controlado.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Remo+Polea+Estrecho+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_E_005", nombre: "Remo con Mancuerna a un Brazo - Hipertrofia",
            musculosTrabajados: ["Espalda (Dorsales)", "Bíceps", "Core"], equipamiento: ["Mancuerna", "Banco Plano"],
            descripcion: "1. Posición: Apoya una rodilla y mano en el banco, espalda paralela al suelo.\n2. Movimiento: Tira de la mancuerna hacia tu cadera, manteniendo el codo cerca del cuerpo. Contrae el dorsal.\n3. Retorno: Baja la mancuerna lentamente, sintiendo el estiramiento.\n4. Clave Hipertrofia: Rango de movimiento completo y evita rotar el torso excesivamente.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Remo+Mancuerna+1B+H", series: 3, repeticiones: "8-12 c/brazo", descanso: 60 // Descanso entre brazos, luego descanso completo
        },
        // Piernas
        {
            id: "ej_PI_001", nombre: "Sentadilla con Barra (Back Squat) - Hipertrofia",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales", "Core"], equipamiento: ["Barra", "Discos", "Rack"],
            descripcion: "1. Barra: Alta (sobre trapecios) o baja (sobre deltoides posteriores).\n2. Movimiento: Desciende controladamente (2-3 seg) hasta romper la paralela (cadera por debajo de rodillas) si tu movilidad lo permite. Mantén la espalda neutra.\n3. Retorno: Sube potentemente, empujando desde los talones y contrayendo los glúteos.\n4. Clave Hipertrofia: Profundidad y control.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Sentadilla+Barra+H", series: 4, repeticiones: "8-12", descanso: 90-120
        },
        {
            id: "ej_PI_002", nombre: "Peso Muerto Rumano (RDL) - Hipertrofia",
            musculosTrabajados: ["Isquiotibiales", "Glúteos", "Espalda Baja"], equipamiento: ["Barra", "Mancuernas"],
            descripcion: "1. Movimiento: Empuja las caderas hacia atrás, manteniendo una ligera flexión en las rodillas y la espalda recta. Baja el peso sintiendo el estiramiento profundo en los isquios.\n2. Retorno: Contrae los glúteos e isquios para volver a la vertical.\n3. Clave Hipertrofia: No es necesario tocar el suelo, enfócate en la tensión de los isquiotibiales.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=RDL+H", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_PI_003", nombre: "Prensa de Piernas (Leg Press) - Hipertrofia",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales"], equipamiento: ["Máquina de Prensa de Piernas"],
            descripcion: "1. Posición Pies: Varía para enfocar diferentes áreas (más altos para glúteos/isquios, más bajos para cuádriceps).\n2. Movimiento: Baja controladamente hasta un buen rango de movimiento. No dejes que la lumbar se despegue del asiento.\n3. Retorno: Empuja sin bloquear las rodillas.\n4. Clave Hipertrofia: Tiempo bajo tensión, especialmente en la fase excéntrica.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Prensa+Piernas+H", series: 4, repeticiones: "10-15", descanso: 75
        },
        {
            id: "ej_PI_004", nombre: "Zancadas (Lunges) - Hipertrofia",
            musculosTrabajados: ["Cuádriceps", "Glúteos"], equipamiento: ["Mancuernas", "Peso Corporal", "Barra"],
            descripcion: "1. Movimiento: Da un paso largo y baja la cadera. Ambas rodillas a 90°.\n2. Variaciones: Caminando, estáticas, búlgaras (pie trasero elevado para mayor dificultad).\n3. Clave Hipertrofia: Mantén el torso erguido y empuja con el talón del pie delantero.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Zancadas+H", series: 3, repeticiones: "8-12 c/pierna", descanso: 60
        },
        {
            id: "ej_PI_005", nombre: "Extensiones de Cuádriceps - Hipertrofia",
            musculosTrabajados: ["Cuádriceps"], equipamiento: ["Máquina de Extensiones"],
            descripcion: "1. Movimiento: Extiende las piernas completamente, apretando los cuádriceps en la cima por 1-2 segundos.\n2. Retorno: Baja lentamente, controlando el peso.\n3. Clave Hipertrofia: Contracción máxima y control. Buen ejercicio de aislamiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Extensiones+Cuads+H", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_PI_006", nombre: "Curl Femoral (Tumbado o Sentado) - Hipertrofia",
            musculosTrabajados: ["Isquiotibiales"], equipamiento: ["Máquina de Curl Femoral"],
            descripcion: "1. Movimiento: Flexiona las rodillas llevando los talones hacia los glúteos. Contrae los isquios.\n2. Retorno: Extiende las piernas lentamente.\n3. Clave Hipertrofia: Evita usar impulso de la cadera. Concéntrate en los isquiotibiales.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Curl+Femoral+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_PI_007", nombre: "Elevaciones de Gemelos (De pie o Sentado) - Hipertrofia",
            musculosTrabajados: ["Gemelos (Gastrocnemio, Sóleo)"], equipamiento: ["Peso Corporal", "Mancuernas", "Máquina de Gemelos"],
            descripcion: "1. Movimiento: Elévate sobre las puntas de los pies lo más alto posible, apretando los gemelos. Mantén 1 segundo arriba.\n2. Retorno: Baja lentamente, sintiendo el estiramiento.\n3. Clave Hipertrofia: Rango completo y pausas en la contracción/estiramiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Gemelos+H", series: 4, repeticiones: "12-20", descanso: 45
        },
        {
            id: "ej_PI_008", nombre: "Sentadilla Goblet - Hipertrofia",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Core"], equipamiento: ["Mancuerna", "Kettlebell"],
            descripcion: "1. Movimiento: Sentadilla profunda manteniendo el torso erguido y la pesa pegada al pecho.\n2. Clave Hipertrofia: Excelente para mantener la forma y trabajar el core. Desciende lentamente.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Sentadilla+Goblet+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        // Hombros
        {
            id: "ej_H_001", nombre: "Press Militar con Barra (De pie) - Hipertrofia",
            musculosTrabajados: ["Hombros (Deltoides)", "Tríceps"], equipamiento: ["Barra", "Discos"],
            descripcion: "1. Movimiento: Empuja la barra verticalmente desde la parte alta del pecho hasta la extensión completa sobre la cabeza. Core apretado.\n2. Retorno: Baja la barra controladamente hasta la clavícula/hombros.\n3. Clave Hipertrofia: Movimiento estricto, sin impulso de piernas (a menos que sea Push Press, que es diferente).",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Press+Militar+H", series: 3, repeticiones: "6-10", descanso: 90
        },
        {
            id: "ej_H_002", nombre: "Press de Hombros con Mancuernas (Sentado) - Hipertrofia",
            musculosTrabajados: ["Hombros (Deltoides)", "Tríceps"], equipamiento: ["Mancuernas", "Banco con Respaldo"],
            descripcion: "1. Movimiento: Empuja las mancuernas hacia arriba y ligeramente hacia adentro. Controla la bajada.\n2. Clave Hipertrofia: Permite un gran rango de movimiento y es bueno para la estabilidad del hombro.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Press+Hombro+Manc+H", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_H_003", nombre: "Elevaciones Laterales con Mancuernas - Hipertrofia",
            musculosTrabajados: ["Hombros (Deltoides Lateral)"], equipamiento: ["Mancuernas"],
            descripcion: "1. Movimiento: Eleva los brazos hacia los lados hasta la altura de los hombros, con una ligera flexión en codos. Imagina que viertes jarras de agua.\n2. Retorno: Baja lentamente, resistiendo la gravedad.\n3. Clave Hipertrofia: No uses impulso. Enfócate en el deltoides medio.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Elevaciones+Laterales+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_H_004", nombre: "Elevaciones Frontales con Mancuernas/Disco - Hipertrofia",
            musculosTrabajados: ["Hombros (Deltoides Anterior)"], equipamiento: ["Mancuernas", "Disco"],
            descripcion: "1. Movimiento: Eleva el peso hacia el frente hasta la altura de los hombros, manteniendo el brazo casi recto.\n2. Clave Hipertrofia: Controla el movimiento, especialmente la bajada. Puedes alternar brazos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Elevaciones+Frontales+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_H_005", nombre: "Pájaros (Bent-Over Dumbbell Raise) - Hipertrofia",
            musculosTrabajados: ["Hombros (Deltoides Posterior)", "Trapecio"], equipamiento: ["Mancuernas"],
            descripcion: "1. Posición: Inclina el torso hacia adelante, espalda recta, rodillas ligeramente flexionadas.\n2. Movimiento: Eleva las mancuernas hacia los lados, manteniendo una ligera flexión en los codos. Contrae los deltoides posteriores y los omóplatos.\n3. Clave Hipertrofia: Movimiento controlado, no uses impulso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Pajaros+Hombro+H", series: 3, repeticiones: "12-15", descanso: 60
        },
        // Brazos (Bíceps y Tríceps)
        {
            id: "ej_B_001", nombre: "Curl de Bíceps con Barra - Hipertrofia",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Barra Recta", "Barra EZ"],
            descripcion: "1. Movimiento: Flexiona los codos llevando la barra hacia los hombros. Aprieta los bíceps en la cima.\n2. Retorno: Baja la barra lentamente (2-3 seg), extendiendo completamente los brazos.\n3. Clave Hipertrofia: Evita el balanceo. Rango completo de movimiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Curl+Biceps+Barra+H", series: 3, repeticiones: "8-12", descanso: 60-75
        },
        {
            id: "ej_B_002", nombre: "Curl de Bíceps con Mancuernas (Supinación) - Hipertrofia",
            musculosTrabajados: ["Bíceps"], equipamiento: ["Mancuernas"],
            descripcion: "1. Movimiento: Comienza con agarre neutro (palmas enfrentadas) y supina (gira las palmas hacia arriba) mientras subes la mancuerna. Contrae el bíceps.\n2. Retorno: Baja lentamente, revirtiendo el movimiento.\n3. Clave Hipertrofia: La supinación activa más el pico del bíceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Curl+Biceps+Manc+Sup+H", series: 3, repeticiones: "8-12 c/brazo", descanso: 60
        },
        {
            id: "ej_B_003", nombre: "Curl Martillo con Mancuernas - Hipertrofia",
            musculosTrabajados: ["Bíceps (Braquial)", "Antebrazo (Braquiorradial)"], equipamiento: ["Mancuernas"],
            descripcion: "1. Agarre: Neutro (palmas enfrentadas) durante todo el movimiento.\n2. Clave Hipertrofia: Desarrolla el grosor del brazo.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Curl+Martillo+H", series: 3, repeticiones: "8-12 c/brazo", descanso: 60
        },
        {
            id: "ej_T_001", nombre: "Press Francés (Skullcrushers) - Hipertrofia",
            musculosTrabajados: ["Tríceps"], equipamiento: ["Barra EZ", "Mancuernas", "Banco Plano"],
            descripcion: "1. Movimiento: Baja el peso hacia la frente o ligeramente detrás de la cabeza, manteniendo los codos relativamente fijos y apuntando hacia el techo.\n2. Retorno: Extiende los brazos usando la fuerza del tríceps.\n3. Clave Hipertrofia: Controla la fase excéntrica para proteger los codos y maximizar la tensión.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Press+Frances+H", series: 3, repeticiones: "8-12", descanso: 60-75
        },
        {
            id: "ej_T_002", nombre: "Extensiones de Tríceps en Polea Alta (Cuerda) - Hipertrofia",
            musculosTrabajados: ["Tríceps"], equipamiento: ["Máquina de Poleas", "Cuerda"],
            descripcion: "1. Movimiento: Extiende los brazos hacia abajo y separa ligeramente las manos al final del movimiento para una mayor contracción del tríceps.\n2. Retorno: Sube controladamente.\n3. Clave Hipertrofia: Aprieta los tríceps en la posición de máxima extensión.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Extension+Triceps+Cuerda+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_T_003", nombre: "Fondos entre Bancos (o silla) - Hipertrofia", // Adaptación de Dips
            musculosTrabajados: ["Tríceps", "Pecho"], equipamiento: ["Bancos", "Sillas"],
            descripcion: "1. Posición: Manos en un banco, talones en otro (o suelo para más fácil).\n2. Movimiento: Baja el cuerpo doblando los codos hasta que los brazos superiores estén paralelos al suelo. Codos hacia atrás.\n3. Clave Hipertrofia: Si es fácil, coloca peso sobre los muslos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Fondos+Bancos+H", series: 3, repeticiones: "10-15 (o AMRAP)", descanso: 60
        },
        // Abdominales y Core
        {
            id: "ej_A_001", nombre: "Plancha Abdominal (con peso opcional) - Hipertrofia",
            musculosTrabajados: ["Abdominales", "Core"], equipamiento: ["Peso Corporal", "Colchoneta", "Disco (opcional)"],
            descripcion: "1. Mantenimiento: Contrae fuertemente abdominales y glúteos. Para hipertrofia, considera añadir un disco en la espalda baja o reducir el tiempo y aumentar la intensidad de la contracción.\n2. Clave Hipertrofia: Si 60s es fácil, añade peso o haz variaciones más difíciles.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Plancha+Peso+H", series: 3, repeticiones: "30-60s (o hasta fallo técnico)", descanso: 45
        },
        {
            id: "ej_A_002", nombre: "Crunches en Polea Alta (Cable Crunches) - Hipertrofia",
            musculosTrabajados: ["Abdominales (Recto Abdominal)"], equipamiento: ["Máquina de Poleas", "Cuerda"],
            descripcion: "1. Posición: De rodillas frente a la polea alta, sosteniendo la cuerda a los lados de la cabeza.\n2. Movimiento: Flexiona el torso llevando los codos hacia las rodillas, contrayendo los abdominales. Mantén la cadera fija.\n3. Clave Hipertrofia: Permite añadir carga progresiva.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Crunches+H", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_A_003", nombre: "Elevaciones de Piernas Colgado (Hanging Leg Raises) - Hipertrofia",
            musculosTrabajados: ["Abdominales Inferiores", "Flexores de Cadera"], equipamiento: ["Barra de Dominadas"],
            descripcion: "1. Movimiento: Colgado de la barra, levanta las piernas (rectas o flexionadas para más fácil) lo más alto posible sin usar impulso. Controla la bajada.\n2. Clave Hipertrofia: Uno de los mejores para abdominales inferiores si se hace correctamente.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Hanging+Leg+Raises+H", series: 3, repeticiones: "8-15 (o AMRAP)", descanso: 60
        },
        // Cardio y Calentamiento/Enfriamiento General (sin cambios significativos para hipertrofia, su propósito es diferente)
        {
            id: "ej_C_001", nombre: "Salto de Comba",
            musculosTrabajados: ["Cardio", "Piernas", "Coordinación"], equipamiento: ["Comba"],
            descripcion: "Mantén un ritmo constante. Variaciones: pies juntos, alternando pies, rodillas altas, saltos dobles.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Salto+Comba", series: 1, repeticiones: "3-10 min", descanso: 0
        },
        {
            id: "ej_C_002", nombre: "Jumping Jacks",
            musculosTrabajados: ["Cardio", "Cuerpo Completo"], equipamiento: ["Peso Corporal"],
            descripcion: "Un ejercicio clásico de calentamiento para elevar la frecuencia cardíaca.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Jumping+Jacks", series: 1, repeticiones: "20-30 reps o 1-2 min", descanso: 0
        },
        {
            id: "ej_C_003", nombre: "Estiramientos Dinámicos (General)",
            musculosTrabajados: ["Movilidad Articular"], equipamiento: ["Peso Corporal"],
            descripcion: "Incluye círculos de brazos, balanceos de piernas, rotaciones de torso. Prepara el cuerpo para el movimiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Dinamicos", series: 1, repeticiones: "5-10 min", descanso: 0
        },
        {
            id: "ej_C_004", nombre: "Estiramientos Estáticos (General)",
            musculosTrabajados: ["Flexibilidad"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "Mantén cada estiramiento por 20-30 segundos. Enfócate en los músculos trabajados durante la sesión.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Estaticos", series: 1, repeticiones: "5-10 min", descanso: 0
        },
        {
            id: "ej_C_005", nombre: "Bicicleta Estática (Cardio Ligero)",
            musculosTrabajados: ["Cardio", "Piernas"], equipamiento: ["Bicicleta Estática"],
            descripcion: "Mantén un ritmo constante y moderado. Ideal para calentamiento o enfriamiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Bicicleta+Estatica", series: 1, repeticiones: "10-15 min", descanso: 0
        },
    ];

    // --- PLANES DE ENTRENAMIENTO (ENFOQUE HIPERTROFIA) ---
    const planesEntrenamiento = {
        casa: { // Rutinas de casa adaptadas para hipertrofia (más series/reps donde sea posible)
            lunes: { id: "casa_lun", nombre: "Empuje Casa (Pecho, Hombros, Tríceps)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_P_001", series: 4, reps: "8-15 (al fallo)" }, // Flexiones
                    { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (con peso improvisado)" }, // Press Hombro Manc.
                    { id_ejercicio: "ej_T_003", series: 3, reps: "8-15 (fondos en sillas, añadir peso si es posible)" } // Fondos
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            martes: { id: "casa_mar", nombre: "Tirón Casa (Espalda, Bíceps)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_005", series: 4, reps: "8-12 (TRX o remo bajo mesa)" }, 
                    { id_ejercicio: "ej_B_002", series: 3, reps: "10-15 c/brazo (con peso improvisado)" }
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            miercoles: { id: "casa_mie", nombre: "Piernas Casa (Énfasis Cuádriceps y Glúteos)", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_PI_008", reps: "12-15 (sin peso)"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_008", series: 4, reps: "10-15 (con peso)" }, // Sentadilla Goblet
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/pierna (con peso)" }, // Zancadas
                    { id_ejercicio: "ej_PI_007", series: 3, reps: "15-20 (elevaciones de gemelos con peso)" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            jueves: { id: "casa_jue", nombre: "Hombros y Tríceps Casa", diaSemanaComparable: 4, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (press hombro con peso improvisado)" }, 
                    { id_ejercicio: "ej_H_003", series: 3, reps: "12-15 (elevaciones laterales)" }, 
                    { id_ejercicio: "ej_T_003", series: 3, reps: "10-15 (fondos en silla, pies elevados para más dificultad)" }, 
                    { id_ejercicio: "ej_A_001", series: 3, reps: "45-60s" }  // Plancha
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            viernes: { id: "casa_vie", nombre: "Espalda y Bíceps Casa (Volumen)", diaSemanaComparable: 5, componentes: [ 
                 { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_002", reps: "1 min"}, { id_ejercicio: "ej_C_003", reps: "4 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_005", series: 4, reps: "10-15 (variar agarre si es TRX)" }, 
                    { id_ejercicio: "ej_B_002", series: 4, reps: "10-12 c/brazo (curl concentrado o martillo)" }
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
            sabado: { id: "casa_sab", nombre: "Piernas Casa (Énfasis Isquios y Glúteos) y Core", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_001", reps: "3 min"}, { id_ejercicio: "ej_PI_008", reps: "10 (sin peso)"}, { id_ejercicio: "ej_C_003", reps: "3 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_002", series: 4, reps: "10-15 (RDL con peso improvisado)" }, 
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "12-15 c/pierna (zancadas búlgaras si es posible)" }, 
                    { id_ejercicio: "ej_A_003", series: 3, reps: "12-15" }  // Elevaciones de Piernas
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5 min"}] }
            ]},
        },
        gimnasio: { // Rutinas de gimnasio con enfoque hipertrofia
            lunes: { id: "gym_lun", nombre: "Pecho y Tríceps (Hipertrofia)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_P_002", series: 4, reps: "6-10" },    // Press Banca Barra
                    { id_ejercicio: "ej_P_003", series: 3, reps: "8-12" },    // Press Inclinado Manc.
                    { id_ejercicio: "ej_P_004", series: 3, reps: "10-15" },   // Aperturas Manc.
                    { id_ejercicio: "ej_T_001", series: 3, reps: "8-12" },    // Press Francés
                    { id_ejercicio: "ej_T_002", series: 3, reps: "10-15 (cuerda)" } // Ext. Tríceps Polea
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            martes: { id: "gym_mar", nombre: "Espalda y Bíceps (Hipertrofia)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_E_001", series: 4, reps: "6-10 (con lastre si es posible)" }, // Dominadas
                    { id_ejercicio: "ej_E_002", series: 3, reps: "8-10 (pesado)" },    // Remo con Barra
                    { id_ejercicio: "ej_E_003", series: 3, reps: "10-12" },   // Jalón al Pecho
                    { id_ejercicio: "ej_E_004", series: 3, reps: "10-12 (agarre estrecho)" }, // Remo Sentado Polea
                    { id_ejercicio: "ej_B_001", series: 3, reps: "8-10" },     // Curl Bíceps Barra
                    { id_ejercicio: "ej_B_002", series: 3, reps: "10-12 c/brazo (supinando)" } // Curl Manc.
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            miercoles: { id: "gym_mie", nombre: "Piernas (Énfasis Cuádriceps y Glúteos) - Hipertrofia", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_001", series: 4, reps: "8-10" }, // Sentadilla Barra
                    { id_ejercicio: "ej_PI_003", series: 4, reps: "10-12" },   // Prensa de Piernas
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/pierna (zancadas con barra o mancuernas)" },
                    { id_ejercicio: "ej_PI_005", series: 3, reps: "12-15" },   // Ext. Cuádriceps
                    { id_ejercicio: "ej_PI_007", series: 4, reps: "12-15 (de pie)" } // Gemelos
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            jueves: { id: "gym_jue", nombre: "Hombros (Completo) - Hipertrofia", diaSemanaComparable: 4, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_H_001", series: 4, reps: "6-10" },    // Press Militar Barra
                    { id_ejercicio: "ej_H_002", series: 3, reps: "8-12 (sentado con mancuernas)" },   
                    { id_ejercicio: "ej_H_003", series: 4, reps: "10-15" },   // Elev. Laterales
                    { id_ejercicio: "ej_H_005", series: 3, reps: "12-15" }, // Pájaros (Deltoides Posterior)
                    // { id_ejercicio: "ej_E_002", series: 3, reps: "10-12 (remo al mentón para trapecio)" }, // Opcional Trapecio
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            viernes: { id: "gym_vie", nombre: "Piernas (Énfasis Isquios y Glúteos) - Hipertrofia", diaSemanaComparable: 5, componentes: [ // Cambiado de Espalda/Bíceps a Piernas para un split más común
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_002", series: 4, reps: "8-12 (RDL con barra)" }, 
                    { id_ejercicio: "ej_PI_006", series: 3, reps: "10-15 (Curl femoral tumbado)" }, 
                    { id_ejercicio: "ej_PI_003", series: 3, reps: "10-15 (Prensa, pies altos para isquios/glúteos)" }, 
                    { id_ejercicio: "ej_PI_004", series: 3, reps: "10-12 c/pierna (Zancadas búlgaras)" },
                    { id_ejercicio: "ej_PI_007", series: 4, reps: "12-15 (gemelos sentado)" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            sabado: { id: "gym_sab", nombre: "Brazos (Bíceps y Tríceps) y Core - Hipertrofia", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_B_001", series: 3, reps: "8-10 (Barra EZ)" }, 
                    { id_ejercicio: "ej_B_002", series: 3, reps: "10-12 c/brazo (Curl inclinado con mancuernas)" },   
                    { id_ejercicio: "ej_B_003", series: 3, reps: "10-12 c/brazo (Curl martillo)" },
                    { id_ejercicio: "ej_T_001", series: 3, reps: "8-10 (Press francés)" }, 
                    { id_ejercicio: "ej_T_002", series: 3, reps: "10-12 (Extensión en polea con cuerda)" },
                    { id_ejercicio: "ej_A_002", series: 3, reps: "12-15 (Cable crunches)" },
                    { id_ejercicio: "ej_A_003", series: 3, reps: "AMRAP (Elevaciones de piernas colgado)" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
        }
    };

    // --- ELEMENTOS DEL DOM (sin cambios respecto a la versión anterior) ---
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


    // --- FUNCIONES ---
    function guardarEstado() {
        localStorage.setItem('entrenadorFitnessAppState_v6_hipertrofia', JSON.stringify(appState)); // Nueva versión
    }

    function cargarEstado() {
        const estadoGuardado = localStorage.getItem('entrenadorFitnessAppState_v6_hipertrofia');
        const estadoPorDefecto = {
            nombreUsuario: "Atleta Hipertrofia", appName: "Proyecto Hipertrofia", unidadesPeso: "kg",
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
        let planDelDia = appState.rutinasPersonalizadas[rutinaDelDiaId] || planesEntrenamiento[appState.planActivoGeneral]?.[hoyNombre];
        
        if (appState.diasEntrenamiento === 5 && hoyNombre === "sabado") {
            planDelDia = { nombre: "Descanso", id: "descanso_sab" };
        }

        if (planDelDia && planDelDia.componentes && planDelDia.componentes.length > 0 && planDelDia.nombre !== "Descanso") {
            const completado = appState.entrenamientosCompletados[planDelDia.id]; // Usa el ID original para completado
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
            const rutinaIdOriginal = planesEntrenamiento[appState.planActivoGeneral]?.[dia]?.id; // Siempre el ID original
            if (rutinaIdOriginal && appState.entrenamientosCompletados[rutinaIdOriginal]) {
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
            // Si son 5 días y es viernes, y el plan de gimnasio tiene una rutina específica para viernes (no la de full body), se muestra.
            // La lógica de "Full Body para 5 días" se manejaba en la estructura de datos, ahora es más directo.

            if (rutinaDia && rutinaDia.nombre && rutinaDia.componentes) {
                const idOriginalParaCompletado = rutinaPredeterminada.id; // Usar siempre el ID original para el estado de completado
                const completado = appState.entrenamientosCompletados[idOriginalParaCompletado];
                const diaDiv = document.createElement('div');
                diaDiv.classList.add('card', 'rutina-dia-item');
                
                // Si el nombre de la rutina actual (personalizada o default) es "Descanso", tratarlo como tal
                if (rutinaDia.nombre === "Descanso") { 
                    diaDiv.innerHTML = `<h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4> <p>Descanso</p>`;
                    diaDiv.classList.add('rutina-descanso');
                } else {
                     diaDiv.innerHTML = `
                        <h4>${diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}</h4>
                        <p>${rutinaDia.nombre} ${appState.rutinasPersonalizadas[rutinaId] ? '<i class="fas fa-edit" title="Rutina Personalizada"></i>' : ''}</p>
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

        if (!rutinaAVisualizar || !rutinaAVisualizar.componentes || rutinaAVisualizar.componentes.length === 0 || rutinaAVisualizar.nombre === "Descanso") {
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
        
        btnRestablecerRutinaDefault.style.display = rutinaPersonalizada ? 'inline-block' : 'none';
        const completado = appState.entrenamientosCompletados[rutinaPredeterminada.id];
        btnComenzarEntrenamientoDia.textContent = completado ? 'Repetir Entrenamiento' : 'Comenzar con estos Ejercicios';
        btnComenzarEntrenamientoDia.className = completado ? 'btn btn-secondary' : 'btn btn-start-workout';
        cambiarPestana('detalles-entrenamiento-dia-section');
    }

    function quitarEjercicioDeComponentesEnEdicion(compIndex, ejIndex) {
        if (appState.componentesEnEdicion?.[compIndex]?.ejercicios) {
            appState.componentesEnEdicion[compIndex].ejercicios.splice(ejIndex, 1);
            actualizarVistaListaEjerciciosDia(); 
        }
    }
    
    function guardarCambiosRutinaActual() {
        if (!appState.entrenamientoActual || !appState.entrenamientoActual.id) {
            alert("No hay una rutina activa para guardar.");
            return;
        }
        const rutinaId = appState.entrenamientoActual.id;
        // Crear una copia de la rutina con los componentes modificados
        const rutinaModificadaParaGuardar = {
            ...appState.entrenamientoActual, // Copia otras propiedades como nombre, id, etc.
            componentes: JSON.parse(JSON.stringify(appState.componentesEnEdicion)) // Copia profunda de los componentes
        };
        appState.rutinasPersonalizadas[rutinaId] = rutinaModificadaParaGuardar;
        guardarEstado();
        alert("Cambios en la rutina guardados.");
        btnRestablecerRutinaDefault.style.display = 'inline-block';
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
    }

    function abrirModalBibliotecaParaModificar(compIndex, ejIndex) { 
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
        modalEjercicioDescripcion.parentElement.style.display = 'block'; 
        modalEjercicioDescripcion.innerHTML = ''; 
        modalEjercicioDescripcion.style.maxHeight = 'calc(100vh - 400px)'; 
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
        const rutinaOriginalPredeterminada = planesEntrenamiento[plan]?.[dia]; // Para el ID original
        if (!rutinaOriginalPredeterminada) {
            alert("Error: No se encontró la rutina base para iniciar.");
            return;
        }
        appState.entrenamientoActualOriginalId = rutinaOriginalPredeterminada.id;

        // Usar componentesEnEdicion si existen y tienen contenido, sino la personalizada, sino la default
        let componentesParaEntrenamiento;
        if (appState.componentesEnEdicion && appState.componentesEnEdicion.length > 0 && appState.componentesEnEdicion.some(c => c.ejercicios && c.ejercicios.length > 0)) {
            componentesParaEntrenamiento = appState.componentesEnEdicion;
        } else if (appState.rutinasPersonalizadas[rutinaId] && appState.rutinasPersonalizadas[rutinaId].componentes.some(c => c.ejercicios && c.ejercicios.length > 0)) {
            componentesParaEntrenamiento = appState.rutinasPersonalizadas[rutinaId].componentes;
        } else {
            componentesParaEntrenamiento = rutinaOriginalPredeterminada.componentes;
        }


        if (!componentesParaEntrenamiento || componentesParaEntrenamiento.length === 0 || componentesParaEntrenamiento.every(c => !c.ejercicios || c.ejercicios.length === 0)) {
            alert("No se puede iniciar: no hay ejercicios definidos o todos fueron quitados.");
            return;
        }
        
        appState.entrenamientoActual = { 
            ...(appState.rutinasPersonalizadas[rutinaId] || rutinaOriginalPredeterminada), // Base para nombre, etc.
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
                    while(appState.indiceComponenteActual >= 0 && // Corrección: >= 0
                          (!appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios ||
                           appState.entrenamientoActual.componentes[appState.indiceComponenteActual].ejercicios.length === 0)) {
                        if (appState.indiceComponenteActual === 0) break; // Evitar bucle infinito si el primer componente está vacío
                        appState.indiceComponenteActual--;
                    }
                    const compAnterior = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
                    appState.indiceEjercicioActualEnComponente = (compAnterior && compAnterior.ejercicios) ? compAnterior.ejercicios.length - 1 : 0;
                }
            }
            const prevComp = appState.entrenamientoActual.componentes[appState.indiceComponenteActual];
            if (prevComp && prevComp.ejercicios && prevComp.ejercicios.length > 0 && appState.indiceEjercicioActualEnComponente < prevComp.ejercicios.length) { // Añadida verificación de índice
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
            btnSeleccionarEjercicioModal.style.display = 'none';
            modalEjercicioMusculos.parentElement.style.display = 'block';
            modalEjercicioEquipamiento.parentElement.style.display = 'block';
            modalEjercicioDescripcion.parentElement.style.display = 'block';
            modalEjercicioImagen.style.display = 'block';
            targetContainer.style.display = 'grid'; 
            modalEjercicioDescripcion.style.maxHeight = '150px';
            modalEjercicioDescripcion.style.overflowY = 'auto';
        } else { 
            btnSeleccionarEjercicioModal.style.display = 'none'; // El botón general no se usa, la selección es por item
            modalEjercicioMusculos.parentElement.style.display = 'none';
            modalEjercicioEquipamiento.parentElement.style.display = 'none';
            modalEjercicioImagen.style.display = 'none';
            modalEjercicioDescripcion.parentElement.style.display = 'block'; 
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
    
    btnSeleccionarEjercicioModal.addEventListener('click', () => {
        // Este botón ahora es más un "Hecho" o "Cerrar" si la selección ocurre al hacer clic en el item de la lista
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