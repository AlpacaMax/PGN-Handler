const {Chess} = require('chess.js');

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

        chess.move(turn.white.san);
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

        chess.move(turn.black.san);
        ++numOfHalfMoves;
      }
    }

    let result = 'Unfinished';
    if (chess.in_draw()) {
      result = 'Draw';
    } else if (chess.in_checkmate()) {
      const lastMovedSide = chess.history[chess.history.legnth-1].color;
      if (lastMovedSide == 'w') {
        result = 'White wins';
      } else {
        result = 'Black wins';
      }
    }

    for (let i = 0; i < numOfHalfMoves; ++i) {
      chess.undo();
    }

    return result;
  }

  const chess = new Chess();
  console.log(_helper(parsedPgn.moves, chess));
}

exports.validate = validate;
