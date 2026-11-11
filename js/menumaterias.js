/* render quiz */

function renderQuiz(quizData, container) {
  const root =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!root) {
    console.error("Container não encontrado:", container);
    return;
  }

  root.innerHTML = "";

  quizData.quiz.forEach((q, index) => {
    const article = document.createElement("article");
    article.className = index === 0 ? "question" : "question hidden";
    article.dataset.answer = String(q.answer);

    const art = document.createElement("div");
    art.className = "canva-text illustration text-center mb-3";
    art.setAttribute("data-template-id", `${q.id}-art`);
    art.setAttribute("aria-hidden", "true");
    art.style.fontSize = "18px";
    art.textContent = q.art || "";

    const title = document.createElement("h2");
    title.className = "canva-text font-semibold mb-6";
    title.setAttribute("data-template-id", `${q.id}-title`);
    title.style.color = "rgb(215, 217, 219)";
    title.style.fontWeight = "600";
    title.style.fontSize = "27px";
    title.textContent = q.title;

    const grid = document.createElement("div");
    grid.className = "grid sm:grid-cols-2 gap-3";

    q.options.forEach((opt) => {

       // Ignora alternativas vazias
      if (!opt.text || opt.text.trim() === "") {
          return;
      }
      const button = document.createElement("button");
      button.className = "canva-button choice";
      button.type = "button";
      button.setAttribute("data-template-id", opt.id);
      button.style.fontSize = "18px";
      button.textContent = opt.text;
      grid.appendChild(button);
    });

    article.appendChild(art);
    article.appendChild(title);
    article.appendChild(grid);
    root.appendChild(article);
  });
}

/* script questoes */

let questions = [];
let current = 0;
let score = 0;
let answered = false;

const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  end: document.getElementById("end-screen")
};

const nextButton = document.getElementById("next-button");
const feedback = document.getElementById("feedback");

function showScreen(name) {
  const screensMap = {
    start: document.getElementById("start-screen"),
    quiz: document.getElementById("quiz-screen"),
    end: document.getElementById("end-screen")
  };
  
  Object.entries(screensMap).forEach(([key, screen]) => {
    if (screen) {
      if (key === name) {
        screen.classList.remove("hidden");
        screen.hidden = false;
      } else {
        screen.classList.add("hidden");
        screen.hidden = true;
      }
    }
  });
  
  const s = screensMap[name];
  if (!s) return;
  s.classList.remove("reveal");
  void s.offsetWidth;
  s.classList.add("reveal");
}

function updateStatus() {
  document.getElementById("progress-label").textContent =
    `Pergunta ${current + 1} de ${questions.length}`;
  document.getElementById("score-label").textContent = `Pontos: ${score}`;
  document.getElementById("progress-fill").style.width =
    `${((current + 1) / questions.length) * 100}%`;
  document
    .getElementById("progress-bar")
    .setAttribute("aria-valuenow", String(current + 1));
}

function showQuestion() {
  if (questions.length === 0) {
    console.warn("Nenhuma questão para mostrar.");
    return;
  }

  questions.forEach((question, index) => {
    question.classList.toggle("hidden", index !== current);
    question.classList.toggle("reveal", index === current);
  });
  
  answered = false;
  feedback.classList.add("hidden");
  nextButton.classList.add("hidden");

  document
    .querySelector('[data-template-id="next-label"]')
    .classList.toggle("hidden", current === questions.length - 1);
  document
    .querySelector('[data-template-id="finish-label"]')
    .classList.toggle("hidden", current !== questions.length - 1);

  updateStatus();

  const firstChoice = questions[current].querySelector(".choice");
  if (firstChoice) firstChoice.focus();
}

function startGame() {
  // Recalcula as questões AGORA (depois de renderQuiz ter injetado)
  questions = Array.from(document.querySelectorAll("#questions .question"));

  current = 0;
  score = 0;
  answered = false;

  questions.forEach((question) => {
    question.classList.remove("answered");
    question.classList.add("hidden"); // Esconde todas no começo
    question.querySelectorAll(".choice").forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect", "wrong");
      button.removeAttribute("aria-label");
    });
  });

  // Esconde o feedback e o botão de próxima
  const feedbackElement = document.getElementById("feedback");
  if (feedbackElement) feedbackElement.classList.add("hidden");
  
  const nextBtn = document.getElementById("next-button");
  if (nextBtn) nextBtn.classList.add("hidden");

  // Mostra a tela do quiz (forçando o display)
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("quiz-screen").hidden = false;

  showQuestion();
}


window.iniciarQuiz = startGame;


/* ---------- Botão Próxima ---------- */
nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (current < questions.length - 1) {
    current++;
    showQuestion();
 } else {
    // Fim do quiz
    document.getElementById("final-score").textContent =
      `Você acertou ${score} de ${questions.length} perguntas!`;
      
    // NOVO: Limpa a tela do quiz para a próxima rodada
    document.getElementById("questions").innerHTML = "";
    feedback.classList.add("hidden");
    nextButton.classList.add("hidden");
    
    showScreen("end");
    document.getElementById("restart-button").focus();
  }
});

/* ---------- Reiniciar ---------- 
document
  .getElementById("restart-button") 
  .addEventListener("click", startGame);
*/


  /* ---------- Delegação de evento (única fonte de clique) ---------- */
