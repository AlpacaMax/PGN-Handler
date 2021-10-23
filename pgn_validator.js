const chess = require('chess');
const _ = require('lodash');

function validate(parsedPgn) {
    function _helper(moves, gameClient) {
        for (let turn of moves) {
            // Validation for white move
            if (turn.white != null) {
                let movesForWhite = gameClient.getStatus().notatedMoves;
                if (!(turn.white.SAN in movesForWhite)) {
                    turn.white.LegalMove = false;
                    break;
                }
                turn.white.LegalMove = true;
                if ("RAV" in turn.white) {
                    _helper(turn.white.RAV, _.cloneDeep(gameClient));
                }
                gameClient.move(turn.white.SAN);
            }

            // Validation for black move
            if (turn.black != null) {
                let movesForBlack = gameClient.getStatus().notatedMoves;
                if (!(turn.black.SAN in movesForBlack)) {
                    turn.black.LegalMove = false;
                    break;
                }
                turn.black.LegalMove = true;
                if ("RAV" in turn.black) {
                    _helper(turn.black.RAV, _.cloneDeep(gameClient));
                }
                gameClient.move(turn.black.SAN);
            }
        }
    }

    const gameClient = chess.create({ PGN: true});
    _helper(parsedPgn.Moves, gameClient);
}

exports.validate = validate;