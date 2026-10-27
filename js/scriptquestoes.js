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
  Object.entries(screens).forEach(([key, screen]) => {
    if (screen) screen.classList.toggle("hidden", key !== name);
  });
  const s = screens[name];
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
    question.querySelectorAll(".choice").forEach((button) => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect", "wrong");
      button.removeAttribute("aria-label");
    });
  });

  showScreen("quiz");
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
    document.getElementById("final-score").textContent =
      `Você acertou ${score} de ${questions.length} perguntas!`;
    showScreen("end");
    document.getElementById("restart-button").focus();
  }
});

/* ---------- Reiniciar ---------- */
document
  .getElementById("restart-button")
  .addEventListener("click", startGame);



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