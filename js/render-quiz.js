

function renderQuiz(quizData, container) {
  const root =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!root) {
    console.error("Container não encontrado.");
    return;
  }

  // Limpa o container antes de renderizar
  root.innerHTML = "";

  quizData.quiz.forEach((q, index) => {
    // Cria o <article> da questão
    const article = document.createElement("article");
    article.className = index === 0 ? "question" : "question hidden";
    article.dataset.answer = String(q.answer);

    // Cria o bloco de "arte" (emojis)
    const art = document.createElement("div");
    art.className =
      "canva-text illustration text-center mb-3";
    art.setAttribute("data-template-id", `${q.id}-art`);
    art.setAttribute("aria-hidden", "true");
    art.style.fontWeight = "400";
    art.style.fontStyle = "normal";
    art.style.fontSize = "18px";
    art.textContent = q.art;

    // Cria o título (enunciado)
    const title = document.createElement("h2");
    title.className = "canva-text font-semibold mb-6";
    title.setAttribute("data-template-id", `${q.id}-title`);
    title.style.color = "rgb(215, 217, 219)";
    title.style.fontWeight = "600";
    title.style.fontStyle = "normal";
    title.style.fontSize = "27px";
    title.textContent = q.title;

    // Cria o grid de botões
    const grid = document.createElement("div");
    grid.className = "grid sm:grid-cols-2 gap-3";

    q.options.forEach((opt) => {
      const button = document.createElement("button");
      button.className = "canva-button choice";
      button.type = "button";
      button.setAttribute("data-template-id", opt.id);
      button.style.fontWeight = "400";
      button.style.fontStyle = "normal";
      button.style.fontSize = "18px";
      button.textContent = opt.text;
      grid.appendChild(button);
    });

    // Monta a árvore
    article.appendChild(art);
    article.appendChild(title);
    article.appendChild(grid);
    root.appendChild(article);
  });

  // Delegação de evento para os cliques
  root.addEventListener("click", (event) => {
    const btn = event.target.closest(".choice");
    if (!btn || !root.contains(btn)) return;

    const article = btn.closest(".question");
    if (!article || article.classList.contains("answered")) return;

    const correctIndex = Number(article.dataset.answer);
    const buttons = Array.from(article.querySelectorAll(".choice"));
    const clickedIndex = buttons.indexOf(btn);

    // Marca a questão como respondida
    article.classList.add("answered");

    // Destaca visualmente
    buttons.forEach((b, i) => {
      if (i === correctIndex) b.classList.add("correct");
      else if (i === clickedIndex) b.classList.add("wrong");
    });

    // (Opcional) avança para a próxima questão depois de um tempo
    // setTimeout(() => nextQuestion(root), 900);
  });
}

/**
 * Avança para a próxima questão oculta (se existir).
 */
function nextQuestion(root) {
  const questions = root.querySelectorAll(".question");
  const current = root.querySelector(".question:not(.hidden):not(.answered)")
    || root.querySelector(".question:not(.hidden)");

  if (!current) return;
  const idx = Array.from(questions).indexOf(current);
  current.classList.add("hidden");
  if (questions[idx + 1]) questions[idx + 1].classList.remove("hidden");
}



renderQuiz(quizData, "#questions");
