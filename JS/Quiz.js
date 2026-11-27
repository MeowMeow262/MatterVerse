const quizData = {

  tf: {
    title: "TRUE OR FALSE",
    questions: [
      {
        q: "Rusting of iron is a physical change.",
        options: ["True", "False"],
        answer: "False",
        explanation: "Rusting is a chemical change because iron reacts with oxygen and moisture to form rust."
      },
      {
        q: "Rotting the vegetables is a chemical change.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Rotting produces new substances, so it is a chemical change."
      },
      {
        q: "An element can be broken down into simple substances.",
        options: ["True", "False"],
        answer: "False",
        explanation: "An element cannot be broken down into simpler substances by chemical methods."
      },
      {
        q: "Ammonia is a binary compound.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Ammonia (NH₃) contains two different elements: nitrogen and hydrogen."
      },
      {
        q: "A solution is a heterogeneous mixture.",
        options: ["True", "False"],
        answer: "False",
        explanation: "A solution is a homogeneous mixture."
      }
    ]
  },

  fill: {
    title: "FILL IN THE BLANK",
    questions: [
      {
        q: "The reverse of condensation is _____.",
        answer: ["evaporation"],
        displayAnswer: "Evaporation",
        explanation: "Evaporation is the change from liquid to gas."
      },
      {
        q: "Liquid can have a definite _____, but no definite shape.",
        answer: ["volume"],
        displayAnswer: "Volume",
        explanation: "A liquid has a definite volume but takes the shape of its container."
      },
      {
        q: "Some gases have a smell while other are _____.",
        answer: ["odorless", "odourless"],
        displayAnswer: "Odourless",
        explanation: "Some gases have a smell, while others are odourless."
      },
      {
        q: "The _____ the mass, the slower the particles diffused.",
        answer: ["greater", "higher", "larger"],
        displayAnswer: "Greater",
        explanation: "Generally, particles with greater mass diffuse more slowly under the same conditions."
      },
      {
        q: "A solution is a clear _____ mixture of two or more substances.",
        answer: ["homogeneous"],
        displayAnswer: "Homogeneous",
        explanation: "A solution is a homogeneous mixture with a uniform composition."
      }
    ]
  },

  mcq: {
    title: "MULTIPLE CHOICE",
    questions: [
      {
        q: "Water exists as _____ at 100°C and above.",
        options: ["Solid", "Liquid", "Gas"],
        answer: "Gas",
        explanation: "At standard atmospheric pressure, water boils at 100°C and changes into water vapour."
      },
      {
        q: "In a (an) _____ new substance or substances are formed.",
        options: ["Mixture", "Compound", "Element"],
        answer: "Compound",
        explanation: "A compound is formed when elements chemically combine in fixed proportions."
      },
      {
        q: "Metals have _____ melting points.",
        options: ["High", "Low", "Medium"],
        answer: "High",
        explanation: "Most metals have high melting points, although there are exceptions."
      },
      {
        q: "Water is an example of _____.",
        options: ["Element", "Compound", "Mixture"],
        answer: "Compound",
        explanation: "Water (H₂O) is a compound made of hydrogen and oxygen."
      },
      {
        q: "Bromine is a _____ at room temperature.",
        options: ["Solid", "Liquid", "Gas"],
        answer: "Liquid",
        explanation: "Bromine is one of the few elements that is liquid at room temperature."
      }
    ]
  }

};

// ======================================
// VARIABLES
// ======================================

let selectedType = "";
let questions = [];
let index = 0;
let score = 0;
let userAnswers = [];
let answered = false;
let selectedAnswer = null;

// ======================================
// SCREEN MANAGEMENT
// ======================================

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  window.scrollTo({top: 0, behavior: "smooth"});
}

// ======================================
// START QUIZ
// ======================================

function startQuiz(type) {
  selectedType = type;
  questions = quizData[type].questions;

  index = 0;
  score = 0;
  userAnswers = [];

  document.getElementById("typeLabel").textContent =
    quizData[type].title;

  document.getElementById("total").textContent =
    questions.length;

  showScreen("quizScreen");
  loadQuestion();
}

// ======================================
// LOAD QUESTION
// ======================================

function loadQuestion() {
  answered = false;
  selectedAnswer = null;

  const q = questions[index];

  document.getElementById("current").textContent = index + 1;

  document.getElementById("progress").style.width =
    ((index / questions.length) * 100) + "%";

  document.getElementById("question").innerHTML =
    `<span>Q${index + 1}.</span> ${q.q}`;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  document.getElementById("feedback").className = "feedback";
  document.getElementById("feedback").innerHTML = "";

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;
  nextBtn.textContent = "Check Answer";

  if (selectedType === "fill") {

    const input = document.createElement("input");
    input.type = "text";
    input.className = "fill-input";
    input.id = "fillAnswer";
    input.placeholder = "Type your answer here...";

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !answered) checkAnswer();
    });

    answers.appendChild(input);

  } else {

    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "answer";
      btn.textContent = option;

      btn.addEventListener("click", () => selectOption(option, btn));

      answers.appendChild(btn);
    });

  }
}

