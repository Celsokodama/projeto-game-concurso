
document.addEventListener("DOMContentLoaded", function () {
  const startScreen = document.getElementById("start-screen");
  const subjectScreen = document.getElementById("subject-screen");
  const quizScreen = document.getElementById("quiz-screen");

  const startButton = document.getElementById("start-button");
  const continueButton = document.getElementById("continue-button");

  let materiaSelecionada = null;

  // 1. Abre a seleção de matérias
  startButton.addEventListener("click", function () {
    startScreen.hidden = true;
    subjectScreen.hidden = false;
  });

  // 2. Seleciona uma matéria
  const botoesMateria = document.querySelectorAll("[data-materia]");

  botoesMateria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      materiaSelecionada = botao.dataset.materia;

      // Habilita o botão Continuar
      continueButton.disabled = false;

      // Atualiza o destaque da seleção
      botoesMateria.forEach(function (item) {
        item.style.outline = "none";
      });

      botao.style.outline = "3px solid #19334b";

      console.log("Matéria selecionada:", materiaSelecionada);
    });
  });

  // 3. Avança para o questionário
  continueButton.addEventListener("click", function () {
    if (!materiaSelecionada) {
      alert("Escolha uma matéria antes de continuar.");
      return;
    }

    subjectScreen.hidden = true;
    quizScreen.hidden = false;
    quizScreen.classList.remove("hidden");

    // Por enquanto, apenas confirma a escolha
    console.log("Carregar questões de:", materiaSelecionada);
  });
});


continueButton.addEventListener("click", function () {
  if (!materiaSelecionada) {
    alert("Escolha uma matéria antes de continuar.");
    return;
  }

  // Relaciona o valor do botão ao nome no banco
  const nomesMateria = {
    portugues: "Português",
    matematica: "Matemática",
    Direito_Constitucional: "Direito Constitucional",
    Direito_Administrativo: "Direito Administrativo"
  };

  const nomeMateria = nomesMateria[materiaSelecionada];

  // Filtra as questões da matéria escolhida
  const questoesFiltradas = quizData.quiz.filter(function (questao) {
    return questao.materia === nomeMateria;
  });

  // Verifica se existem questões cadastradas
  if (questoesFiltradas.length === 0) {
    alert("Ainda não existem questões cadastradas para esta matéria.");
    return;
  }

  // Renderiza somente as questões selecionadas
  renderQuiz(
    { quiz: questoesFiltradas },
    "#questions"
  );

  // Abre a tela do questionário
  subjectScreen.hidden = true;
  quizScreen.hidden = false;
  quizScreen.classList.remove("hidden");

  console.log("Matéria:", nomeMateria);
  console.log("Quantidade de questões:", questoesFiltradas.length);
});
