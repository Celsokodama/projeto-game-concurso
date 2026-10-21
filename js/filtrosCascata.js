const selectMateria = document.getElementById("materia");
const selectAssunto = document.getElementById("assunto");
const selectBanca   = document.getElementById("banca");
const btnFilterStart = document.getElementById("filter-start-button");

// ... (toda aquela lógica de cascata que passei antes)

// Botão final: filtra e vai pro game-screen
btnFilterStart.addEventListener("click", () => {
  const filtradas = questoes.filter(q =>
    q.materia === selectMateria.value &&
    q.assunto === selectAssunto.value &&
    q.banca   === selectBanca.value
  );

  window.questoesFiltradas = filtradas;
  window.indiceAtual = 0;

  show("game-screen");
  renderQuestion();
});

document.getElementById("back-button").addEventListener("click", () => {
  show("start-screen");
});


// ... (toda aquela lógica de cascata que passei antes)

// Botão final: filtra e vai pro game-screen






// btnFilterStart.addEventListener("click", () => {
//   const filtradas = questoes.filter(q =>
//     q.materia === selectMateria.value &&
//     q.assunto === selectAssunto.value &&
//     q.banca   === selectBanca.value
//   );

//   window.questoesFiltradas = filtradas;
//   window.indiceAtual = 0;

//   show("game-screen");
//   renderQuestion();
// });


// // 1. Popular matérias únicas
// function popularMaterias() {
//   const materias = [...new Set(questoes.map(q => q.materia))].sort();
//   materias.forEach(m => {
//     selectMateria.add(new Option(m, m));
//   });
// }

// // 2. Quando muda matéria → popula assuntos
// selectMateria.addEventListener("change", () => {
//   const materia = selectMateria.value;

//   // reset
//   selectAssunto.innerHTML = '<option value="">-- Escolha um assunto --</option>';
//   selectBanca.innerHTML   = '<option value="">-- Escolha uma banca --</option>';
//   selectBanca.disabled    = true;
//   btnStart.disabled       = true;

//   if (!materia) {
//     selectAssunto.disabled = true;
//     return;
//   }

//   const assuntos = [...new Set(
//     questoes.filter(q => q.materia === materia).map(q => q.assunto)
//   )].sort();

//   assuntos.forEach(a => selectAssunto.add(new Option(a, a)));
//   selectAssunto.disabled = false;
// });

// // 3. Quando muda assunto → popula bancas
// selectAssunto.addEventListener("change", () => {
//   const materia = selectMateria.value;
//   const assunto = selectAssunto.value;

//   selectBanca.innerHTML = '<option value="">-- Escolha uma banca --</option>';
//   btnStart.disabled     = true;

//   if (!assunto) {
//     selectBanca.disabled = true;
//     return;
//   }

//   const bancas = [...new Set(
//     questoes
//       .filter(q => q.materia === materia && q.assunto === assunto)
//       .map(q => q.banca)
//   )].sort();

//   bancas.forEach(b => selectBanca.add(new Option(b, b)));
//   selectBanca.disabled = false;
// });

// // 4. Quando muda banca → habilita botão
// selectBanca.addEventListener("change", () => {
//   btnStart.disabled = !selectBanca.value;
// });

// // 5. Botão iniciar → filtra e joga pro quiz
// btnStart.addEventListener("click", () => {
//   const filtradas = questoes.filter(q =>
//     q.materia === selectMateria.value &&
//     q.assunto === selectAssunto.value &&
//     q.banca   === selectBanca.value
//   );

//   console.log("Questões filtradas:", filtradas);

//   // salva para usar na tela do quiz
//   window.questoesFiltradas = filtradas;

//   show("game-screen");
//   renderQuestion(); // essa função deve usar window.questoesFiltradas
// });

// // Inicializa
// popularMaterias();


// // Função auxiliar para trocar de tela
// function show(screenId) {
//   document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
//   document.getElementById(screenId).classList.add("active");
// }

// // --- Tela inicial → filter-screen ---
// document.getElementById("start-button").addEventListener("click", () => {
//   show("filter-screen");
// });


