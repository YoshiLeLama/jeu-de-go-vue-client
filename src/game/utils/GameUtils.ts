import { IBoard } from '../game';

export function getGameElement(id: string = "game") {
    let game = document.getElementsByTagName("canvas").namedItem(id);

    console.log("yo", game);

    if (game === null) {
        console.error(
            `Il n'y a pas de Canvas ayant comme id ${id} dans la page`
        );
        return null;
    }

    return game;
}

export function getGameContext(game: HTMLCanvasElement | null) {
    if (game === null) {
        return null;
    }

    let ctx = game.getContext("2d");

    if (ctx === null) {
        console.error(
            `Le contexte du Canvas d'id ${game.id} n'a pas pu être récupéré`
        );
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
