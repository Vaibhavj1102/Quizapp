const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");

// Create elements for feedback message & question counter
const feedbackMessage = document.createElement("h3");
feedbackMessage.id = "feedback-message";
quizSection.appendChild(feedbackMessage);

const questionCounter = document.createElement("h3");
questionCounter.id = "question-counter";
quizSection.insertBefore(questionCounter, questionElement);

let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let wrongAnswers = 0;
let questions = [];

// Function to show the landing page
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
    correctAnswers = 0;
    wrongAnswers = 0;
    currentQuestionIndex = 0;
}

// Function to show game category selection
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
}

// Function to show the quiz
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";
    getQuestions(category);
}

// Function to fetch questions from Open Trivia Database API
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=10&type=multiple&category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            questions = data.results;
            totalQuestions = questions.length;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Function to display the current question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    optionsContainer.style.display = '';
    feedbackMessage.textContent = ''; // Reset feedback message
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion && currentQuestion.question) {
        questionElement.textContent = currentQuestion.question;

        // ✅ Keep the question counter visible
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${totalQuestions}`;

        optionsContainer.innerHTML = "";

        let allOptions = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        allOptions.sort(() => Math.random() - 0.5);

        allOptions.forEach((option) => {
            addOption(option, option === currentQuestion.correct_answer);
        });
    }
}

// Function to add option buttons
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionElement);
}

// Function to handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    // Disable all options after selection
    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.correct === "true") {
            btn.style.backgroundColor = "#28a745"; // Green for correct answer
            btn.style.color = "white";
        } else {
            btn.style.backgroundColor = "#dc3545"; // Red for incorrect answers
            btn.style.color = "white";
        }
    });

    if (isCorrect) {
        correctAnswers++;
        feedbackMessage.textContent = "✅ Correct!";
        feedbackMessage.style.color = "#28a745"; // Green text
    } else {
        wrongAnswers++;
        const correctOption = questions[currentQuestionIndex].correct_answer;
        feedbackMessage.textContent = `❌ Wrong! The correct answer is: ${correctOption}`;
        feedbackMessage.style.color = "#dc3545"; // Red text
    }

    currentQuestionIndex++;

    // ✅ Keep the question counter updated
    questionCounter.textContent = `Question ${currentQuestionIndex} / ${totalQuestions}`;

    // Wait 1.5 seconds before moving to the next question
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// Function to generate a redeem code
function generateRedeemCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*1234567890";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Function to check quiz result at the end
function endQuiz() {
    if (correctAnswers >= 5) {
        showRedeemCode();
    } else {
        showTryAgainMessage();
    }
}

// Function to display redeem code with a final report
function showRedeemCode() {
    quizSection.innerHTML = `
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You answered 5 or more questions correctly!</p>
        <h3>Your Redeem Code: <span id="redeem-code">${generateRedeemCode()}</span></h3>
        <h3>📊 Final Report:</h3>
        <p>✅ Correct Answers: ${correctAnswers}</p>
        <p>❌ Wrong Answers: ${wrongAnswers}</p>
        <p>📈 Score: ${correctAnswers} / ${totalQuestions}</p>
        <button onclick="showLandingPage()">Go to Home</button>
    `;
}

// Function to show "Try Again" message with a final report
function showTryAgainMessage() {
    quizSection.innerHTML = `
        <h2>😞 Try Again! 😞</h2>
        <p>You did not answer 5 questions correctly.</p>
        <h3>📊 Final Report:</h3>
        <p>✅ Correct Answers: ${correctAnswers}</p>
        <p>❌ Wrong Answers: ${wrongAnswers}</p>
        <p>📈 Score: ${correctAnswers} / ${totalQuestions}</p>
        <button onclick="showLandingPage()">Restart Quiz</button>
    `;
}

// Initial setup
showLandingPage();
