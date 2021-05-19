'use strict'
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const FLAGED_BUTTON = '🚗'
const BUTTON = 'w'


var gBoard
var gLevel
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    cellMarked: 0,
    cellClicked: 0,
    life:2//should be 0
}


var gLevels = [
    { size: 4, mines: 2 },
    { size: 8, mines: 12 },
    { size: 12, mines: 30 }
]


function initGame() {
    gBoard = buildBoard(gLevels[1])
    renderBoard(gBoard, '.board-container')
}
function buildBoard(level) {
    var board = []
    for (var i = 0; i < level.size; i++) {
        board[i] = []
        for (var j = 0; j < level.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    setMinesOnBoard(level.mines, board)
    setMinesNegsCount(board)
    return board
}
// Count mines around each cell
// and set the cell's
// minesAroundCount
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
}
// Render the board as a <table>
// to the page
function renderBoard(board, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cell = (!cell.isShown) ? EMPTY : (cell.isMine) ? MINE : '2'

            var className = 'cell cell' + i + '-' + j;
            // var dataId = `data-i="${i}" data-j="${j}"`;  ${dataId}
            strHTML += `<td class="${className}" onClick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})"> ${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}
// Called when a cell (td) is
// clicked
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var dataCell = gBoard[i][j]
    if (dataCell.isMarked) return
    gGame.cellsClicked++
    elCell.classList.add('shown')

    //in case of mine clicked
    if (dataCell.isMine) {
        dataCell.isShown = true
        gGame.life--
        elCell.innerHTML=MINE
        // renderCell(cell, MINE)
        if(gGame.life===0) checkGameOver()

        // in case of non mind clicked
    } else {
        dataCell.isShown = true
        if (gBoard[i][j].minesAroundCount !== 0) {
            elCell.innerHTML=dataCell.minesAroundCount
        }
        console.log(dataCell);
    }
    if (dataCell.minesAroundCount === 0 && !dataCell.isMine) {
        expandShown(gBoard, i, j)
    }
}

function cellMarked(elCell, i, j) {
    if(!gGame.isOn)return
    var dataCell = gBoard[i][j]
    if (!dataCell.isShown) {
        if (dataCell.isMarked) {
            dataCell.isMarked = false
            elCell.innerHTML = EMPTY
            gGame.cellMarked--

        } else {
            dataCell.isMarked = true
            elCell.innerHTML = FLAG
            gGame.cellMarked++
            elCell.innerHTML=FLAG
        }
    }
    console.log(gGame.cellMarked);
    console.log(dataCell);
}
// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    for(var i=0 ;i<gBoard.length;i++){
        for(var j=0;j<gBoard[0].length;j++){
            console.log(gBoard[i][j])
            var dataCell =gBoard[i][j]
        }
    }
}

function gameOver(){
    gGame.isOn=false
    console.log('Game over')

}
function expandShown(board, cellI, cellJ) {
    // console.log(board[cellI][cellJ])
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            board[i][j].isShown = true
            var elNegsCell = document.querySelector(`.cell${i}-${j}`)
            elNegsCell.classList.add('shown')

            if (board[i][j].minesAroundCount !== 0 || board[i][j].isMarked) {
                board[i][j].isMarked = false
                renderCell({ i, j }, board[i][j].minesAroundCount)
            }
        }
        console.log(i, j)
    } 
    // if (board[i][j].minesAroundCount === 0) expandShown(board, i, j)

}
// place mines on ranodom cell
function setMinesOnBoard(mines, board) {
    for (var i = 0; i < mines; i++) {
        var cell = {
            i: getRandomInt(0, board.length),
            j: getRandomInt(0, board[0].length)
        }
        board[cell.i][cell.j].isMine = (board[cell.i][cell.j].isMine) ? setMinesOnBoard(1, board) : true
    }
}