document.addEventListener("DOMContentLoaded", function () {
  const startScreen   = document.getElementById("start-screen");
  const subjectScreen = document.getElementById("subject-screen");
  const quizScreen    = document.getElementById("quiz-screen");

  const startButton = document.getElementById("start-button");
  const botoesMateria = document.querySelectorAll("[data-materia]");

  const nomesMateria = {
    portugues: "Português",
    matematica: "Matemática",
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
});