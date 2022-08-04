// HTML elements
const mapElement = document.querySelector('.map');
const timerElement = document.getElementById('timer');
const historiqTableElement = document.getElementById('historique-table');
const scoreTableElement = document.getElementById('score-table');
const currentPlayerElement = document.getElementById('current-player');
const errorElement = document.getElementById('error');
const start_restartBtn = document.getElementById('start-restart');
const reset_scoreBtn = document.getElementById('reset-score');
const pop = document.querySelector('.pop-up');
const darkEffect = document.querySelector('.dark-effect');
const submitNamesBtn = document.getElementById('submit-btn');
const clearHistoryBtn = document.getElementById('clear-history');


// Classes used
class Player{
    id;
    name;
    color;
    score;
    element;
    constructor(id, name, color, score=0){
        this.id = id;
        this.name = name;
        this.color = color;
        this.score = score;
        scoreTable.push(this);
    }
    addScore() {
        this.score++;
        const temp = document.getElementById(`player-${this.id}`);
        temp.children[1].innerText = this.score;
    }
    clearScore(){
        this.score = 0;
        const temp = document.getElementById(`player-${this.id}`);
        temp.children[1].innerText = this.score;
    }
    addToTable(){
        const temp = document.getElementById(`player-${this.id}`);
        temp.children[0].innerText = this.name;
        temp.children[1].innerText = this.score;
        temp.children[2].style.backgroundColor = this.color;
    }
}
class Game{
    static total = 0;
    id;
    winner;
    time;
    constructor(winner, time){
        Game.total++;
        this.id = Game.total;
        this.time = time;
        this.winner = winner;
        historiqTable.push(this);
    }
    addToTable(){
        const temp = document.createElement('div');
        temp.innerHTML = 
        `
        <p>${this.id}</p>
        <p>${this.winner}</p>
        <p>${this.time}</p>
        `;
        historiqTableElement.append(temp);
    }
}


// Variables used
let mapMatrice = new Array(3);
for (let row = 0; row < mapMatrice.length; row++) {
    mapMatrice[row] = new Array(3);
    for (let column = 0; column < mapMatrice[row].length; column++) {
        mapMatrice[row][column] = '';
    }
}
const classes = ['X', 'O'];
let time = '';
let seconds = 0;
let minutes = 0;
let hours = 0;
let gameStatus = 'stopped';
let currentTurn = null; // 0 for player and 1 for player 2
let interval = null;
let line = null;
let fieldsLeft = 9;
let namesEntered = JSON.parse(localStorage.getItem('namesEntered')) || false;
let historiqTable = JSON.parse(localStorage.getItem('historiqTable')) || [];
let scoreTable = JSON.parse(localStorage.getItem('scoreTable')) || [];
let player1, player2;
if(scoreTable.length == 0){
    player1 = null;
    player2 = null;
}
else{
    player1 = new Player(1, scoreTable[0].name, scoreTable[0].color, scoreTable[0].score);
    player2 = new Player(2, scoreTable[1].name, scoreTable[1].color, scoreTable[1].score);
    scoreTable[0] = player1;
    scoreTable[1] = player2;
}


//initialization
document.getElementById('player1-name').value = '';
document.getElementById('player2-name').value = '';
historiqTable.forEach(game => { //filling games table
    const temp = document.createElement('div');
        temp.innerHTML = 
        `
        <p>${game.id}</p>
        <p>${game.winner}</p>
        <p>${game.time}</p>
        `;
        historiqTableElement.append(temp);
});
scoreTable.forEach(player => { //filling score table
    const temp = document.getElementById(`player-${player.id}`);
        temp.children[0].innerText = player.name;
        temp.children[1].innerText = player.score;
        temp.children[2].style.backgroundColor = player.color;
});


//functions used
function timer(){

    seconds ++;
    if(seconds==60){
        seconds = 0;
        minutes++;
    }
    if(minutes==60){
        minutes = 0;
        hours++;
    }
    
    let secondsTime = seconds.toString();
    let minutesTime = minutes.toString();
    let hoursTime = hours.toString(); 
    if(seconds<10){
        secondsTime = '0' + secondsTime;
    }
    if(minutes<10){
        minutesTime = '0' + minutesTime;
    }
    if(hours<10){
        hoursTime = '0' + hoursTime;
    }
    time = hoursTime + ':' + minutesTime + ':' + secondsTime;
    timerElement.innerText = time;
} 

function emptyMap(){
    Array.from(mapElement.children).forEach(element => {
        element.classList.remove('X');
        element.classList.remove('O');
        element.style.backgroundColor = `black`;
    });
    for (let row = 0; row < mapMatrice.length; row++) {
        for (let column = 0; column < mapMatrice[row].length; column++) {
            mapMatrice[row][column] = '';
        }
    }
    if (line != null) {
        line.remove();
        line = null;
    }
}

function emptyScoreTable(){
    scoreTableElement.innerHTML = 
    `<div>
        <p>Player name</p>
        <p>Player score</p>
        <p>Player color</p>
    </div>
    <div id="player-1">
        <p id="name-1"></p>
        <p id="score-1"></p>
        <p id="color-1"></p>
    </div>
    <div id="player-2">
        <p id="name-2"></p>
        <p id="score-2"></p>
        <p id="color-2"></p>
    </div>`;
    scoreTable = [];
}

function emptyHistoriqTable(){
    historiqTable = [];
    Game.total = 0;
    let skip = true;
    Array.from(historiqTableElement.children).forEach(element => {
        if(skip) skip = false
        else element.remove();
    });
}

