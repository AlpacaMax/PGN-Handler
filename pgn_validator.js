const {Chess} = require('chess.js');
const moveTypes = require('./pgn_parser').moveTypes;

function validate(parsedPgn) {
  function _helper(moves, chess) {
    let numOfHalfMoves = 0;

    for (const turn of moves) {
      // Validation for white move
      if (turn.white != null) {
        const movesForWhite = chess.moves();
        if (!movesForWhite.includes(turn.white.san)) {
          turn.white.legalMove = false;
          break;
        }
        turn.white.legalMove = true;
        if ('rav' in turn.white) {
          _helper(turn.white.rav, chess);
        }
        const m = chess.move(turn.white.san);
        if (
          turn.white.type &
                    (moveTypes.SHORTCASTLE | moveTypes.LONGCASTLE) ==
                    0
        ) { // If it's not castle
          turn.white.from.file = m.from[0];
          turn.white.from.rank = m.from[1];
        }
        ++numOfHalfMoves;
      }

      // Validation for black move
      if (turn.black != null) {
        const movesForBlack = chess.moves();
        if (!movesForBlack.includes(turn.black.san)) {
          turn.black.legalMove = false;
          break;
        }
        turn.black.legalMove = true;
        if ('rav' in turn.black) {
          _helper(turn.black.rav, chess);
        }
        const m = chess.move(turn.black.san);
        if (
          turn.black.type &
                    (moveTypes.SHORTCASTLE | moveTypes.LONGCASTLE) ==
                    0
        ) {
          turn.black.from.file = m.from[0];
          turn.black.from.rank = m.from[1];
        }
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
