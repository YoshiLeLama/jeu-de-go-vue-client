import { getTileWidth, getTileHeight, getGameElement, getGameContext } from './utils/GameUtils';

export enum Colors {
    black = "B",
    white = "W",
    none = "-"
}

export interface IBoard {
    boardId: string;
    size: number;
    boardState: Array<Array<Colors>>;
    margin: number;
}

export interface IGroupMember {
    x: number,
    y: number
}

export function initializeBoard(board: IBoard) {
    drawBoard(board);
    drawRocks(board);
}

export function initializeBoardState(size: number) {
    let state: Array<Array<Colors>> = new Array<Array<Colors>>();

    for (let y = 0; y < size; y++) {
        let row: Array<Colors> = new Array(size);

        for (let x = 0; x < size; x++) {
            row[x] = Colors.none;
        }

        state.push(row);
    }

    return state;
}

export function drawBoard(board: IBoard) {
    let game = getGameElement();
    let ctx = getGameContext(game);

    if (ctx === null || game == null) {
        return;
    }

    ctx.clearRect(0, 0, game.width, game.height);

    let tileWidth = getTileWidth(board, game.width);

    if (tileWidth === null) {
        console.error('La largeur de la case a pour valeur null');
        return;
    }

    // Generate the columns lines
    for (let index = 0; index < board.size; index++) {
        ctx.beginPath();
        ctx.moveTo(tileWidth * index + board.margin, board.margin);
        ctx.lineTo(
            tileWidth * index + board.margin,
            game.height - board.margin
        );
        ctx.stroke();
    }

    let tileHeight = getTileHeight(board, game.height);

    if (tileHeight === null) {
        console.error('La hauteur de la case a pour valeur null')
        return;
    }

    // Generate the rows lines
    for (let index = 0; index < board.size; index++) {
        ctx.beginPath();
        ctx.moveTo(board.margin, tileHeight * index + board.margin);
        ctx.lineTo(game.width - board.margin, tileWidth * index + board.margin);
        ctx.stroke();
    }
}

export function drawRocks(board: IBoard) {
    let el = getGameElement(board.boardId);
    let ctx = getGameContext(el);

    if(el === null ||ctx === null) {
        return;
    }

    let tileWidth = getTileWidth(board, el.width);
    let tileHeight = getTileHeight(board, el.height);

    if(tileWidth === null || tileHeight === null) {
        return;
    }

    ctx.beginPath();

    let size = board.size;
    let margin = board.margin;
    let state = board.boardState;
    for(let y = 0; y < size; y++){
        for (let x = 0; x < size; x++) {
            if (state[y][x] === Colors.black) {
                ctx.rect(tileWidth * (x - 0.25) + margin, tileHeight * (y - 0.25) + margin, tileWidth/2, tileHeight/2);
                ctx.fillStyle = 'black';
                ctx.fill();
            }
        }
    }

    ctx.closePath();
}

export function handleBoardClick(e: MouseEvent, board: IBoard) {
    let game = getGameElement(board.boardId);

    if (game === null) {
        return;
    }

    let ctx = getGameContext(game);

    if (ctx === null) {
        return;
    }
    
    let tileWidth = getTileWidth(board), tileHeight = getTileHeight(board);

    if (tileWidth === null || tileHeight === null) {return null;}

    let x = Math.floor((e.offsetX - board.margin) / tileWidth + 0.5);
    let y = Math.floor((e.offsetY - board.margin) / tileHeight + 0.5);

    board = placeRock(x, y, board, Colors.black);

    return board;
}

export function placeRock(
    x: number,
    y: number,
    board: IBoard,
    color: Colors
) : IBoard {
    board.boardState[y][x] = color;

    drawBoard(board);
    drawRocks(board);

    return board;
}

export function getNeighbourTiles(board: IBoard, x: number, y: number) {

}