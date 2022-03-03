import {checkGame} from './logic.js';

export {
    setup, nextPlayAfterPlayer
}

const EMPTY = -1;
const AI_VALUE = 0;
const PLAYER_VALUE = 1;

let boardSize;
let board;

function setup(bSize) {
    boardSize = bSize;
    board = Array(boardSize).fill(EMPTY).map(() => Array(boardSize).fill(EMPTY));
}

/**
 * Returns the next best play to make
 * Uses alpha-beta purning algorithm
 */
function nextPlayAfterPlayer(xp, yp) {
    let time = performance.now();
    board[yp][xp] = PLAYER_VALUE;
    let bestUtility = -Infinity;
    let alpha = -Infinity;
    let bestPlay;
    let utility;
    for(let y = 0; y < boardSize; y++) {
        for(let x = 0; x < boardSize; x++) {
            if(board[y][x] == EMPTY) {
                board[y][x] = AI_VALUE;
                utility = alphabetapurning(board, false, alpha, Infinity);      //beta doesnt change in max
                board[y][x] = EMPTY;
                alpha = utility > alpha ? utility : alpha;
                if(utility > bestUtility) {
                    bestUtility = utility;
                    bestPlay = {x, y};
                } 
                else if(utility == bestUtility)    
                    bestPlay = Math.random() > 0.5 ? bestPlay : {x, y};
            }
        }
    }
    board[bestPlay.y][bestPlay.x] = AI_VALUE;
    time = performance.now() - time;
    return {bestPlay, time};
}

const RESULT = [0, 1, -1];

function alphabetapurning(board, isMax, alpha, beta) {
    let res;
    if((res = checkGame(board)) >= 0)
        return RESULT[res];
    let bestUtility = isMax ? -Infinity : Infinity;
    let utility;
    //start creating the tree
    for(let y = 0; y < boardSize; y++) {
        for(let x = 0; x < boardSize; x++) {
            if(board[y][x] == EMPTY) {
                board[y][x] = isMax ? AI_VALUE : PLAYER_VALUE;
                utility = alphabetapurning(board, !isMax, alpha, beta);
                board[y][x] = EMPTY;
                bestUtility = isMax ? Math.max(bestUtility, utility) : Math.min(bestUtility, utility);
                if(isMax) {
                    if(bestUtility > beta)
                        return bestUtility;
                    alpha = bestUtility > alpha ? bestUtility : alpha;
                } else {
                    if(bestUtility < alpha)
                        return bestUtility;
                    beta = bestUtility < beta ? bestUtility : beta;
                }
            }
        }
    }
    return bestUtility;
}

/*
    MINIMAX for reference

function nextPlayAfterPlayer(xp, yp) {
    let time = performance.now();
    board[yp][xp] = PLAYER_VALUE;
    let bestUtility = -Infinity;
    let bestPlay;
    let utility;
    for(let y = 0; y < BOARD_SIZE; y++) {
        for(let x = 0; x < BOARD_SIZE; x++) {
            if(board[y][x] == EMPTY) {
                board[y][x] = AI_VALUE;
                utility = minimax(board, false);
                board[y][x] = EMPTY;
                if(utility > bestUtility) {
                    bestUtility = utility;
                    bestPlay = {x, y};
                } 
                else if(utility == bestUtility)    
                    bestPlay = Math.random() > 0.5 ? bestPlay : {x, y};
            }
        }
    }
    board[bestPlay.y][bestPlay.x] = AI_VALUE;
    time = performance.now() - time;
    return {bestPlay, time};
}

function minimax(board, isMax) {
    let res;
    if((res = checkGame(board)) >= 0)
        return RESULT[res];
    let bestUtility = isMax ? -Infinity : Infinity;
    let utility;
    for(let y = 0; y < BOARD_SIZE; y++) {
        for(let x = 0; x < BOARD_SIZE; x++) {
            if(board[y][x] == EMPTY) {
                board[y][x] = isMax ? AI_VALUE : PLAYER_VALUE;
                utility = minimax(board, !isMax);
                board[y][x] = EMPTY;
                bestUtility = isMax ? Math.max(bestUtility, utility) : Math.min(bestUtility, utility);
            }
        }
    }
    return bestUtility;
}
*/