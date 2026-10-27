
    const questions = [...document.querySelectorAll('.question')];
    const screens = {
      start: document.getElementById('start-screen'),
      quiz: document.getElementById('quiz-screen'),
      end: document.getElementById('end-screen')
    };
    const nextButton = document.getElementById('next-button');
    const feedback = document.getElementById('feedback');
    let current = 0;
    let score = 0;
    let answered = false;

    function showScreen(name) {
      Object.entries(screens).forEach(([key, screen]) => screen.classList.toggle('hidden', key !== name));
      screens[name].classList.remove('reveal');
      void screens[name].offsetWidth;
      screens[name].classList.add('reveal');
    }

    function updateStatus() {
      document.getElementById('progress-label').textContent = `Pergunta ${current + 1} de ${questions.length}`;
      document.getElementById('score-label').textContent = `Pontos: ${score}`;
      document.getElementById('progress-fill').style.width = `${(current + 1) / questions.length * 100}%`;
      document.getElementById('progress-bar').setAttribute('aria-valuenow', String(current + 1));
    }

    function showQuestion() {
      questions.forEach((question, index) => {
        question.classList.toggle('hidden', index !== current);
        question.classList.toggle('reveal', index === current);
      });
      answered = false;
      feedback.classList.add('hidden');
      nextButton.classList.add('hidden');
      document.querySelector('[data-template-id="next-label"]').classList.toggle('hidden', current === questions.length - 1);
      document.querySelector('[data-template-id="finish-label"]').classList.toggle('hidden', current !== questions.length - 1);
      updateStatus();
      questions[current].querySelector('.choice').focus();
    }

    function startGame() {
      questions = [...document.querySelectorAll('#questions .question')];
      current = 0;
      score = 0;
      answered = false;
      questions.forEach(question => question.querySelectorAll('.choice').forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
        button.removeAttribute('aria-label');
      }));
      showScreen('quiz');
      showQuestion();
    }

    questions.forEach(question => {
      question.querySelectorAll('.choice').forEach((button, index, buttons) => {
        button.addEventListener('click', () => {
          if (answered || question !== questions[current]) return;
          answered = true;
          const correctIndex = Number(question.dataset.answer);
          const isCorrect = index === correctIndex;
          if (isCorrect) score++;
          buttons.forEach((option, optionIndex) => {
            option.disabled = true;
            if (optionIndex === correctIndex) option.classList.add('correct');
            if (optionIndex === index && !isCorrect) option.classList.add('incorrect');
          });
          feedback.classList.remove('hidden', 'bg-green-100', 'bg-red-100');
          feedback.classList.add(isCorrect ? 'bg-green-100' : 'bg-red-100');
          feedback.querySelector('[data-template-id="correct-feedback"]').classList.toggle('hidden', !isCorrect);
          feedback.querySelector('[data-template-id="incorrect-feedback"]').classList.toggle('hidden', isCorrect);
          nextButton.classList.remove('hidden');
          updateStatus();
          nextButton.focus();
        });
      });
    });
    /*
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', startGame);
    */
    nextButton.addEventListener('click', () => {
      if (!answered) return;
      if (current < questions.length - 1) {
        current++;
        showQuestion();
      } else {
        document.getElementById('final-score').textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
        showScreen('end');
        document.getElementById('restart-button').focus();
      }
    });