import {
    getTileWidth,
    getTileHeight,
    getGameElement,
    getGameContext,
    getNeighbourRocks,
    clearBoardDraw
} from './utils/GameUtils';

export enum Colors {
    black = 'B',
    white = 'W',
    none = '-'
}

export interface IBoard {
    boardId: string;
    size: number;
    boardState: Array<Array<Colors>>;
    margin: number;
    groups: Array<Array<IGroupMember>>;
}

export interface IGroupMember {
    x: number;
    y: number;
}

export function initializeBoard(board: IBoard) {
    drawBackground(board);
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

export function drawBackground(board: IBoard) {
    let game = getGameElement(board.boardId);
    let ctx = getGameContext(game);

    if (ctx === null || game === null) {
        return;
    }

    ctx.beginPath();
    ctx.rect(0, 0, game.width, game.height);
    ctx.fillStyle = '#eaa615';
    ctx.fill();
    ctx.closePath();
}

export function drawBoard(board: IBoard) {
    let game = getGameElement(board.boardId);
    let ctx = getGameContext(game);

    if (ctx === null || game == null) {
        return;
    }

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
        console.error('La hauteur de la case a pour valeur null');
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

    if (el === null || ctx === null) {
        return;
    }

    let tileWidth = getTileWidth(board, el.width);
    let tileHeight = getTileHeight(board, el.height);

    if (tileWidth === null || tileHeight === null) {
        return;
    }

    ctx.beginPath();

    let size = board.size;
    let margin = board.margin;
    let state = board.boardState;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (state[y][x] === Colors.black) {
                ctx.rect(
                    tileWidth * (x - 0.25) + margin,
                    tileHeight * (y - 0.25) + margin,
                    tileWidth / 2,
                    tileHeight / 2
                );
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

    let tileWidth = getTileWidth(board),
        tileHeight = getTileHeight(board);

    if (tileWidth === null || tileHeight === null) {
        return null;
    }

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
): IBoard {
    board.boardState[y][x] = color;

    // On met à jour l'état des groupes autour de la pierre posée
    board.groups = updateGroups(board, x, y);

    // On redessine le plateau
    clearBoardDraw(board);
    drawBackground(board);
    drawBoard(board);
    drawRocks(board);

    return board;
}

/**
 * Permet de mettre à jour les groupes de pièces du plateau.
 *
 * @param board Le plateau dont on veut mettre à jour les groupes
 * @param x La position en x de la dernière pièce posée
 * @param y La position en y de la dernière pièce posée
 */
export function updateGroups(
    board: IBoard,
    x: number,
    y: number
): Array<Array<IGroupMember>> {
    let neighbours = getNeighbourRocks(board, x, y);
    // Variable qui permet de stocker les index des groupes des voisins de la pierre
    let indexOfGroups = new Array<number>();
    // Variable qui permet de stocker le nouveau groupe potentiellement créé
    let newGroups = new Array<Array<IGroupMember>>();

    // Si la pierre n'a pas de voisin direct
    if (neighbours.length === 0) {
        console.log("Il n'y pas de voisins");
        // On crée un nouveau groupe et on y ajoute la pierre
        let newGroup: Array<IGroupMember> = [{ x: x, y: y }];

        // On ajoute le nouveau groupe aux groupes du plateau
        board.groups.push(newGroup);
    } else {
        console.log(
            'Il y a des voisins',
            neighbours.length,
            board.groups.length
        );

        // On récupère la couleur de la pierre
        const rockColor: Colors = board.boardState[y][x];

        for (let i = 0; i < neighbours.length; i++) {
            let neighbourX = neighbours[i].x,
                neighbourY = neighbours[i].y,
                neighbourColor = board.boardState[neighbourY][neighbourX];

            for (let g = 0; g < board.groups.length; g++) {
                board.groups[g].map(e => {
                    if (
                        e.x === neighbourX &&
                        e.y === neighbourY &&
                        neighbourColor === rockColor
                    ) {
                        indexOfGroups.push(g);
                    }
                });
            }
        }

        // Si la pierre n'a qu'un seul voisin, on ajoute la pierre au groupe
        // de son unique voisin
        if (indexOfGroups.length === 1) {
            board.groups[indexOfGroups[0]].push({ x: x, y: y });
        } else {
            // Sinon, on recrée le tableau des groupes du plateau (variable newGroups)

            // On crée le nouveau groupe de pierres
            let newGroup = new Array<IGroupMember>();

            for (let i = 0; i < board.groups.length; i++) {
                // Si le tableau à l'index i du tableau des groupes contient
                // un voisin de la pierre, on l'ajoute au nouveau tableau des groupes
                if (indexOfGroups.indexOf(i) === -1) {
                    newGroups.push(board.groups[i]);
                } else {
                    // Sinon, on fusionne le groupe avec le nouveau groupe crée plus haut
                    newGroup = newGroup.concat(board.groups[i]);
                }
            }

            // On ajoute au nouveau groupe la pierre qui a été posée
            newGroup.push({ x: x, y: y });
            // On ajoute le nouveau groupe au nouveau tableau des groupes
            newGroups.push(newGroup);

            // On change la valeur du tableau de groupes du plateau
            // par le nouveau tableau de groupe
            board.groups = newGroups;
        }
    }

    return board.groups;
}
