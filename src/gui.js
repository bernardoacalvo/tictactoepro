import { boardClickListener, restartButtonListener } from "./app.js";

export {
    setup, drawBoard, drawCircle, drawX, drawWinnerPlay,
    writeOnElem, clearElem, clearCanvas
}

const GRID_DRAW_OFFSET = 7;
const X_DRAW_OFFSET = 20;
const CIRCLE_DRAW_RADIUS = 35;
const LINE_WIDTH_BOARD = 1;
const LINE_WIDTH_WINNER = 5;

function setup(canvas, boardSize) {
    drawBoard(canvas, boardSize);
}

/** CANVAS RELATED **/

//only for boards size=3
function drawBoard(canvas, boardSize) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH_BOARD;
    ctx.strokeStyle = 'black';

    ctx.moveTo(canvas.width/boardSize, GRID_DRAW_OFFSET);
    ctx.lineTo(canvas.width/boardSize, canvas.height-GRID_DRAW_OFFSET);
    ctx.stroke();

    ctx.moveTo(2*canvas.width/boardSize, GRID_DRAW_OFFSET);
    ctx.lineTo(2*canvas.width/boardSize, canvas.height-GRID_DRAW_OFFSET);
    ctx.stroke();

    ctx.moveTo(GRID_DRAW_OFFSET, canvas.width/boardSize);
    ctx.lineTo(canvas.width-GRID_DRAW_OFFSET, canvas.height/boardSize);
    ctx.stroke();

    ctx.moveTo(GRID_DRAW_OFFSET, 2*canvas.width/boardSize);
    ctx.lineTo(canvas.width-GRID_DRAW_OFFSET, 2*canvas.height/boardSize);
    ctx.stroke();
}

document.getElementById("canvas").addEventListener('click', function(event) {
    boardClickListener(event.offsetX, event.offsetY);
});

document.getElementById("btn-restart").addEventListener('click', function() {
    restartButtonListener();
});

function drawCircle(canvas, x, y) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, CIRCLE_DRAW_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawX(canvas, x, y) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x - X_DRAW_OFFSET, y - X_DRAW_OFFSET);
    ctx.lineTo(x + X_DRAW_OFFSET, y + X_DRAW_OFFSET);

    ctx.moveTo(x + X_DRAW_OFFSET, y - X_DRAW_OFFSET);
    ctx.lineTo(x - X_DRAW_OFFSET, y + X_DRAW_OFFSET);
    ctx.stroke();
}

function drawWinnerPlay(canvas, x0, y0, x1, y1) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = LINE_WIDTH_WINNER;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

function clearCanvas(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/** LOGGER RELATED **/

function writeOnElem(elem, message) {
    let paragraph = document.createElement("p");
    let text = document.createTextNode(message);
    paragraph.appendChild(text);
    elem.appendChild(paragraph);
    return paragraph;
}

function clearElem(elem) {
    elem.innerHTML = '';
}
