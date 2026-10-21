
    // Fatos e respostas são dados do jogo, não textos de configuração.
    const questions = [
      {country:"Brasil",capital:"Brasília",options:["Brasília","Rio de Janeiro","São Paulo","Salvador"],correct:0,art:"🇧🇷 🏛️",colors:["#9be6ef","#62c780"],fact:"Brasília é a capital do Brasil. Ela foi planejada antes de ser construída!"},
      {country:"Argentina",capital:"Buenos Aires",options:["Córdoba","Montevidéu","Buenos Aires","Rosário"],correct:2,art:"🇦🇷 🎭",colors:["#a6e1ff","#74c6e5"],fact:"Buenos Aires é a capital da Argentina. A cidade é famosa pelo tango!"},
      {country:"Chile",capital:"Santiago",options:["Valparaíso","Santiago","Lima","Concepción"],correct:1,art:"🇨🇱 ⛰️",colors:["#b6e6fc","#9ebdd9"],fact:"Santiago é a capital do Chile. Os Andes ficam pertinho da cidade!"},
      {country:"Peru",capital:"Lima",options:["Cusco","Arequipa","Quito","Lima"],correct:3,art:"🇵🇪 🦙",colors:["#ffcfaa","#ecc58f"],fact:"Lima é a capital do Peru. Ela fica perto do oceano Pacífico!"},
      {country:"Colômbia",capital:"Bogotá",options:["Medellín","Bogotá","Cali","Cartagena"],correct:1,art:"🇨🇴 🦜",colors:["#ffe28b","#83c99a"],fact:"Bogotá é a capital da Colômbia. Ela fica bem alto nas montanhas!"},
      {country:"Uruguai",capital:"Montevidéu",options:["Punta del Este","Colônia do Sacramento","Montevidéu","Salto"],correct:2,art:"🇺🇾 🌊",colors:["#b6edff","#77d4d3"],fact:"Montevidéu é a capital do Uruguai. Ela fica às margens do Rio da Prata!"},
      {country:"Paraguai",capital:"Assunção",options:["Assunção","Ciudad del Este","Encarnación","Luque"],correct:0,art:"🇵🇾 🌿",colors:["#ffe5aa","#8cce85"],fact:"Assunção é a capital do Paraguai. Ela fica perto do rio Paraguai!"},
      {country:"Bolívia",capital:"Sucre",options:["La Paz","Santa Cruz de la Sierra","Cochabamba","Sucre"],correct:3,art:"🇧🇴 🏔️",colors:["#c6e6ff","#a8cbb0"],fact:"Sucre é a capital constitucional da Bolívia. La Paz é a sede do governo!"},
      {country:"Equador",capital:"Quito",options:["Guayaquil","Quito","Cuenca","Manta"],correct:1,art:"🇪🇨 🌋",colors:["#ffe2a3","#a9d5a3"],fact:"Quito é a capital do Equador. Ela fica perto da linha do Equador!"},
      {country:"Venezuela",capital:"Caracas",options:["Maracaibo","Valência","Caracas","Mérida"],correct:2,art:"🇻🇪 🌴",colors:["#addfff","#8acda7"],fact:"Caracas é a capital da Venezuela. Montanhas cercam parte da cidade!"}
    ];
    let position=0, score=0, answers=[], answered=false, savePending=false, sdkReady=false;
    const $=id=>document.getElementById(id);
    const show=id=>["start-screen","game-screen","end-screen"].forEach(name=>$(name).hidden=name!==id);

    async function initSheet() {
      try {
        const result=await window.dataSdk.init({onDataChanged(){}});
        sdkReady=result.isOk;
      } catch (_) { sdkReady=false; }
    }
    initSheet();

    function renderQuestion() {
      const q=questions[position];
      answered=false;
      $("question-number").textContent=position+1;
      $("score-number").textContent=score;
      $("progress-fill").style.width=`${position/10*100}%`;
      $("progress-track").setAttribute("aria-valuenow",String(position));
      $("question-title").textContent=`Qual é a capital do ${q.country}?`;
      $("scene-art").textContent=q.art;
      $("scene").style.background=`linear-gradient(145deg, ${q.colors[0]}, ${q.colors[1]})`;
      const choices=$("choices");
      choices.replaceChildren();
      q.options.forEach((option,index)=>{
        const button=document.createElement("button");
        button.type="button";
        button.className="choice";
        button.textContent=`${"ABCD"[index]}. ${option}`;
        button.addEventListener("click",()=>choose(index));
        choices.appendChild(button);
      });
      $("feedback").hidden=true;
      $("next-button").hidden=true;
      $("next-button").textContent=position===9?"Ver meu resultado →":"Próximo desafio →";
    }

    function choose(index) {
      if(answered)return;
      answered=true;
      const q=questions[position], won=index===q.correct;
      if(won)score++;
      answers.push({pais:q.country,escolhida:q.options[index],correta:q.capital,acertou:won});
      [...$("choices").children].forEach((button,i)=>{
        button.disabled=true;
        if(i===index)button.classList.add("selected",won?"correct":"incorrect");
        if(i===q.correct && !won)button.classList.add("correct-answer");
      });
      $("score-number").textContent=score;
      $("feedback").style.background=won?"#d9f7e1":"#fff0c8";
      $("feedback-title").textContent=won?"Mandou bem! 🎉":"Boa tentativa! 💡";
      $("feedback-detail").textContent=`A resposta é ${q.capital}. ${q.fact}`;
      $("feedback").hidden=false;
      $("next-button").hidden=false;
      $("next-button").focus();
    }

    async function saveResult() {
      if(savePending)return;
      const button=$("retry-save");
      button.hidden=true;
      button.disabled=true;
      savePending=true;
      $("save-status").textContent="Salvando sua aventura na Planilha Canva…";
      try {
        if(!sdkReady)await initSheet();
        if(!sdkReady)throw new Error("Sem conexão com a Planilha");
        const result=await window.dataSdk.create({
          pontuacao:score,
          respostas:JSON.stringify(answers),
          data_conclusao:new Date().toISOString()
        });
        if(!result.isOk)throw new Error("Não foi possível confirmar");
        $("save-status").textContent="Aventura salva na Planilha Canva! ✅";
      } catch (_) {
        $("save-status").textContent="Não conseguimos confirmar o salvamento. Confira antes de tentar novamente.";
        button.hidden=false;
      } finally {
        savePending=false;
        button.disabled=false;
      }
    }

    function finish() {
      show("end-screen");
      $("progress-fill").style.width="100%";
      $("progress-track").setAttribute("aria-valuenow","10");
      $("final-score").textContent=`Você acertou ${score} de 10 perguntas! ⭐`;
      const list=$("summary-list");
      list.replaceChildren();
      answers.forEach((answer,index)=>{
        const li=document.createElement("li");
        li.className="summary-row leading-relaxed";
        const strong=document.createElement("strong");
        strong.textContent=`${index+1}. ${answer.pais} ${answer.acertou?"✅":"🌱"}`;
        const details=document.createElement("div");
        details.textContent=`Você marcou: ${answer.escolhida}. Capital correta: ${answer.correta}.`;
        li.append(strong,details);
        list.appendChild(li);
      });
      saveResult();
    }

    $("start-button").addEventListener("click",()=>{show("game-screen");renderQuestion();});
    $("next-button").addEventListener("click",()=>{
      if(!answered)return;
      if(position===questions.length-1)finish();
      else {position++;renderQuestion();}
    });
    $("restart-button").addEventListener("click",()=>{
      position=0;score=0;answers=[];answered=false;
      show("start-screen");
      $("start-button").focus();
    });
    $("retry-save").addEventListener("click",saveResult);