function startGame(){
    interval = window.setInterval(timer, 1000); 
    start_restartBtn.innerText = 'Restart';
    start_restartBtn.style.backgroundColor = 'orange';
    gameStatus = 'started';
    currentTurn = 0;
    currentPlayerElement.innerText = player1.name;
}

function restartGame(){
    clearInterval(interval);
    seconds = minutes = hours = 0;
    time = '';
    timerElement.innerText = '00:00:00';
    gameStatus = 'stopped';
    start_restartBtn.style.backgroundColor = 'green';
    start_restartBtn.innerText = 'Start game';
    currentTurn = 0;
    emptyMap();
    currentPlayerElement.innerText = '';
    fieldsLeft = 9;
}

function changeTurn(){
    currentTurn = (currentTurn + 1)%2;
    currentPlayerElement.innerText = scoreTable[currentTurn].name;
}

function resetScore(){
    emptyHistoriqTable();
    restartGame();
    player1.clearScore();
    player2.clearScore();
}

function showPopUp(){
    pop.style.animation = `drop 0.5s linear both`;
    darkEffect.style.display = 'block';
}

function hidePopUp(){
    pop.style.animation = `up 0.5s linear both`;
    darkEffect.style.display = '';
}

function createPlayers(){
    player1 = new Player(1, document.getElementById('player1-name').value, 'blue');
    player1.addToTable();
    player2 = new Player(2, document.getElementById('player2-name').value, 'green');
    player2.addToTable();
}

function createLine(){
    const line = document.createElement('hr');
    line.style.position = 'absolute';
    line.style.border = `2px solid white`;
    mapElement.append(line);
    return line;
}

function verifyRow(row){
    const temp = mapMatrice[row][0]===mapMatrice[row][1] && mapMatrice[row][0]===mapMatrice[row][2];
    if(temp){ //draw horizontal line
        line = createLine();
        line.style.width = `240px`;
        line.style.top = `${row*84 + 36}px`;
    }
    return temp;
}

function verifyColumn(column){
    const temp = mapMatrice[0][column]===mapMatrice[1][column] && mapMatrice[0][column]===mapMatrice[2][column];
    if(temp){ //draw horizontal line
        line = createLine();
        line.style.height = `240px`;
        line.style.left = `${column*84 + 36}px`;
    }
    return temp;
}

function verifyDiagonal(row, column){
    if(mapMatrice[0][0] != ''  &&  mapMatrice[0][0]===mapMatrice[1][1] && mapMatrice[0][0]===mapMatrice[2][2]){
        line = createLine();
        line.style.width = `339px`;
        line.style.transform = `rotateZ(45deg)`;
        line.style.transformOrigin = `0% 0%`;
        return true;
    }
    if(mapMatrice[1][1] != ''  &&  mapMatrice[0][2]===mapMatrice[1][1] && mapMatrice[0][2]===mapMatrice[2][0]){
        line = createLine();
        line.style.height = `340px`;
        line.style.transform = `rotateZ(45deg)`;
        line.style.transformOrigin = `100% 0%`;
        line.style.left = `238px`;
        return true;
    }
    return false;
}


//event listeners
window.addEventListener('beforeunload', function(){
    localStorage.setItem('historiqTable', JSON.stringify(historiqTable));
    localStorage.setItem('scoreTable', JSON.stringify(scoreTable));
    localStorage.setItem('namesEntered', namesEntered);
    console.log('about to refresh');
});

darkEffect.addEventListener('click', function(e){
    hidePopUp();
});

submitNamesBtn.addEventListener('click', function(e){
    createPlayers();
    namesEntered = true;
    hidePopUp();
    startGame();
})

start_restartBtn.addEventListener('click', () => {
    if(!namesEntered){
        showPopUp();
    }
    else if(gameStatus == 'stopped'){
        startGame();
    }
    else{
        restartGame();
    }
});

reset_scoreBtn.addEventListener('click', function(){
    if (namesEntered) {
        resetScore();
    }
});

mapElement.addEventListener('click',function(e){
    if (e.target === mapElement) { ////in case user clicks on borders 
        errorElement.innerText = `Oops clicked on nothing`;
        return; 
    }
    if(gameStatus=== 'stopped'){ //in case game didn't start 
        errorElement.innerText = `Game has not started yet`;
        return;
    } 
    const targetedField = e.target;
    const row = parseInt(targetedField.id[0]);
    const column = parseInt(targetedField.id[1]);
    if(mapMatrice[row][column] != ''){ //in case field is already used
        errorElement.innerText = `Please choose an empty field`;
        return;
    }

    //play turn
    fieldsLeft --;
    errorElement.innerText = ``;
    targetedField.style.backgroundColor = scoreTable[currentTurn].color;
    targetedField.classList.add(classes[currentTurn]);
    mapMatrice[row][column] = scoreTable[currentTurn].id; //id of current player
    if(verifyColumn(column) || verifyRow(row) || verifyDiagonal(row, column)){
        scoreTable[currentTurn].addScore();
        const game = new Game(scoreTable[currentTurn].name, time);
        game.addToTable();
        alert(`Winner is ${scoreTable[currentTurn].name}`);
        restartGame();
    }
    else if(fieldsLeft == 0){
        const game = new Game('none', time);
        game.addToTable();
        alert(`Draw, No Winner !`);
        restartGame();
    }
    else{
        changeTurn();
    } 
});

clearHistoryBtn.addEventListener('click', function(){
    if(namesEntered){
        localStorage.clear();
        resetScore();
        emptyScoreTable();
        namesEntered = false;
        player1 = null;
        player2 = null;
        document.getElementById('player1-name').value = '';
        document.getElementById('player2-name').value = '';
    }
});