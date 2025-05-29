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
        // Pecho Máquinas y Poleas
        {
            id: "ej_M_P_001", nombre: "Press de Pecho en Máquina Convergente",
            musculosTrabajados: ["Pecho (General)", "Hombros (Anterior)", "Tríceps"], equipamiento: ["Máquina Press Pecho Convergente"],
            descripcion: "1. Ajuste: Altura del asiento para que los agarres queden a la altura media del pecho.\n2. Movimiento: Empuja los agarres hacia adelante y hacia el centro, contrayendo fuertemente el pecho. Controla la fase excéntrica (vuelta) durante 2-3 segundos.\n3. Respiración: Exhala al empujar, inhala al regresar.\n4. Hipertrofia: La convergencia permite una gran contracción del pectoral. Busca el fallo muscular o RIR 1-2 en el rango de repeticiones.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Convergent+Chest+Press", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_P_002", nombre: "Contractora de Pectoral (Peck Deck / Butterfly)",
            musculosTrabajados: ["Pecho (Interno, Aducción)"], equipamiento: ["Máquina Peck Deck"],
            descripcion: "1. Ajuste: Asiento para que los hombros estén alineados con los pivotes. Codos ligeramente flexionados.\n2. Movimiento: Junta los brazos de la máquina al frente, apretando los pectorales al máximo durante 1-2 segundos.\n3. Retorno: Abre lentamente sintiendo el estiramiento en el pecho.\n4. Hipertrofia: Ideal para aislar y conseguir un 'apretón' en el pecho. Conexión mente-músculo crucial.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Peck+Deck+Fly", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_P_003", nombre: "Press Inclinado en Máquina (Smith o Selectorizada)",
            musculosTrabajados: ["Pecho Superior", "Hombros (Anterior)", "Tríceps"], equipamiento: ["Máquina Press Inclinado", "Máquina Smith"],
            descripcion: "1. Ajuste: Banco inclinado a 30-45°. Agarre ligeramente más cerrado que en press plano.\n2. Movimiento: Empuja hacia arriba y ligeramente hacia atrás (siguiendo el plano de la máquina). Controla la bajada hasta sentir un buen estiramiento en el pecho superior.\n3. Hipertrofia: Enfócate en la porción clavicular del pectoral. La máquina ofrece estabilidad para concentrarse en la contracción.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Incline+Machine+Press", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_P_004", nombre: "Cruce de Poleas (Cable Crossover) - Alto a Bajo",
            musculosTrabajados: ["Pecho (Inferior)", "Hombros (Anterior)"], equipamiento: ["Máquina Poleas (Crossover)"],
            descripcion: "1. Posición: Poleas en la posición más alta. Da un paso adelante.\n2. Movimiento: Con los codos ligeramente flexionados, lleva los agarres hacia abajo y adelante, cruzándolos frente a tu pelvis. Aprieta el pecho inferior.\n3. Retorno: Controla el movimiento de vuelta, sintiendo el estiramiento.\n4. Hipertrofia: Excelente para la parte inferior y externa del pecho.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=High+Cable+Crossover", series: 3, repeticiones: "10-15", descanso: 60
        },

        // Espalda Máquinas y Poleas
        {
            id: "ej_M_E_001", nombre: "Jalón Dorsal al Frente en Polea Alta (Agarre Ancho)",
            musculosTrabajados: ["Espalda (Dorsales - Amplitud)", "Bíceps"], equipamiento: ["Máquina Poleas (Jalón)"],
            descripcion: "1. Agarre: Prono (palmas hacia afuera), más ancho que los hombros.\n2. Movimiento: Tira de la barra hacia la parte superior del pecho, llevando los codos hacia abajo y atrás. Contrae la espalda fuertemente, especialmente los dorsales.\n3. Retorno: Controla la subida de la barra, permitiendo un estiramiento completo de los dorsales.\n4. Hipertrofia: Fundamental para la amplitud de la espalda. Concéntrate en 'tirar con los codos'.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Wide+Grip+Lat+Pulldown", series: 4, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_E_002", nombre: "Remo Sentado en Máquina con Apoyo Pectoral",
            musculosTrabajados: ["Espalda (Media, Romboides, Dorsales)", "Bíceps"], equipamiento: ["Máquina Remo Sentado (con apoyo)"],
            descripcion: "1. Ajuste: Asiento para que el apoyo pectoral te permita un rango completo. Utiliza un agarre neutro o prono.\n2. Movimiento: Tira de los manerales hacia tu abdomen, juntando los omóplatos con fuerza. Mantén el pecho apoyado y la espalda recta.\n3. Retorno: Extiende los brazos lentamente, sintiendo el estiramiento en la espalda media.\n4. Hipertrofia: Ideal para la densidad de la espalda. Contracción máxima.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Chest+Supported+Machine+Row", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_E_003", nombre: "Pullover con Cuerda en Polea Alta",
            musculosTrabajados: ["Espalda (Dorsales)", "Pecho (Serrato)"], equipamiento: ["Máquina Poleas", "Cuerda"],
            descripcion: "1. Posición: De pie, ligeramente inclinado hacia adelante, brazos casi rectos sosteniendo la cuerda.\n2. Movimiento: Lleva la cuerda hacia abajo en un arco amplio, manteniendo los brazos extendidos, hasta que tus manos lleguen cerca de tus muslos. Contrae los dorsales.\n3. Retorno: Controla el movimiento de vuelta, sintiendo el estiramiento en los dorsales.\n4. Hipertrofia: Aísla los dorsales y promueve la 'conexión V'.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Pullover+Rope", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_M_E_004", nombre: "Remo en T con Barra (o Máquina Remo en T)",
            musculosTrabajados: ["Espalda (Media, Dorsales)", "Bíceps", "Trapecio"], equipamiento: ["Barra T", "Máquina Remo en T"],
            descripcion: "1. Posición: Si es con barra, un extremo en una esquina, agarra el otro con un maneral V. Inclina el torso.\n2. Movimiento: Tira de la barra/maneral hacia tu pecho bajo, contrayendo la espalda.\n3. Hipertrofia: Gran constructor de masa para la espalda. Mantén la espalda recta.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=T-Bar+Row", series: 3, repeticiones: "8-10", descanso: 90
        },

        // Piernas Máquinas
        {
            id: "ej_M_PI_001", nombre: "Prensa de Piernas Inclinada (45 Grados)",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Isquiotibiales"], equipamiento: ["Máquina Prensa Piernas"],
            descripcion: "1. Posición Pies: Ancho de hombros para trabajo general. Más altos para glúteos/isquios; más bajos para cuádriceps.\n2. Movimiento: Baja la plataforma controladamente (fase excéntrica de 3 seg) hasta que las rodillas formen un ángulo de 90° o menos si la movilidad lo permite. Empuja explosivamente sin bloquear las rodillas.\n3. Hipertrofia: Permite una sobrecarga progresiva segura. Varía la posición de los pies para estimular diferentes áreas.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Leg+Press+45", series: 4, repeticiones: "10-15", descanso: 90
        },
        {
            id: "ej_M_PI_002", nombre: "Extensiones de Cuádriceps en Máquina",
            musculosTrabajados: ["Cuádriceps"], equipamiento: ["Máquina Extensiones Cuádriceps"],
            descripcion: "1. Ajuste: Rodilla alineada con el eje de rotación de la máquina. Almohadilla sobre los tobillos.\n2. Movimiento: Extiende las piernas completamente, apretando los cuádriceps en la cima durante 1-2 segundos.\n3. Retorno: Baja lentamente (3 seg) resistiendo el peso.\n4. Hipertrofia: Excelente para aislar el cuádriceps y conseguir un 'bombeo' intenso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Leg+Extensions", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_M_PI_003", nombre: "Curl Femoral Tumbado en Máquina",
            musculosTrabajados: ["Isquiotibiales"], equipamiento: ["Máquina Curl Femoral Tumbado"],
            descripcion: "1. Posición: Acostado boca abajo, rodillas justo fuera del borde del banco, almohadilla sobre los tendones de Aquiles.\n2. Movimiento: Flexiona las rodillas llevando los talones hacia los glúteos. Contrae los isquios con fuerza.\n3. Retorno: Extiende las piernas lentamente, manteniendo la tensión.\n4. Hipertrofia: Aísla los isquiotibiales. Evita levantar la cadera del banco.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Lying+Leg+Curl", series: 3, repeticiones: "10-15", descanso: 60
        },
         {
            id: "ej_M_PI_006", nombre: "Curl Femoral Sentado en Máquina", 
            musculosTrabajados: ["Isquiotibiales"], equipamiento: ["Máquina Curl Femoral Sentado"],
            descripcion: "1. Ajuste: Espalda bien apoyada, rodillas alineadas con el eje de la máquina.\n2. Movimiento: Flexiona las rodillas llevando las almohadillas hacia abajo y atrás. Contrae los isquios.\n3. Hipertrofia: Ofrece una curva de resistencia diferente al curl tumbado.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Seated+Leg+Curl", series: 3, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_PI_004", nombre: "Máquina de Gemelos de Pie (Standing Calf Raise Machine)",
            musculosTrabajados: ["Gemelos (Gastrocnemio)"], equipamiento: ["Máquina Gemelos de Pie"],
            descripcion: "1. Posición: Hombros bajo las almohadillas, puntas de los pies en la plataforma, talones colgando.\n2. Movimiento: Elévate sobre las puntas de los pies lo más alto posible, contrayendo los gemelos. Pausa en la cima.\n3. Retorno: Baja lentamente hasta sentir un buen estiramiento.\n4. Hipertrofia: Rango completo y contracción máxima.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Standing+Calf+Machine", series: 4, repeticiones: "10-15 (pesado)", descanso: 60
        },
         {
            id: "ej_M_PI_007", nombre: "Máquina de Gemelos Sentado (Seated Calf Raise Machine)", 
            musculosTrabajados: ["Gemelos (Sóleo)"], equipamiento: ["Máquina Gemelos Sentado"],
            descripcion: "1. Posición: Rodillas bajo las almohadillas, puntas de los pies en la plataforma.\n2. Movimiento: Similar al de pie, pero enfocado en el sóleo debido a la flexión de rodilla.\n3. Hipertrofia: Importante para un desarrollo completo de la pantorrilla.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Seated+Calf+Machine", series: 3, repeticiones: "15-25", descanso: 45
        },
        {
            id: "ej_M_PI_005", nombre: "Hack Squat en Máquina",
            musculosTrabajados: ["Cuádriceps", "Glúteos"], equipamiento: ["Máquina Hack Squat"],
            descripcion: "1. Posición: Espalda y hombros bien apoyados, pies en la plataforma (varía posición para énfasis en diferentes partes del cuádriceps).\n2. Movimiento: Baja controladamente hasta una buena profundidad (muslos paralelos o más abajo). Empuja a través de toda la planta del pie.\n3. Hipertrofia: Gran constructor de cuádriceps. Mantén el control y evita que las rodillas se vayan hacia adentro.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Hack+Squat+Machine", series: 3, repeticiones: "8-12", descanso: 90
        },
        {
            id: "ej_M_PI_009", nombre: "Máquina de Abductores",
            musculosTrabajados: ["Glúteos (Medio, Menor)", "Tensor Fascia Lata"], equipamiento: ["Máquina Abductores"],
            descripcion: "1. Movimiento: Separa las piernas contra la resistencia de la máquina. Controla el movimiento de vuelta.\n2. Hipertrofia: Ayuda a redondear y fortalecer la parte externa de los glúteos y cadera.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Abductor+Machine", series: 3, repeticiones: "15-20", descanso: 45
        },
        {
            id: "ej_M_PI_010", nombre: "Máquina de Aductores",
            musculosTrabajados: ["Aductores (Interna del Muslo)"], equipamiento: ["Máquina Aductores"],
            descripcion: "1. Movimiento: Junta las piernas contra la resistencia de la máquina. Aprieta en el punto de máxima contracción.\n2. Hipertrofia: Fortalece la parte interna de los muslos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Adductor+Machine", series: 3, repeticiones: "15-20", descanso: 45
        },
         {
            id: "ej_M_PI_011", nombre: "Hip Thrust en Máquina (Glute Drive)",
            musculosTrabajados: ["Glúteos", "Isquiotibiales"], equipamiento: ["Máquina Hip Thrust", "Máquina Glute Drive"],
            descripcion: "1. Posición: Espalda alta apoyada, cinturón sobre la cadera.\n2. Movimiento: Empuja las caderas hacia arriba hasta la extensión completa, contrayendo los glúteos fuertemente. Mantén 1-2 segundos.\n3. Hipertrofia: Uno de los mejores ejercicios para el desarrollo de los glúteos.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Hip+Thrust", series: 4, repeticiones: "8-15", descanso: 75
        },


        // Hombros Máquinas y Poleas
        {
            id: "ej_M_H_001", nombre: "Press de Hombros en Máquina (Agarre Neutro/Prono)",
            musculosTrabajados: ["Hombros (Deltoides Anterior y Medial)", "Tríceps"], equipamiento: ["Máquina Press Hombros"],
            descripcion: "1. Ajuste: Asiento para que los agarres inicien a la altura de los hombros o ligeramente por debajo.\n2. Movimiento: Empuja los agarres hacia arriba hasta casi la extensión completa de los codos. Controla la bajada (fase excéntrica de 2-3 seg).\n3. Hipertrofia: Permite enfocarse en la contracción del deltoides con estabilidad.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Shoulder+Press+Machine", series: 3, repeticiones: "8-12", descanso: 75
        },
        {
            id: "ej_M_H_002", nombre: "Elevaciones Laterales con Cable (Polea Baja)",
            musculosTrabajados: ["Hombros (Deltoides Lateral)"], equipamiento: ["Máquina Poleas", "Agarre individual (estribo)"],
            descripcion: "1. Posición: De lado a la polea, agarra el estribo con la mano más alejada. El cable debe cruzar por delante de tu cuerpo.\n2. Movimiento: Eleva el brazo lateralmente hasta la altura del hombro, manteniendo el codo ligeramente flexionado. Controla la bajada.\n3. Hipertrofia: La polea ofrece tensión constante, ideal para el deltoides medial.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Lateral+Raise", series: 3, repeticiones: "12-15 c/brazo", descanso: 60
        },
        {
            id: "ej_M_H_003", nombre: "Pájaros en Máquina Contractora Inversa (Reverse Peck Deck)",
            musculosTrabajados: ["Hombros (Deltoides Posterior)", "Trapecio Medio", "Romboides"], equipamiento: ["Máquina Peck Deck (inversa)"],
            descripcion: "1. Ajuste: Siéntate de cara a la máquina. Agarra los manerales con agarre neutro o prono.\n2. Movimiento: Abre los brazos hacia atrás en un arco amplio, juntando los omóplatos. Enfócate en la contracción de los deltoides posteriores.\n3. Hipertrofia: Excelente para aislar la parte trasera del hombro, a menudo descuidada.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Reverse+Peck+Deck", series: 3, repeticiones: "12-15", descanso: 60
        },
        {
            id: "ej_M_H_004", nombre: "Elevaciones Frontales con Cable (Polea Baja)",
            musculosTrabajados: ["Hombros (Deltoides Anterior)"], equipamiento: ["Máquina Poleas", "Barra recta o cuerda"],
            descripcion: "1. Posición: De espaldas a la polea baja, sostén la barra o cuerda con agarre prono.\n2. Movimiento: Eleva los brazos rectos hacia el frente hasta la altura de los hombros. Controla la bajada.\n3. Hipertrofia: Tensión constante para el deltoides anterior.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Front+Raise", series: 3, repeticiones: "10-15", descanso: 60
        },

        // Bíceps Máquinas/Poleas
        {
            id: "ej_M_B_001", nombre: "Curl de Bíceps en Máquina Predicador",
            musculosTrabajados: ["Bíceps (Cabeza Corta)"], equipamiento: ["Máquina Curl Bíceps (Predicador)"],
            descripcion: "1. Ajuste: Asiento para que la parte superior de tus brazos descanse cómodamente sobre el cojín inclinado.\n2. Movimiento: Flexiona los brazos, llevando los agarres hacia tus hombros. Contrae los bíceps al máximo en la cima.\n3. Retorno: Baja lentamente hasta casi la extensión completa, manteniendo la tensión.\n4. Hipertrofia: Aísla el bíceps y minimiza el uso de impulso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Preacher+Curl", series: 3, repeticiones: "8-12", descanso: 60
        },
        {
            id: "ej_M_B_002", nombre: "Curl de Bíceps con Barra en Polea Baja",
            musculosTrabajados: ["Bíceps (General)"], equipamiento: ["Máquina Poleas", "Barra Recta o EZ"],
            descripcion: "1. Posición: De pie frente a la polea baja, agarra la barra con las palmas hacia arriba.\n2. Movimiento: Flexiona los codos, llevando la barra hacia tus hombros. Mantén los codos fijos a los costados.\n3. Retorno: Baja la barra lentamente, resistiendo la tensión de la polea.\n4. Hipertrofia: Tensión constante durante todo el movimiento, diferente a los pesos libres.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Bar+Bicep+Curl", series: 3, repeticiones: "10-15", descanso: 60
        },
         {
            id: "ej_M_B_003", nombre: "Curl de Bíceps Concentrado con Polea Baja (Unilateral)",
            musculosTrabajados: ["Bíceps (Pico)"], equipamiento: ["Máquina Poleas", "Agarre individual (estribo)"],
            descripcion: "1. Posición: Sentado o inclinado, apoya el codo en la parte interna del muslo.\n2. Movimiento: Flexiona el brazo llevando el agarre hacia tu hombro. Enfócate en la contracción máxima del bíceps.\n3. Hipertrofia: Gran aislamiento para trabajar el 'pico' del bíceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Cable+Concentration+Curl", series: 3, repeticiones: "10-12 c/brazo", descanso: 60
        },


        // Tríceps Máquinas/Poleas
        {
            id: "ej_M_T_001", nombre: "Extensiones de Tríceps en Polea Alta con Cuerda",
            musculosTrabajados: ["Tríceps (Cabeza Lateral y Medial)"], equipamiento: ["Máquina Poleas", "Cuerda"],
            descripcion: "1. Posición: De pie frente a la polea alta, agarra la cuerda con agarre neutro.\n2. Movimiento: Extiende los brazos hacia abajo, separando los extremos de la cuerda al final del movimiento para una mayor contracción. Mantén los codos pegados al cuerpo.\n3. Retorno: Controla la subida, permitiendo un buen estiramiento.\n4. Hipertrofia: La cuerda permite un mayor rango de movimiento y contracción del tríceps.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Rope+Tricep+Pushdown", series: 4, repeticiones: "10-15", descanso: 60
        },
        {
            id: "ej_M_T_002", nombre: "Extensiones de Tríceps sobre Cabeza con Cuerda en Polea Baja",
            musculosTrabajados: ["Tríceps (Cabeza Larga)"], equipamiento: ["Máquina Poleas", "Cuerda"],
            descripcion: "1. Posición: De espaldas a la polea baja, sostén la cuerda con ambas manos por encima y detrás de tu cabeza.\n2. Movimiento: Extiende los brazos hacia arriba y ligeramente adelante, contrayendo los tríceps. Mantén los codos relativamente fijos.\n3. Retorno: Baja lentamente la cuerda detrás de tu cabeza.\n4. Hipertrofia: Excelente para la cabeza larga del tríceps debido al estiramiento.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Overhead+Cable+Rope+Extension", series: 3, repeticiones: "10-12", descanso: 75
        },
        {
            id: "ej_M_T_003", nombre: "Fondos en Máquina (Seated Dip Machine)",
            musculosTrabajados: ["Tríceps", "Pecho Inferior", "Hombros (Anterior)"], equipamiento: ["Máquina Fondos Sentado"],
            descripcion: "1. Ajuste: Asiento para que los agarres estén a una altura cómoda y permitan un rango completo.\n2. Movimiento: Empuja los agarres hacia abajo hasta la extensión completa de los brazos. Contrae los tríceps.\n3. Retorno: Sube controladamente.\n4. Hipertrofia: Alternativa segura a los fondos en paralelas, permite ajustar la carga.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Seated+Dip+Machine", series: 3, repeticiones: "8-12", descanso: 75
        },

        // Abdominales Máquinas
        {
            id: "ej_M_A_001", nombre: "Encogimientos en Máquina Abdominal (Ab Crunch Machine)",
            musculosTrabajados: ["Abdominales (Recto Abdominal)"], equipamiento: ["Máquina Abdominales"],
            descripcion: "1. Ajuste: Configura la máquina para que el pivote esté alineado con tu torso y las almohadillas estén cómodas.\n2. Movimiento: Flexiona el torso contrayendo los abdominales con fuerza. Exhala durante la contracción.\n3. Retorno: Vuelve lentamente a la posición inicial, manteniendo la tensión.\n4. Hipertrofia: Permite sobrecarga progresiva. Enfócate en la calidad de la contracción.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Machine+Ab+Crunch", series: 3, repeticiones: "12-20", descanso: 45
        },
        {
            id: "ej_M_A_002", nombre: "Rotaciones de Torso en Máquina (Rotary Torso)",
            musculosTrabajados: ["Abdominales (Oblicuos)"], equipamiento: ["Máquina Rotary Torso"],
            descripcion: "1. Ajuste: Configura el asiento y las almohadillas para un movimiento cómodo y seguro.\n2. Movimiento: Gira el torso controladamente hacia un lado, contrayendo los oblicuos. Regresa lentamente y repite al otro lado.\n3. Hipertrofia: Aísla los oblicuos. Evita movimientos bruscos o con impulso.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Rotary+Torso+Machine", series: 3, repeticiones: "10-15 c/lado", descanso: 45
        },
        {
            id: "ej_A_003_H", nombre: "Elevaciones de Piernas Colgado (con énfasis en contracción)", 
            musculosTrabajados: ["Abdominales Inferiores", "Flexores de Cadera"], equipamiento: ["Barra de Dominadas", "Soportes para brazos (opcional)"],
            descripcion: "1. Posición: Colgado de la barra, core apretado.\n2. Movimiento: Levanta las piernas (rectas para más difícil, rodillas flexionadas para más fácil) lo más alto posible, intentando llevar las rodillas al pecho o más. Contrae los abdominales inferiores.\n3. Retorno: Baja las piernas lentamente y de forma controlada.\n4. Hipertrofia: Evita el balanceo. Concéntrate en la calidad de la contracción abdominal.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Hanging+Leg+Raise+H", series: 3, repeticiones: "AMRAP (hasta 15-20 con buena forma)", descanso: 60
        },

        // Ejercicios de Peso Libre y Cuerpo que ya estaban (asegurar parámetros de hipertrofia)
        {
            id: "ej_P_001_H", nombre: "Flexiones (Push-ups) - Hipertrofia", 
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
        { // Ejercicios de calentamiento/enfriamiento generales
            id: "ej_C_005", nombre: "Bicicleta Estática (Calentamiento)", 
            musculosTrabajados: ["Cardio", "Piernas"], equipamiento: ["Bicicleta Estática"],
            descripcion: "Mantén un ritmo constante y moderado. Ideal para calentar las articulaciones y elevar la temperatura corporal antes del entrenamiento de fuerza.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Bicicleta+Estatica", series: 1, repeticiones: "10 min", descanso: 0
        },
        {
            id: "ej_C_003", nombre: "Estiramientos Dinámicos", 
            musculosTrabajados: ["Movilidad Articular"], equipamiento: ["Peso Corporal"],
            descripcion: "Realiza movimientos controlados que lleven tus articulaciones a través de su rango de movimiento. Ejemplos: círculos de brazos, balanceos de piernas, rotaciones de torso. Prepara el cuerpo para los ejercicios principales.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Dinamicos", series: 1, repeticiones: "5 min", descanso: 0
        },
        {
            id: "ej_C_004", nombre: "Estiramientos Estáticos", 
            musculosTrabajados: ["Flexibilidad"], equipamiento: ["Peso Corporal", "Colchoneta"],
            descripcion: "Mantén cada estiramiento por 20-30 segundos sin rebotar. Enfócate en los músculos trabajados durante la sesión para ayudar a la recuperación y mantener la flexibilidad.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Estiramientos+Estaticos", series: 1, repeticiones: "5-7 min", descanso: 0
        },
        { // Otros ejercicios que estaban en la lista anterior y pueden ser útiles
            id: "ej_E_005", nombre: "Remo Invertido con TRX (o barra baja)",
            musculosTrabajados: ["Espalda", "Bíceps", "Core"], equipamiento: ["TRX", "Barra baja", "Peso Corporal"],
            descripcion: "1. Posición: Cuerpo recto, colgado del TRX o barra. Cuanto más horizontal, más difícil.\n2. Movimiento: Tira del pecho hacia las manos, contrayendo la espalda.\n3. Retorno: Baja controladamente.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Remo+TRX", series: 3, repeticiones: "8-15", descanso: 60
        },
        {
            id: "ej_PI_008", nombre: "Sentadilla Goblet",
            musculosTrabajados: ["Cuádriceps", "Glúteos", "Core"], equipamiento: ["Mancuerna", "Kettlebell"],
            descripcion: "1. Posición: Sostén una mancuerna o kettlebell verticalmente contra tu pecho.\n2. Movimiento: Realiza una sentadilla profunda, manteniendo el torso erguido.\n3. Puntos clave: Excelente para aprender la forma de la sentadilla y trabajar el core.",
            imagenUrl: "https://placehold.co/300x200/1A1A2D/E0E0E0?text=Sentadilla+Goblet+H", series: 3, repeticiones: "10-15", descanso: 60
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
                { tipo: "Principal", ejercicios: [ { id_ejercicio: "ej_H_002", series: 3, reps: "10-15 (con peso improvisado)" }, { id_ejercicio: "ej_H_003", series: 3, reps: "12-15" }, { id_ejercicio: "ej_A_001", series: 3, reps: "45-60s" }, { id_ejercicio: "ej_A_003_H", series: 3, reps: "12-15" } ]},
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
            lunes: { id: "gym_lun", nombre: "Pecho y Hombro (Anterior/Medial)", diaSemanaComparable: 1, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_P_001", series: 3, reps: "8-12" },    // Press Pecho Máquina Convergente
                    { id_ejercicio: "ej_M_P_003", series: 3, reps: "8-12" },   // Press Inclinado Máquina
                    { id_ejercicio: "ej_M_P_002", series: 3, reps: "10-15" },   // Peck Deck
                    { id_ejercicio: "ej_M_H_001", series: 3, reps: "8-12" },   // Press Hombros Máquina
                    { id_ejercicio: "ej_M_H_002", series: 3, reps: "12-15" }    // Elev. Laterales Polea
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            martes: { id: "gym_mar", nombre: "Espalda (Ancho y Densidad)", diaSemanaComparable: 2, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_E_001", series: 4, reps: "8-12" }, // Jalón Dorsal Polea
                    { id_ejercicio: "ej_M_E_002", series: 3, reps: "8-10" }, // Remo Sentado Máquina
                    { id_ejercicio: "ej_M_E_004", series: 3, reps: "10-12 (Remo en T si hay, sino otro remo en polea)" }, 
                    { id_ejercicio: "ej_M_E_003", series: 3, reps: "12-15" }    // Pullover Polea
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            miercoles: { id: "gym_mie", nombre: "Piernas (Énfasis Cuádriceps y Glúteos)", diaSemanaComparable: 3, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_PI_005", series: 4, reps: "8-12" }, // Hack Squat Máquina
                    { id_ejercicio: "ej_M_PI_001", series: 3, reps: "10-15 (pies bajos para cuáds)" }, // Prensa
                    { id_ejercicio: "ej_M_PI_002", series: 3, reps: "12-15" }, // Ext. Cuádriceps
                    { id_ejercicio: "ej_M_PI_011", series: 3, reps: "10-15" }, // Hip Thrust Máquina
                    { id_ejercicio: "ej_M_PI_004", series: 4, reps: "12-15 (de pie)" }  // Gemelos Máquina
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            jueves: { id: "gym_jue", nombre: "Brazos (Bíceps y Tríceps) y Hombro Posterior", diaSemanaComparable: 4, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min (enfocar brazos y hombros)"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_M_B_001", series: 3, reps: "8-12" },   
                    { id_ejercicio: "ej_M_B_002", series: 3, reps: "10-12 (con barra EZ)" }, 
                    { id_ejercicio: "ej_M_B_003", series: 3, reps: "10-12 c/brazo"}, 
                    { id_ejercicio: "ej_M_T_001", series: 3, reps: "8-12 (con barra V)" },    
                    { id_ejercicio: "ej_M_T_002", series: 3, reps: "10-15" }, 
                    { id_ejercicio: "ej_M_T_003", series: 3, reps: "10-12 (Fondos en máquina)"},
                    { id_ejercicio: "ej_M_H_003", series: 4, reps: "12-15" }   // Reverse Peck Deck
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            viernes: { id: "gym_vie", nombre: "Piernas (Énfasis Isquios y Glúteos) y Abs", diaSemanaComparable: 5, componentes: [ 
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_PI_008", reps: "10-12 (ligero)"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [
                    { id_ejercicio: "ej_PI_002", series: 4, reps: "8-12 (RDL con barra o mancuernas si no hay máquina específica)" }, 
                    { id_ejercicio: "ej_M_PI_003", series: 3, reps: "10-15 (Curl femoral tumbado)" }, 
                    { id_ejercicio: "ej_M_PI_006", series: 3, reps: "10-15 (Curl femoral sentado)" }, 
                    { id_ejercicio: "ej_M_PI_011", series: 4, reps: "10-15 (Hip Thrust en máquina)" },
                    { id_ejercicio: "ej_M_PI_009", series: 3, reps: "15-20 (Abductores)"},
                    { id_ejercicio: "ej_M_A_001", series: 3, reps: "12-15" },   
                    { id_ejercicio: "ej_A_003_H", series: 3, reps: "AMRAP" } 
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
            sabado: { id: "gym_sab", nombre: "Torso Completo (Volumen) - Máquinas/Poleas", diaSemanaComparable: 6, componentes: [
                { tipo: "Calentamiento", ejercicios: [{ id_ejercicio: "ej_C_005", reps: "10 min"}, { id_ejercicio: "ej_C_003", reps: "5 min"}] },
                { tipo: "Principal", ejercicios: [ 
                    { id_ejercicio: "ej_M_P_001", series: 3, reps: "10-12" }, 
                    { id_ejercicio: "ej_M_E_001", series: 3, reps: "10-12" },  
                    { id_ejercicio: "ej_M_H_001", series: 3, reps: "10-12" },  
                    { id_ejercicio: "ej_M_B_002", series: 2, reps: "12-15" },  
                    { id_ejercicio: "ej_M_T_001", series: 2, reps: "12-15" },
                    { id_ejercicio: "ej_M_A_002", series: 3, reps: "12-15 c/lado" }   
                ]},
                { tipo: "Enfriamiento", ejercicios: [{ id_ejercicio: "ej_C_004", reps: "5-7 min"}] }
            ]},
        }
    };

    // --- ELEMENTOS DEL DOM ---
    // (Sin cambios, ya definidos)
    const cronometroEntrenamientoGeneralDisplay = document.getElementById('cronometro-entrenamiento-general');
    const cronometroEjercicioActualDisplay = document.getElementById('cronometro-ejercicio-actual');
    const selectDiasEntrenamiento = document.getElementById('select-dias-entrenamiento');
    const inputUserName = document.getElementById('input-user-name');
    const diasMetaSemanaDisplay = document.getElementById('dias-meta-semana');
    const btnCerrarModalBiblioteca = document.getElementById('btn-cerrar-modal-biblioteca');
    //const btnSeleccionarEjercicioModal = document.getElementById('btn-seleccionar-ejercicio-modal');
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

    // --- FUNCIONES (con adaptaciones para nueva lógica) ---
    function guardarEstado() {
        localStorage.setItem('entrenadorFitnessAppState_v9_maquinasFull', JSON.stringify(appState));
    }

    function cargarEstado() {
        const estadoGuardado = localStorage.getItem('entrenadorFitnessAppState_v9_maquinasFull');
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
        // Asegurarse de que equipamientoActualArray es un array, incluso si el ejercicio no tiene equipamiento definido
        const equipamientoActualArray = Array.isArray(ejercicioActualData.equipamiento) ? ejercicioActualData.equipamiento : (ejercicioActualData.equipamiento ? [ejercicioActualData.equipamiento] : []);


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
            id: rutinaId, 
            nombre: appState.entrenamientoActual.nombre, 
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
        //btnSeleccionarEjercicioModal.style.display = 'block'; // No es necesario, la selección es por item
        
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
            // btnSeleccionarEjercicioModal.style.display = 'none'; // Botón ya no existe hardcodeado
            modalEjercicioMusculos.parentElement.style.display = 'block';
            modalEjercicioEquipamiento.parentElement.style.display = 'block';
            modalEjercicioDescripcion.parentElement.style.display = 'block';
            modalEjercicioImagen.style.display = 'block';
            targetContainer.style.display = 'grid'; 
            modalEjercicioDescripcion.style.maxHeight = '150px';
            modalEjercicioDescripcion.style.overflowY = 'auto';
        } else { 
            // btnSeleccionarEjercicioModal.style.display = 'none'; // Botón ya no existe hardcodeado
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

                if (componentePrincipalDestino.ejercicios.length < 7 && 
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
            nombre: "Descanso", 
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
                delete appState.rutinasPersonalizadas[rutinaIdSabado]; 
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