// ======================================
// SELECT OPTION
// ======================================

function selectOption(option, button) {
  if (answered) return;

  selectedAnswer = option;

  document.querySelectorAll(".answer").forEach(btn => {
    btn.classList.remove("selected");
  });

  button.classList.add("selected");

  document.getElementById("nextBtn").disabled = false;
}

// ======================================
// CHECK ANSWER
// ======================================

function checkAnswer() {
  if (answered) {
    nextQuestion();
    return;
  }

  const q = questions[index];
  let userAnswer;

  if (selectedType === "fill") {
    userAnswer = document.getElementById("fillAnswer").value.trim();

    if (!userAnswer) {
      document.getElementById("fillAnswer").focus();
      return;
    }

  } else {
    userAnswer = selectedAnswer;

    if (!userAnswer) return;
  }

  let isCorrect;

  if (selectedType === "fill") {
    isCorrect = q.answer.some(a =>
      a.toLowerCase() === userAnswer.toLowerCase()
    );
  } else {
    isCorrect = userAnswer === q.answer;
  }

  answered = true;

  if (isCorrect) score++;

  userAnswers.push({
    question: q.q,
    userAnswer: userAnswer,
    correctAnswer: q.displayAnswer || q.answer,
    isCorrect: isCorrect,
    explanation: q.explanation
  });

  // Show correct and wrong answers
  if (selectedType !== "fill") {

    document.querySelectorAll(".answer").forEach(btn => {
      btn.disabled = true;

      if (btn.textContent === q.answer) {
        btn.classList.add("correct");
      } else if (btn.textContent === userAnswer && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

  } else {
    const input = document.getElementById("fillAnswer");
    input.disabled = true;

    input.style.borderColor =
      isCorrect ? "var(--green)" : "var(--red)";
  }

  // Feedback
  const feedback = document.getElementById("feedback");

  feedback.className = "feedback show " +
    (isCorrect ? "good" : "bad");

  feedback.innerHTML = `
    <strong>${isCorrect ? "✓ Correct Answer!" : "✕ Incorrect Answer"}</strong>
    <br>
    ${isCorrect ? "" : "Correct answer: " +
    (q.displayAnswer || q.answer)}
    <br>
    ${q.explanation}
  `;

  const nextBtn = document.getElementById("nextBtn");

  nextBtn.disabled = false;
  nextBtn.textContent =
    index === questions.length - 1 ? "See Results →" : "Next Question →";
}

// ======================================
// NEXT QUESTION
// ======================================

function nextQuestion() {
  if (!answered) {
    checkAnswer();
    return;
  }

  index++;

  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// ======================================
// SHOW RESULT
// ======================================

function showResult() {

  const total = questions.length;
  const wrong = total - score;
  const percentage = Math.round((score / total) * 100);

  document.getElementById("percentage").textContent =
    percentage + "%";

  document.getElementById("correctCount").textContent = score;
  document.getElementById("wrongCount").textContent = wrong;
  document.getElementById("totalCount").textContent = total;

  let title, message, icon;

  if (percentage === 100) {
    title = "Perfect Score!";
    message = "Amazing! You answered every question correctly.";
    icon = "🏆";
  } else if (percentage >= 60) {
    title = "Good Job!";
    message = "Great work! Keep improving your chemistry knowledge.";
    icon = "🎉";
  } else {
    title = "Keep Practising!";
    message = "Don't give up. Review your answers and try again.";
    icon = "📚";
  }

  document.getElementById("resultTitle").textContent = title;
  document.getElementById("resultMessage").textContent = message;
  document.getElementById("resultIcon").textContent = icon;

  document.getElementById("progress").style.width = "100%";

  // Review answers
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  userAnswers.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "review-item";

    const status = item.isCorrect
      ? '<span class="right">✓ Correct</span>'
      : '<span class="wrong-text">✕ Incorrect</span>';

    div.innerHTML = `
      <strong>Q${i + 1}. ${item.question}</strong>
      <br>
      Your answer: ${escapeHTML(item.userAnswer)}
      <br>
      Correct answer: ${escapeHTML(
        Array.isArray(item.correctAnswer)
          ? item.correctAnswer.join(" / ")
          : item.correctAnswer
      )}
      <br>
      ${status}
      <br>
      <span style="color:var(--secondary)">
        ${escapeHTML(item.explanation)}
      </span>
    `;

    reviewList.appendChild(div);
  });

  showScreen("resultScreen");
}

// Prevent user input from being interpreted as HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// ======================================
// RESTART & HOME
// ======================================

function restartQuiz() {
  startQuiz(selectedType);
}

function goHome() {
  showScreen("homeScreen");
}
