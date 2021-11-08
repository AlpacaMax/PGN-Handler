const { Chess } = require('chess.js')

function fillStartPosition(parsedPgn) {

}

function fillFEN(parsedPgn) {
    function _helper(moves, chess) {
        let numOfHalfMoves = 0;

        for (const turn of moves) {
            if (turn.white != null) {
                if (!turn.white.legalMove) {
                    break;
                }

                chess.move(turn.white.san);
                turn.white.fen = chess.fen();
            }

            if (turn.black != null) {
                if (!turn.black.legalMove) {
                    break;
                }

                chess.move(turn.black.san);
                turn.black.fen = chess.fen();
            }
        }

        for (let i = 0; i < numOfHalfMoves; ++i) {
            chess.undo();
        }
    }

    const chess = new Chess();
    _helper(parsedPgn.moves, chess);
}

exports.fillFEN = fillFEN;