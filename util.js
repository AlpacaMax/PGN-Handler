function squareToPos(square) {
  const i = '8'.charCodeAt(0) - square.rank.charCodeAt(0);
  const j = square.file.charCodeAt(0) - 'a'.charCodeAt(0);

  return [i, j];
}

exports.squareToPos = squareToPos;
