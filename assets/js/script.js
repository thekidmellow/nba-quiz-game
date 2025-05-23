// Object to preload and store all images

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

// Global game variables

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

