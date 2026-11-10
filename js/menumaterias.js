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