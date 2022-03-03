import * as game from './logic.js';
import * as aiplayer from './aiplayer.js';
import * as gui from './gui.js';

export {
    boardClickListener, restartButtonListener
}

const MSG_WELCOME = ">Welcome to TicTacToePro! The game just started.";
const MSG_YOURTURN = ">Your turn.";
const MSG_INVALIDPLAY = ">Invalid play!";
const MSG_RESTART = ">Restarting.";
const MSG_AIWINS = ">AI won! Try again.";
const MSG_GAMETIE = ">Game tie! Try again.";

const NUMBER_OF_DECIMALS = 2;

let invalidPlayCounter;
let lastInvalidPlayElem;
let gameFinished;

function setup() {
    invalidPlayCounter = 0;
    gameFinished = false;

    const BOARD_SIZE = game.setup();
    aiplayer.setup(BOARD_SIZE);

    gui.setup(canvas, BOARD_SIZE);
    gui.writeOnElem(logger, MSG_WELCOME);
    gui.writeOnElem(logger, MSG_YOURTURN);
}

function boardClickListener(x, y) {
    if(gameFinished)
        return; 
    let xIdx = convertToIndex(x, canvas.width);
    let yIdx = convertToIndex(y, canvas.height);

    if(makePlay(xIdx, yIdx)) {
        let aiPlay = aiplayer.nextPlayAfterPlayer(xIdx, yIdx);
        gui.writeOnElem(logger, `>AI played in ${aiPlay.time.toFixed(NUMBER_OF_DECIMALS)} ms.`);
        if(makePlay(aiPlay.bestPlay.x, aiPlay.bestPlay.y))
            gui.writeOnElem(logger, MSG_YOURTURN);
    }
}

function convertToIndex(v, limit) {
    if(v < limit/3) {
        return 0;
    }
    if(v < 2*limit/3) {
        return 1;
    }
    return 2;
}

function restartButtonListener() {
    invalidPlayCounter = 0;
    gameFinished = false;

    gui.clearElem(logger);
    gui.writeOnElem(logger, MSG_RESTART);

    const BOARD_SIZE = game.setup();
    aiplayer.setup(BOARD_SIZE);

    gui.clearCanvas(canvas);
    gui.setup(canvas, BOARD_SIZE);
    gui.writeOnElem(logger, MSG_YOURTURN);
}

// constants accordingly with game.play returns
const INVALID_PLAY = -1;
const GAME_WINNER = 1;
const GAME_TIE = 2;

//returns true if the game continues
function makePlay(x, y) {
    let currPlayer = game.getCurrentPlayer();
    let play = game.play(x, y);
    if(play != INVALID_PLAY) {
        if(invalidPlayCounter > 0)
            invalidPlayCounter = 0;
        drawPlay(x, y, currPlayer);
        if(play == GAME_WINNER) {
            gameFinished = true;
            gui.writeOnElem(logger, MSG_AIWINS);      //only AI wins
            drawWinnerPlay(game.getWinnerPlay());
        }
        else if(play == GAME_TIE) {
            gameFinished = true;
            gui.writeOnElem(logger, MSG_GAMETIE);
        }
        else
            return true;
    } else {
        if(invalidPlayCounter > 0) {
            gui.clearElem(lastInvalidPlayElem);
            lastInvalidPlayElem = gui.writeOnElem(logger, `>Invalid play! (${invalidPlayCounter+1})`);
        } 
        else 
            lastInvalidPlayElem = gui.writeOnElem(logger, MSG_INVALIDPLAY);
        invalidPlayCounter++;
    }
    return false;
}

function drawPlay(x, y, player) {
    x = convertToCoordinates(x, true);
    y = convertToCoordinates(y, false);
    player == 0 ? gui.drawX(canvas, x, y) : gui.drawCircle(canvas, x, y);
}

function drawWinnerPlay(play) {
    let xs = calculateCoordinates(play.x0, play.x1, true);
    let ys = calculateCoordinates(play.y0, play.y1, false);
    gui.drawWinnerPlay(canvas, xs.c0, ys.c0, xs.c1, ys.c1);
}

const WINNER_LINE_OFFSET = 50;

//function to make the winner line longer
function calculateCoordinates(v0, v1, isX) {
    let c0 = convertToCoordinates(v0, isX);
    let c1 = convertToCoordinates(v1, isX);
    if(v0 != v1) {
        if(v0 > v1) {
            c0 += WINNER_LINE_OFFSET;
            c1 -= WINNER_LINE_OFFSET;
        } else {
            c0 -= WINNER_LINE_OFFSET;
            c1 += WINNER_LINE_OFFSET;
        }
    }
    return {c0, c1};
}

//isX=true for width
function convertToCoordinates(v, isX) {
    return isX ? canvas.width/3*v+canvas.width/6 : canvas.height/3*v+canvas.height/6;
}

window.onload = function() {
    setup();
}
