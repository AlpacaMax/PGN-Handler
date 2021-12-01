/**
 * Convert a string representation of a square into an array one
 * @param {string} square - The string representation of a square
 * @return {array} The array representation of the square
 */
function squareToPos(square) {
  const i = '8'.charCodeAt(0) - square.rank.charCodeAt(0);
  const j = square.file.charCodeAt(0) - 'a'.charCodeAt(0);

  return [i, j];
}

exports.squareToPos = squareToPos;
