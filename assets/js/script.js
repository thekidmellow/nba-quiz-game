// OBJECT TO PRELOAD AND STORE ALL IMAGES

const gameImages = {
    teams: {
        celtics: '/assets/images/Boston.jpg',
        bulls: '/assets/images/Bulls.jpg',
        lakers: '/assets/images/L.A.jpg',
        warriors: '/assets/images/Warriors.jpg',
}
    players: {
        lebron: '/assets/images/LeBron.jpg',
        kareem: '/assets/images/Kareem_Abdul-Jabbar.jpg',
        malone: '/assets/images/Karl-Malone.jpg',
        kobe: '/assets/images/Kobe.jpg',
        jordan: '/assets/images/Michael-Jordan.jpg',
        russell: '/assets/images/Bill_russell.jpg',
    }
    ui: {
        victory: '/assets/images/correct_meme.png',
        gameOver: '/assets/images/crying_face.png',
        background: '/assets/images/BG.jpg',
    }
};

// GLOBAL GAME VARIABLES

let currentQuestion = 0;
let score = 0;
let playerName = '';

const questionText = document.getElementById('question-text');
const options = document.querySelectorAll('.option');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const VictoryScreen = document.getElementById('victory-screen');

const currentScore = document.getElementById('current-score');
const finalScore = document.querySelectorAll('final-score');
const finalUsername = document.getElementById('final-username');
const victoryScore = document.getElementById('victory-score');
const victoryUsername = document.getElementById('victory-username');

// IMAGE PRELOADER FUNCTION

function preloadImages() {
    const imagePromises = [];
    const allImages = {...gameImages.teams, ...gameImages.players, ...gameImages.ui };

    for (const src of Object.values(allImages)) {
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        img.src = src;
        imagePromises.push(promise);
    }

    return Promise.all(imagePromises);
}

// QUESTIONS

const questions = [
    {    
        question: "Which team has won the most NBA championships?",
        options: [
            { text: "Boston Celtics", image: gameImages.teams.celtics },
            { text: "Chicago Bulls", image: gameImages.teams.bulls },
            { text: "Los Angeles Lakers", image: gameImages.teams.lakers },
            { text: "Golden State Warriors", image: gameImages.teams.warriors }
        ],
        correctAnswer: "Boston Celtics"
    },
    {    
        question: "Who is the NBA's all-time leading scorer?",
        options: [
            { text: "LeBron James", image: gameImages.players.lebron },
            { text: "Kareem Abdul-Jabbar", image: gameImages.players.kareem },
            { text: "Karl Malone", image: gameImages.players.malone },
            { text: "Kobe Bryant", image: gameImages.players.kobe }
        ],
        correctAnswer: "LeBron James"
    },
    {    
        question: "Which player has won the most MVP awards?",
        options: [
            { text: "Michael Jordan", image: gameImages.players.jordan },
            { text: "Bill Russell", image: gameImages.players.russell },
            { text: "Kareem Abdul-Jabbar", image: gameImages.players.kareem },
            { text: "LeBron James", image: gameImages.players.lebron }
        ],
        correctAnswer: "Kareem Abdul-Jabbar"
    },
    ];

function handleImageError(event) {
    const img = event.target;
    img.src = 'assets/placeholder.jpg';
}

function loadQuestion() {
    const question = question[currentQuestion];
    questionText.textContent = question.question;

    options.forEach((option, index) => {
        const img = option.querySelector('img');
        const name = option.querySelector('.team-name');

        img.onerror = handleImageError;
        img.src = question.options[index].image;
        name.textContent = question.options[index].text;
        option.dataset.team = question.options[index].text;

        option.classList.remove('correct', 'incorrect');
        option.style.pointerEvents = 'auto';
    });
}

function checkAnswer(selectedOption) {
    const question = question[currentQuestion];
    const isCorrect = selectedOption.dataset.team === question.correctAnswer;

    if (isCorrect) {
        selectedOption.classList.add('correct');
        score += 10;
        currentScore.textContent = score;
    } else {
        selectedOption,classList.add('incorrect');
        options.forEach(opt => {
            if (opt.dataset.team === question.correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }

    options.forEach(option => (option.style.pointerEvents = 'none'));

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= questions.lenght) {
            endGame();
        } else {
            loadQuestion();
        }
    }, 1500);
}

function endGame() {
    quizScreen.classList.add('hidden')
    if (score === questions.lenght * 10) {
        victoryScreen.classList.remove('hidden');
        victoryScore.textContent = score;
        victoryUsername.textContent = playerName;
    } else {
        endScreen.classList,remove('hidden');
        finalScore.textContent = score;
        finalUsername.textContent = playerName;
    }
}

function initGame() {
    currentQuestion = 0;
    score = 0;
    currentScore.textContent = score;
    loadQuestion();
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
}

// GAME INITIALIZATION AFTER DOM IS READY

window.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const playAgainButtons = document.querySelectorAll('#play-again, #play-again-victory');
