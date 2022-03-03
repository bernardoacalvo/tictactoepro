
export {
    setup, play, getCurrentPlayer, getWinnerPlay, checkGame
}

const BOARD_SIZE = 3;
const MAX_SIZE = BOARD_SIZE*BOARD_SIZE;
const EMPTY = -1;

let board;                  //[y][x]
let winnerPlay;
let players;
let currPlayer;
let playsCounter;

class Player {
    constructor(playerN) {
        this.playerN = playerN;
        this.nPlays = 0;
    }
}

function setup() {
    board = Array(BOARD_SIZE).fill(EMPTY).map(() => Array(BOARD_SIZE).fill(EMPTY));
    winnerPlay = null;
    players = new Array(new Player(0), new Player(1));
    currPlayer = players[0];
    playsCounter = 0;
    return BOARD_SIZE;
}

//returns true if the current player wins
function checkWinner(x, y) {
    if(currPlayer.nPlays < BOARD_SIZE)
        return false;
    return checkLine(y) || checkColumn(x) || (((x+y)%2 == 0) && (checkLeftDiagonal() || checkRightDiagonal()));
} 

function checkLine(y) {
    for(let i = 0; i < BOARD_SIZE; i++) {
        if(board[y][i] != currPlayer.playerN)
            return false;
    }
    setWinnerPlay(0, y, BOARD_SIZE-1, y);
    return true;
}

function checkColumn(x) {
    for(let i = 0; i < BOARD_SIZE; i++) {
        if(board[i][x] != currPlayer.playerN)
            return false;
    }
    setWinnerPlay(x, 0, x, BOARD_SIZE-1);
    return true;
}

function checkLeftDiagonal() {
    for(let i = 0; i < BOARD_SIZE; i++) {
        if(board[i][i] != currPlayer.playerN)
            return false;
    }
    setWinnerPlay(0, 0, BOARD_SIZE-1, BOARD_SIZE-1);
    return true;
}

function checkRightDiagonal() {
    for(let i = 0, j = BOARD_SIZE-1; i < BOARD_SIZE && j>=0; i++, j--) {
        if(board[i][j] != currPlayer.playerN)
            return false;
    }
    setWinnerPlay(BOARD_SIZE-1, 0, 0, BOARD_SIZE-1);
    return true;
}

function setWinnerPlay(x0, y0, x1, y1) {
    winnerPlay = {x0: x0, y0: y0, x1: x1, y1: y1};
}

function getCurrentPlayer() {
    return currPlayer.playerN;
}

function getWinnerPlay() {
    return winnerPlay;
}

function isValidPlay(x, y) {
    return board[y][x] == EMPTY && !isCurrBoardFull();
}

function isCurrBoardFull() {
    return playsCounter == MAX_SIZE;
}

const INVALID_PLAY = -1;
const VALID_PLAY = 0;
const GAME_WINNER = 1;
const GAME_TIE = 2;

function play(x, y) {
    if(isValidPlay(x, y)) {
        board[y][x] = currPlayer.playerN;
        currPlayer.nPlays++;
        playsCounter++;
        if(checkWinner(x, y)) {
            return GAME_WINNER;
        }
        else if(isCurrBoardFull()) {
            return GAME_TIE;
        }
        else {
            currPlayer = players[(currPlayer.playerN+1)%2];
            return VALID_PLAY;
        }
    } 
    else
        return INVALID_PLAY; 
}

/* ----------------------
    FUNCTIONS TO HELP AI
   ---------------------- */

function checkLineBoard(board, y) {
    let player = board[y][0];
    if(player == EMPTY) {
        return false;
    }
    for(let x = 1; x < BOARD_SIZE; x++) {
        if(board[y][x] != player)
            return false;
    }
    return true;
}

function checkColumnBoard(board, x) {
    let player = board[0][x];
    if(player == EMPTY) {
        return false;
    }
    for(let y = 1; y < BOARD_SIZE; y++) {
        if(board[y][x] != player)
            return false;
    }
    return true;
}

function checkDiagonalBoard(board, isLeft) {
    let x = isLeft ? 0 : BOARD_SIZE-1;
    let y = 0;
    let player = board[y][x];
    if(player == EMPTY) {
        return false;
    }
    for(x = 1, y = 1; y < BOARD_SIZE; y++) {
        if(board[y][x] != player) {
            return false;
        }
        x = isLeft ? x+1 : x-1;
    }
    return true;
}

function isBoardFull(board) {
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(board[i][j] == EMPTY)
                return false;
        }
    }
    return true;
}

const TIE = 0;
const NOT_FINISHED = -1;

/**
 * function called by AI to check results
 * returns:
 * -1 -> if game is not finished
 * 0  -> if game tie
 * 1  -> if player 1 wins (playerN = 0)
 * 2  -> if player 2 wins (playerN = 1)
 */
function checkGame(board) {
    for(let i = 0; i < BOARD_SIZE; i++) {
        if(checkLineBoard(board, i)) return board[i][0]+1;
        if(checkColumnBoard(board, i)) return board[0][i]+1;
    }
    if(checkDiagonalBoard(board, true) || checkDiagonalBoard(board, false)) return board[1][1]+1;
    return isBoardFull(board) ? TIE : NOT_FINISHED;
}
