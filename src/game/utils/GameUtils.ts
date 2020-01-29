import { IBoard, IGroupMember, Colors } from '../game';

export function getGameElement(id: string = 'game') {
    let game = document.getElementsByTagName('canvas').namedItem(id);

    if (game === null) {
        return null;
    }

    return game;
}

export function getGameContext(game: HTMLCanvasElement | null) {
    if (game === null) {
        return null;
    }

    let ctx = game.getContext('2d');

    if (ctx === null) {
        return null;
    }

    return ctx;
}
/**
 * Fonction permettant de récupérer la largeur des cases d'un plateau
 * @param board Le plateau dont on veut veut savoir la largeur des cases
 * @param width La largeur du plateau (optionnel: permet d'accélérer les opérations)
 */
export function getTileWidth(board: IBoard, width: number = -1) {
    if (width >= 0) {
        return (width - 2 * board.margin) / (board.size - 1);
    } else {
        let el = getGameElement(board.boardId);

        if (el === null) {
            return null;
        }

        return (el.width - 2 * board.margin) / (board.size - 1);
    }
}

/**
 * Fonction permettant de récupérer la hauteur des cases d'un plateau
 * @param board Le plateau dont on veut veut savoir la hauteur des cases
 * @param width La largeur du plateau (optionnel: permet d'accélérer les opérations)
 */
export function getTileHeight(board: IBoard, height: number = -1) {
    if (height >= 0) {
        return (height - 2 * board.margin) / (board.size - 1);
    } else {
        let el = getGameElement(board.boardId);

        if (el === null) {
            return null;
        }

        return (el.height - 2 * board.margin) / (board.size - 1);
    }
}
/**
 * Fonction permettant de récupérer les voisins d'une pierre du plateau.
 * les voisins sont les pierres qui se trouvent sur les côtés de la pierre concernée.
 *
 * @param board Le plateau qui contient la pierre en question
 * @param x L'abscisse de la pierre dont on veut savoir les voisins
 * @param y L'ordonnée de la pierre dont on veut savoir les voisins
 */
export function getNeighbourRocks(board: IBoard, x: number, y: number) {
    let neighbours: Array<IGroupMember> = new Array();

    if (board.boardState[y][x + 1]) {
        if (board.boardState[y][x + 1] !== Colors.none) {
            neighbours.push({ x: x + 1, y: y });
        }
    }
    if (board.boardState[y][x - 1]) {
        if (board.boardState[y][x - 1] !== Colors.none) {
            neighbours.push({ x: x - 1, y: y });
        }
    }
    if (board.boardState[y + 1]) {
        if (board.boardState[y + 1][x] !== Colors.none) {
            neighbours.push({ x: x, y: y + 1 });
        }
    }
    if (board.boardState[y - 1]) {
        if (board.boardState[y - 1][x] !== Colors.none) {
            neighbours.push({ x: x, y: y - 1 });
        }
    }

    return neighbours;
}

export function clearBoardDraw(board: IBoard) {
    let game = getGameElement(board.boardId);
    let ctx = getGameContext(game);

    if (ctx === null || game == null) {
        return;
    }

    ctx.clearRect(0, 0, game.width, game.height);
}

export function getDegreesOfLiberties(board: IBoard, x: number, y: number) {
    let degreesOfLiberties: number = 4;

    if (board.boardState[y][x + 1]) {
        if (board.boardState[y][x + 1] !== Colors.none) {
            degreesOfLiberties--;
        }
    } else {
        degreesOfLiberties--;
    }
    if (board.boardState[y][x - 1]) {
        if (board.boardState[y][x - 1] !== Colors.none) {
            degreesOfLiberties--;
        }
    } else {
        degreesOfLiberties--;
    }
    if (board.boardState[y + 1]) {
        if (board.boardState[y + 1][x] !== Colors.none) {
            degreesOfLiberties--;
        }
    } else {
        degreesOfLiberties--;
    }
    if (board.boardState[y - 1]) {
        if (board.boardState[y - 1][x] !== Colors.none) {
            degreesOfLiberties--;
        }
    } else {
        degreesOfLiberties--;
    }

    return degreesOfLiberties;
}

export function getGroupIndex(board: IBoard, x: number, y: number): number {
    let indexOfRockGroup = -1;

    board.groups.forEach((value, index) => {
        value.forEach(rock => {
            if (rock.x === x && rock.y === y) {
                indexOfRockGroup = index;
            }
        });
    });

    return indexOfRockGroup;
}

export function isMoveValid(board: IBoard, x: number, y: number): boolean {
    let isMoveValid = false;

    if (board.boardState[y][x] !== Colors.none) {
        isMoveValid = false;
    } else {
        let rockColor = board.colorTurn;
        if (getDegreesOfLiberties(board, x, y) === 0) {
            let neighbours = getNeighbourRocks(board, x, y);
            neighbours.every(value => {
                if (board.boardState[value.y][value.x] === rockColor) {
                    isMoveValid = true;
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            isMoveValid = true;
        }
    }

    return isMoveValid;
}

export function switchColorTurn(actualColor: Colors): Colors {
    if (actualColor === Colors.black) {
        actualColor = Colors.white;
    } else {
        actualColor = Colors.black;
    }
    return actualColor;
}

export function removeGroup(board: IBoard, index: number): IBoard {
    board.groups[index].forEach(value => {
        board.boardState[value.y][value.x] = Colors.none;
    });

    return board;
}
