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