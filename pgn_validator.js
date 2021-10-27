const { Chess } = require('chess.js');
const _ = require('lodash');

function validate(parsedPgn) {
    function _helper(moves, chess) {
        let numOfHalfMoves = 0;

        for (let turn of moves) {
            // Validation for white move
            if (turn.white != null) {
                let movesForWhite = chess.moves();
                if (!movesForWhite.includes(turn.white.SAN)) {
                    turn.white.LegalMove = false;
                    break;
                }
                turn.white.LegalMove = true;
                if ("RAV" in turn.white) {
                    _helper(turn.white.RAV, chess);
                }
                let m = chess.move(turn.white.SAN);
                turn.white.From.File = m.from[0];
                turn.white.From.Rank = m.from[1];
                ++numOfHalfMoves;
            }

            // Validation for black move
            if (turn.black != null) {
                let movesForBlack = chess.moves();
                if (!movesForBlack.includes(turn.black.SAN)) {
                    turn.black.LegalMove = false;
                    break;
                }
                turn.black.LegalMove = true;
                if ("RAV" in turn.black) {
                    _helper(turn.black.RAV, chess);
                }
                let m = chess.move(turn.black.SAN);
                turn.black.From.File = m.from[0];
                turn.black.From.Rank = m.from[1];
                ++numOfHalfMoves;
            }
        }

        for (let i = 0; i < numOfHalfMoves; ++i) {
            chess.undo();
        }
    }

    const chess = new Chess();
    _helper(parsedPgn.Moves, chess);
}

exports.validate = validate;