document.getElementById("questions").addEventListener("click", (event) => {
  const button = event.target.closest(".choice");
  if (!button) return;

  const question = button.closest(".question");
  if (!question || question !== questions[current]) return;
  if (answered) return;

  answered = true;

  const buttons = Array.from(question.querySelectorAll(".choice"));
  const clickedIndex = buttons.indexOf(button);
  const correctIndex = Number(question.dataset.answer);
  const isCorrect = clickedIndex === correctIndex;

  if (isCorrect) score++;

  buttons.forEach((option, optionIndex) => {
    option.disabled = true;
    if (optionIndex === correctIndex) option.classList.add("correct");
    if (optionIndex === clickedIndex && !isCorrect)
      option.classList.add("incorrect");
  });

  // 🔑 Calcula a letra da alternativa correta (A, B, C, D, E...)
  const letraCorreta = String.fromCharCode(65 + correctIndex); // 0→A, 1→B, 2→C...

  // 🔑 Preenche o texto do feedback de erro com a letra
  const incorrectFeedback = feedback.querySelector(
    '[data-template-id="incorrect-feedback"]'
  );
  incorrectFeedback.textContent =
    `Boa tentativa! A resposta correta é a alternativa ${letraCorreta}. 💡`;

  // Mostra/esconde os feedbacks
  feedback.classList.remove("hidden", "bg-green-100", "bg-red-100");
  feedback.classList.add(isCorrect ? "bg-green-100" : "bg-red-100");
  feedback
    .querySelector('[data-template-id="correct-feedback"]')
    .classList.toggle("hidden", !isCorrect);
  incorrectFeedback.classList.toggle("hidden", isCorrect);

  nextButton.classList.remove("hidden");
  updateStatus();
  nextButton.focus();
});


document.addEventListener("DOMContentLoaded", function () {
  const startScreen   = document.getElementById("start-screen");
  const subjectScreen = document.getElementById("subject-screen");
  const quizScreen    = document.getElementById("quiz-screen");
  const endScreen     = document.getElementById("end-screen");

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const botoesMateria = document.querySelectorAll("[data-materia]");

  const nomesMateria = {
    portugues: "Português",
    Matemática: "Matemática",
    Direito_Constitucional: "Direito Constitucional",
    Direito_Administrativo: "Direito Administrativo"
  };

  // Função auxiliar para trocar de tela de forma segura
  function trocarTela(telaParaMostrar) {
    [startScreen, subjectScreen, quizScreen, endScreen].forEach(tela => {
      if (tela) {
        tela.hidden = true; // Usa o atributo hidden do HTML
        tela.classList.add("hidden"); // Usa a classe do Tailwind
      }
    });
    
    if (telaParaMostrar) {
      telaParaMostrar.hidden = false;
      telaParaMostrar.classList.remove("hidden");
    }
  }

  // 1. Abre a seleção de matérias
  if (startButton) {
    startButton.addEventListener("click", function () {
      trocarTela(subjectScreen);
    });
  }

  // 2. Clicou numa matéria -> filtra e abre o quiz direto
  botoesMateria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const materiaSelecionada = botao.dataset.materia;
      const nomeMateria = nomesMateria[materiaSelecionada];

      if (!nomeMateria) {
        alert("Matéria inválida: " + materiaSelecionada);
        return;
      }

      const questoesFiltradas = quizData.quiz.filter(q => q.materia === nomeMateria);

      if (questoesFiltradas.length === 0) {
        alert("Ainda não existem questões cadastradas para: " + nomeMateria);
        return;
      }

      // Renderiza
      renderQuiz({ quiz: questoesFiltradas }, "#questions");

      // Troca de tela
      trocarTela(quizScreen);

      // Inicializa o motor do quiz
      if (typeof window.iniciarQuiz === "function") {
        window.iniciarQuiz();
      }
    });
  });

  // 3. Clicou em "Jogar de novo" -> volta para a seleção de matérias
  if (restartButton) {
    restartButton.addEventListener("click", function () {
      trocarTela(subjectScreen);
    });
  }
});

  const nomesMateria = {
    portugues: "Português",
    Matemática: "Matemática",
    Direito_Constitucional: "Direito Constitucional",
    Direito_Administrativo: "Direito Administrativo"
  };

  // 1. Abre a seleção de matérias
  startButton.addEventListener("click", function () {
    startScreen.hidden = true;
    subjectScreen.hidden = false;
  });

  // 2. Clicou numa matéria -> filtra e abre o quiz direto
  botoesMateria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const materiaSelecionada = botao.dataset.materia;
      const nomeMateria = nomesMateria[materiaSelecionada];

      if (!nomeMateria) {
        alert("Matéria inválida: " + materiaSelecionada);
        return;
      }

      // Filtra as questões da matéria escolhida
      const questoesFiltradas = quizData.quiz.filter(function (q) {
        return q.materia === nomeMateria;
      });

      if (questoesFiltradas.length === 0) {
        alert("Ainda não existem questões cadastradas para: " + nomeMateria);
        return;
      }

      // Renderiza
      renderQuiz({ quiz: questoesFiltradas }, "#questions");

      // Troca de tela
      subjectScreen.hidden = true;
      quizScreen.hidden = false;
      quizScreen.classList.remove("hidden");

      // NOVO: inicializa o motor do quiz com as questões recém-injetadas
        if (typeof window.iniciarQuiz === "function") {
        window.iniciarQuiz();
        }
        
      console.log("Matéria:", nomeMateria, "| Questões:", questoesFiltradas.length);
    });
  });
;