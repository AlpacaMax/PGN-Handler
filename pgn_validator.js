const { Chess } = require('chess.js');
const _ = require('lodash');

function validate(parsedPgn) {
    function _helper(moves, chess) {
        let numOfHalfMoves = 0;

        for (let turn of moves) {
            // Validation for white move
            if (turn.white != null) {
                let movesForWhite = chess.moves();
                if (!movesForWhite.includes(turn.white.san)) {
                    turn.white.legalMove = false;
                    break;
                }
                turn.white.legalMove = true;
                if ("RAV" in turn.white) {
                    _helper(turn.white.RAV, chess);
                }
                let m = chess.move(turn.white.san);
                turn.white.from.file = m.from[0];
                turn.white.from.rank = m.from[1];
                ++numOfHalfMoves;
            }

            // Validation for black move
            if (turn.black != null) {
                let movesForBlack = chess.moves();
                if (!movesForBlack.includes(turn.black.san)) {
                    turn.black.legalMove = false;
                    break;
                }
                turn.black.legalMove = true;
                if ("RAV" in turn.black) {
                    _helper(turn.black.RAV, chess);
                }
                let m = chess.move(turn.black.san);
                turn.black.from.file = m.from[0];
                turn.black.from.rank = m.from[1];
                ++numOfHalfMoves;
            }
        }

        for (let i = 0; i < numOfHalfMoves; ++i) {
            chess.undo();
        }
    }

    const chess = new Chess();
    _helper(parsedPgn.moves, chess);
}

exports.validate = validate;