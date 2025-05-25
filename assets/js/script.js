// OBJECT TO PRELOAD AND STORE ALL IMAGES
const gameImages = {
    teams: {
        celtics: 'assets/images/Boston.jpg',
        bulls: 'assets/images/Bulls.jpg',
        lakers: 'assets/images/L.A.jpg',
        warriors: 'assets/images/Warriors.jpg',
    },
    players: {
        lebron: 'assets/images/LeBron.jpg',
        kareem: 'assets/images/Kareem_Abdul-Jabbar.jpg',
        malone: 'assets/images/Karl-Malone.jpg',
        kobe: 'assets/images/Kobe.jpg',
        jordan: 'assets/images/Michael-Jordan.jpg',
        russell: 'assets/images/Bill_russell.jpg',
    },
    ui: {
        victory: 'assets/images/correct_meme.png',
        gameOver: 'assets/images/crying_face.png',
        background: 'assets/images/BG.jpg',
    }
};

// GLOBAL GAME VARIABLES
let currentQuestion = 0;
let score = 0;
let playerName = '';

// Timer variables
let timer;
let timerLeft = 10;

const timerDisplay = document.getElementById('timer');

const questionText = document.getElementById('question-text');
const options = document.querySelectorAll('.option');
const quizScreen = document.getElementById('quiz-screen');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const victoryScreen = document.getElementById('victory-screen');

const currentScore = document.getElementById('current-score');
const finalScore = document.getElementById('final-score');
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
    }
];

function handleImageError(event) {
    const img = event.target;
    img.src = 'assets/placeholder.jpg';
}

function loadQuestion() {
    const question = questions[currentQuestion];
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

    // Start/reset timer
    clearInterval(timer);
    timerLeft = 10;
    timerDisplay.textContent = timerLeft;

    timer = setInterval(timer);
    timerLeft = 10;
    timerDisplay.textContent = timerLeft;

    timer = setInterval(() => {
        timerLeft--;
        timerDisplay.textContent =timerLeft;

        if (timerLeft <= 0)  {
            clearInterval(timer);
            autoFail();
        }
    }, 1000);        
}

function checkAnswer(selectedOption) {
    const question = questions[currentQuestion];
    const isCorrect = selectedOption.dataset.team === question.correctAnswer;

    if (isCorrect) {
        selectedOption.classList.add('correct');
        score += 10;
        currentScore.textContent = score;
        sounds.correct.play();
    } else {
        selectedOption.classList.add('incorrect');
        sounds.wrong.play();
        options.forEach(opt => {
            if (opt.dataset.team === question.correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }

    options.forEach(option => (option.style.pointerEvents = 'none'));

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            endGame();
        } else {
            loadQuestion();
        }
    }, 1500);
}

function autoFail () {
    const question = questions[currentQuestion];
    options.forEach(opt => {
        if (opt.dataset.team === question.correctAnswer) {
            opt.classList.add('correct');
        } else {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none';
    });
    sounds.wrong.play();

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            endGame();
        } else {
            loadQuestion();
        }
    }, 1500);
}

function endGame() {
    clearInterval(timer);
    quizScreen.classList.add('hidden');
    if (score === questions.length * 10) {
        victoryScreen.classList.remove('hidden');
        victoryScore.textContent = score;
        victoryUsername.textContent = playerName;
        sounds.victory.play();
    } else {
        endScreen.classList.remove('hidden');
        finalScore.textContent = score;
        finalUsername.textContent = playerName;
        sounds.gameover.play();
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

    // Add style tag for loading screen
    const style = document.createElement('style');
    style.textContent = `.loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; justify-content: center; align-items: center; color: white; font-size: 24px; z-index: 1000; }`;
    document.head.appendChild(style);

    // Loading screen element
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.textContent = 'Loading...';
    document.body.appendChild(loadingScreen);

    preloadImages()
        .then(() => {
            loadingScreen.remove();

            startButton.addEventListener('click', () => {
                sounds.click.play();
                const input = document.getElementById('player-name');
                playerName = input.value.trim() || 'Player';
                initGame();
            });
            
            options.forEach(option => {
                option.addEventListener('click', () => checkAnswer(option));
            });
            
            playAgainButtons.forEach(btn => btn.addEventListener('click', () => {
                endScreen.classList.add('hidden');
                victoryScreen.classList.add('hidden');
                startScreen.classList.remove('hidden');
            }));
        })
        .catch(err => {
            console.error('Image preloading failed:', err);
            loadingScreen.textContent = 'Failed to load images. Please refresh.';
        });
});

// SOUND EFFECTS
const sounds = {
    correct: new Audio('assets/audio/swish-correct.mp3'),
    wrong: new Audio('assets/audio/wrong-answer.mp3'),
    click: new Audio('assets/audio/click.mp3'),
    gameover: new Audio('assets/audio/game-over.mp3'),
    victory: new Audio('assets/audio/victory.mp3'),
};    