const menuToggle = document.getElementById("menuToggle");
const navegacion = document.getElementById("navegacion");
const enlacesNav = document.querySelectorAll(".enlace-nav");

menuToggle.addEventListener("click", () => {
  const abierto = navegacion.classList.toggle("abierto");
  menuToggle.setAttribute("aria-expanded", String(abierto));
  menuToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = abierto ? "✕" : "☰";
});

document.querySelectorAll("#navegacion a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    navegacion.classList.remove("abierto");
    menuToggle.setAttribute("aria-expande.d", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  });
});

const secciones = document.querySelectorAll("main section[id]");
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enlacesNav.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${entrada.target.id}`);
      });
    }
  });
}, { rootMargin: "-25% 0px -65% 0px" });
secciones.forEach((seccion) => observador.observe(seccion));

document.getElementById("anio").textContent = new Date().getFullYear();

const retos = {
  web: {
    titulo: "Tu misión: es crear una página web.",
    texto: "Piensa en un tema que te encante o apasione, Agregale un título, agrega tres datos que sean  útiles y termina con una invitación para a aprender más."
  },
  presentacion: {
    titulo: "Tu misión: Hazte y explicate una idea visualmente.",
    texto: "Elige un tema, resume la información en cinco o más diapositivas, usa imágenes con permiso y cierra con una conclusión que sea propia."
  },
  seguridad: {
    titulo: "Tu misión: ayuda a las demás personas a cuidarse en el Internet.",
    texto: "Crea una guía con cinco o más consejos sobre: las contraseñas seguras, la privacidad, los enlaces sospechosos, verifica la información y respeta lo  digital."
  }
};

document.querySelectorAll(".reto-opcion").forEach((boton) => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".reto-opcion").forEach((otro) => {
      otro.classList.remove("seleccionada");
      otro.setAttribute("aria-pressed", "false");
    });
    boton.classList.add("seleccionada");
    boton.setAttribute("aria-pressed", "true");
    const reto = retos[boton.dataset.reto];
    document.getElementById("retoResultado").innerHTML = `<strong>${reto.titulo}</strong><p>${reto.texto}</p>`;
  });
});

const preguntas = [
  {
    pregunta: "¿Qué se debe hacer antes de compartir una información que encontraste en Internet?",
    opciones: ["Compartirla inmediatamente", "Verificarla en fuentes confiables", "Creerla si tiene muchas visitas"],
    correcta: 1,
    explicacion: "¡Exacto! Contrastar la información con fuentes confiables ayuda a evitar la desinformación."
  },
  {
    pregunta: "¿Cuál es una buena práctica para proteger tus cuentas?",
    opciones: ["Usar la misma contraseña en todas partes", "Compartir la contraseña con amigos", "Usar contraseñas únicas y activar la verificación en dos pasos"],
    correcta: 2,
    explicacion: "¡Muy bien! Las contraseñas únicas y la verificación en dos pasos añaden protección."
  },
  {
    pregunta: "¿Cómo puedes usar la inteligencia artificial de forma responsable al estudiar?",
    opciones: ["Copiar todo sin revisarlo", "Usarla como apoyo y verificar sus respuestas", "Compartir tus datos personales para obtener mejores respuestas"],
    correcta: 1,
    explicacion: "¡Correcto! La IA puede ayudarte, pero debes revisar sus respuestas, pensar críticamente y proteger tus datos."
  }
];

let preguntaActual = 0;
let puntaje = 0;
let respondida = false;

const preguntaTexto = document.getElementById("preguntaTexto");
const respuestas = document.getElementById("respuestas");
const feedback = document.getElementById("quizFeedback");
const quizSiguiente = document.getElementById("quizSiguiente");

function mostrarPregunta() {
  quizSiguiente.dataset.resultado = "false";
  respondida = false;
  const pregunta = preguntas[preguntaActual];
  document.getElementById("quizPaso").textContent = `PREGUNTA ${preguntaActual + 1} DE ${preguntas.length}`;
  document.getElementById("quizPorcentaje").textContent = `${Math.round(((preguntaActual + 1) / preguntas.length) * 100)}%`;
  document.getElementById("quizBarra").style.width = `${((preguntaActual + 1) / preguntas.length) * 100}%`;
  document.getElementById("quizPuntaje").textContent = `Puntaje: ${puntaje}`;
  preguntaTexto.textContent = pregunta.pregunta;
  feedback.textContent = "";
  feedback.className = "feedback";
  respuestas.replaceChildren();

  pregunta.opciones.forEach((opcion, indice) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "respuesta";
    boton.textContent = opcion;
    boton.addEventListener("click", () => elegirRespuesta(indice));
    respuestas.appendChild(boton);
  });

  quizSiguiente.disabled = true;
  quizSiguiente.textContent = preguntaActual === preguntas.length - 1 ? "Ver resultado →" : "Siguiente →";
}

function elegirRespuesta(indice) {
  if (respondida) return;
  respondida = true;
  const pregunta = preguntas[preguntaActual];
  const botones = respuestas.querySelectorAll(".respuesta");
  botones.forEach((boton, i) => {
    boton.disabled = true;
    if (i === pregunta.correcta) boton.classList.add("correcta");
    if (i === indice && indice !== pregunta.correcta) boton.classList.add("incorrecta");
  });

  if (indice === pregunta.correcta) {
    puntaje++;
    feedback.textContent = pregunta.explicacion;
    feedback.classList.add("correcto");
  } else {
    feedback.textContent = `No exactamente. ${pregunta.explicacion}`;
    feedback.classList.add("error");
  }

  document.getElementById("quizPuntaje").textContent = `Puntaje: ${puntaje}`;
  quizSiguiente.disabled = false;
}

quizSiguiente.addEventListener("click", () => {
  if (quizSiguiente.dataset.resultado === "true") {
    reiniciarQuiz();
    return;
  }
  if (!respondida) return;
  if (preguntaActual < preguntas.length - 1) {
    preguntaActual++;
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  document.getElementById("quizPaso").textContent = "RESULTADO FINAL";
  document.getElementById("quizPorcentaje").textContent = "100%";
  document.getElementById("quizBarra").style.width = "100%";
  preguntaTexto.textContent = `¡Terminaste! Tu resultado es ${puntaje} de ${preguntas.length}.`;
  respuestas.replaceChildren();
  const mensaje = document.createElement("p");
  mensaje.className = "resultado-final";
  mensaje.textContent = puntaje === 3
    ? "¡Excelente! Tienes muy buenos hábitos digitales. Sigue aprendiendo y compartiendo lo que sabes."
    : puntaje === 2
      ? "¡Buen trabajo! Ya tienes una buena base. Repasa los consejos y vuelve a intentarlo."
      : "Cada intento cuenta. Revisa los temas de seguridad y pensamiento crítico, y vuelve a probar.";
  respuestas.appendChild(mensaje);
  feedback.textContent = "Recuerda: aprender tecnología también significa usarla con responsabilidad.";
  feedback.className = "feedback correcto";
  quizSiguiente.disabled = false;
  quizSiguiente.dataset.resultado = "true";
  quizSiguiente.textContent = "Intentar de nuevo ↻";
}

function reiniciarQuiz() {
  preguntaActual = 0;
  puntaje = 0;
  mostrarPregunta();
}

mostrarPregunta();
