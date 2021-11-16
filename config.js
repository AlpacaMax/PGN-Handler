exports.moveTypes = {
  NORMAL: 0b1,
  CAPTURE: 0b10,
  SHORTCASTLE: 0b100,
  LONGCASTLE: 0b1000,
  PROMOTION: 0b10000,
  CHECK: 0b100000,
  CHECKMATE: 0b1000000,
};
exports.results = {
  '1-0': 'White wins',
  '0-1': 'Black wins',
  '1/2-1/2': 'Draw',
  '*': 'Unfinished',
};
