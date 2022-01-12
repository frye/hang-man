var words = ["sailboat", "spinnaker", "keel", "bimini", "dodger", "chartplotter", "freeboard", "jibsheet"];
var gameTime = 10;
var timer;
var wins;
var losses;

var playButton = document.querySelector('#play');
var resetButton = document.querySelector('#reset');
var timeLeft = document.querySelector('#time');
var hiddenWord = document.querySelector('#gametext');
var scoreWins = document.querySelector('#wins');
var scoreLosses = document.querySelector('#losses');
var resultField = document.querySelector('#result');
var resultBox = document.querySelector('#center');
var timerSlider = document.querySelector('#slider');

//arrays for letters, tried with strings but seems to be unnecessrily complicated as they are immutable
var anwerLetters = [];
var hiddenLetters = [];

function init() {
    timeLeft.textContent = gameTime;
    wins = localStorage.getItem('wins') || 0;
    losses = localStorage.getItem('losses') || 0;
    gameTime = timerSlider.value;
    timerSlider.disabled = false;
    updateScore();
}

function updateScore() {
    scoreWins.textContent = 'Wins: ' + wins;
    scoreLosses.textContent = 'Loss: ' + losses;
}

var sliderEvent = function() {
    gameTime = timerSlider.value;
    timeLeft.textContent = gameTime;
};

function loseGame() {
    clearInterval(timer);
    losses++;
    localStorage.setItem('losses', losses);
    updateScore();
    document.removeEventListener('keydown', keyboardInput);
    resultField.textContent = 'Bummer, you lost! The word was: ' + answerWord + '.';
    resultBox.setAttribute('style', 'background: orange;');
    timerSlider.disabled = false;
}

function winGame() {
    clearInterval(timer);
    document.removeEventListener("keydown", keyboardInput);
    wins++;
    localStorage.setItem('wins', wins);
    updateScore();
    resultField.textContent = 'Sweet victory!!!';
    resultBox.setAttribute('style', 'background: lightgreen;');
    timerSlider.disabled = false;
}

function startTimer() {
    timerSlider.disabled = true;
    gameTime = timerSlider.value;
    var remaining = gameTime;
    timeLeft.textContent = remaining;
    timer = setInterval(function () {
        if (remaining > 0) {
            remaining--;
            timeLeft.textContent = remaining;
            console.log(remaining);
            if (answerWord === hiddenLetters.join('')) {
                winGame();
            }
        } else {
            loseGame()
        }

    }, 1000);
}

var keyboardInput = function(event) {
    var key = event.key;
    console.log(key);
    for (var i = 0; i < anwerLetters.length; i++) {
        if (anwerLetters[i] === key) {
            hiddenLetters[i] = key;
        }
    }    
    hiddenWord.textContent = hiddenLetters.join('');
}

function playClicked() {
    if (timer) {
        clearInterval(timer);
    }
    resultField.textContent = '';
    resultBox.setAttribute('style', 'background: white;');
    hiddenWord.textContent = '';
    answerWord = words[Math.floor(Math.random() * words.length)];
    console.log(answerWord);
    anwerLetters = answerWord.split("");
    console.log(anwerLetters);
    hiddenLetters = [];
    for (var i = 0; i < answerWord.length; i++) {
        hiddenLetters.push('_');
    }
    console.log(hiddenLetters);
    hiddenWord.textContent = hiddenLetters.join('');
    console.log(hiddenWord.textContent);
    document.addEventListener("keydown", keyboardInput);
    startTimer();
}

playButton.addEventListener('click', playClicked);
resetButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset scores?')) {
        wins = 0;
        losses = 0;
        localStorage.setItem('wins', wins);
        localStorage.setItem('losses', losses);
        updateScore();
    }
});
timerSlider.addEventListener('input', sliderEvent);

init();