const {Chess} = require('chess.js');
const {moveTypes} = require('./config');

/**
 * Take a object representation of a PGN file and add start position for
 * each move
 * @param {object} parsedPgn - The object representation of a PGN file
 */
function fillStartPosition(parsedPgn) {
  /** Recursive helper function
   * @param {array} moves - Moves extracted from parsedPgn
   * @param {object} chess - The chess object created using chess.js
   */
  function _helper(moves, chess) {
    const numOfHalfMoves = 0;

    for (const turn of moves) {
      if (turn.white != null) {
        if (!turn.white.legalMove) {
          break;
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
      }

      if (turn.black != null) {
        if (!turn.black.legalMove) {
          break;
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
      }
    }

    for (let i = 0; i < numOfHalfMoves; ++i) {
      chess.undo();
    }
  }

  const chess = new Chess();
  _helper(parsedPgn.moves, chess);
}

/**
 * Take an objct representation of a PGN file and add FEN code for the
 * position after each move
 * @param {object} parsedPgn - The object representation of a PGN file
 */
function fillFEN(parsedPgn) {
  /** Recursive helper function
   * @param {array} moves - Moves extracted form parsedPgn
   * @param {object} chess - The chess object created using chess.js
   */
  function _helper(moves, chess) {
    const numOfHalfMoves = 0;

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
exports.fillStartPosition = fillStartPosition;
