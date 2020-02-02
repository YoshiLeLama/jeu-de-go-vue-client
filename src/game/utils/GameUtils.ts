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

export function getDegreesOfLiberties(
    board: IBoard,
    x: number,
    y: number
): number {
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

    // On vérifie si l'intersection est vide
    if (board.boardState[y][x] !== Colors.none) {
        isMoveValid = false;
    } else {
        let rockColor = board.colorTurn;
        // On vérifie si la pierre n'aura pas de degré de liberté
        if (getDegreesOfLiberties(board, x, y) === 0) {
            let neighbours = getNeighbourRocks(board, x, y);

            // On vérifie si les groupes voisins de la pierre ont des degrés de liberté
            isMoveValid = neighbours.some(
                value =>
                    getColor(board, value.x, value.y) === rockColor &&
                    hasGroupDegreesOfLiberty(
                        board,
                        getGroupIndex(board, value.x, value.y),
                        x,
                        y,
                        board.colorTurn
                    )
            );
        } else {
            // Si la pierre aura des degrés de liberté, le mouvement est valide
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

export function removeGroup(board: IBoard, groupIndex: number): IBoard {
    // On change la valeur de chaque pierre du groupe en non-pierre
    board.groups[groupIndex].forEach(value => {
        board.boardState[value.y][value.x] = Colors.none;
    });

    // On crée un nouveau tableau de groupes temporaire
    let newGroups = new Array<Array<IGroupMember>>();

    // On ajoute tous les groupes de l'ancien tableau sauf celui que l'on veut retirer
    board.groups.forEach((value, index) => {
        if (index !== groupIndex) {
            newGroups.push(value);
        }
    });

    board.groups = newGroups;

    return board;
}

export function getClickPosition(
    offset: number,
    margin: number,
    tileWidthOrHeight: number
): number {
    // Formule inventée
    return Math.floor((offset - margin) / tileWidthOrHeight + 0.5);
}

export function getColor(board: IBoard, x: number, y: number): Colors {
    return board.boardState[y][x];
}

export function getGroupColor(board: IBoard, index: number) {
    // On récupère la première pierre du groupe
    let firstMember = board.groups[index][0];
    let firstMemberColor = getColor(board, firstMember.x, firstMember.y);

    // Si jamais la pierre n'existe pas (peu probable), on retourne une non-pierre
    if (firstMemberColor === null) {
        return Colors.none;
    }

    return firstMemberColor;
}

export function setColor(
    board: IBoard,
    x: number,
    y: number,
    color: Colors
): IBoard {
    board.boardState[y][x] = color;
    return board;
}

export function hasGroupDegreesOfLiberty(
    board: IBoard,
    groupIndex: number,
    newRockX: number,
    newRockY: number,
    color: Colors
): boolean {
    // On ajoute temporairement la pierre au plateau
    setColor(board, newRockX, newRockY, color);

    // On récupère le groupe dont on veut connaître les degrés de liberté
    const group = board.groups[groupIndex];

    // Le groupe a 1+ degré(s) de liberté si au moins une de ses pièces a 1+ degré(s) de liberté
    const hasLiberty = group.some(
        value => getDegreesOfLiberties(board, value.x, value.y) > 0
    );

    // On retire la pierre du plateau
    setColor(board, newRockX, newRockY, Colors.none);

    return hasLiberty;
}
