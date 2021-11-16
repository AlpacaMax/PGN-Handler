const parser = require('./pgn_parser');
const validator = require('./pgn_validator');
const modifier = require('./pgn_modifiers');
const {moveTypes, results} = require('./config');
const {squareToPos} = require('./util');

test('Test legal move validation', () => {
  const parsedPgn = parser.parseRaw('test_pgns/test_legal_moves.pgn');
  validator.validate(parsedPgn);
  expect(parsedPgn.moves[0].white.legalMove).toBeTruthy();
  expect(parsedPgn.moves[0].black.legalMove).toBeTruthy();
  expect(parsedPgn.moves[0].black.rav[0].black.legalMove).toBeFalsy();
  expect(parsedPgn.moves[1].white.legalMove).toBeTruthy();
});

test('Test move types', () => {
  const parsedPgn = parser.parseRaw('test_pgns/test_move_type.pgn');
  expect(parsedPgn.moves[0].white.type).toBe(
      moveTypes.NORMAL,
  );
  expect(parsedPgn.moves[0].black.type).toBe(
      moveTypes.NORMAL | moveTypes.CAPTURE,
  );
  expect(parsedPgn.moves[1].white.type).toBe(
      moveTypes.SHORTCASTLE,
  );
  expect(parsedPgn.moves[1].black.type).toBe(
      moveTypes.LONGCASTLE,
  );
  expect(parsedPgn.moves[2].white.type).toBe(
      moveTypes.NORMAL | moveTypes.PROMOTION,
  );
  expect(parsedPgn.moves[2].black.type).toBe(
      moveTypes.NORMAL | moveTypes.CHECK,
  );
  expect(parsedPgn.moves[3].white.type).toBe(
      moveTypes.NORMAL | moveTypes.CHECKMATE,
  );
});

test('Test fillFEN function', () => {
  const parsedPgn = parser.parseRaw('test_pgns/test_legal_moves.pgn');
  validator.validate(parsedPgn);
  modifier.fillFEN(parsedPgn);

  expect(parsedPgn.moves[0].white.fen).toBe(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
  );
  expect(parsedPgn.moves[0].black.fen).toBe(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
  );
  expect(parsedPgn.moves[0].black.rav[0].black.fen).toBeUndefined();
  expect(parsedPgn.moves[1].white.fen).toBe(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  );
});

test('Test squareToPos function', () => {
  expect(squareToPos({file: 'a', rank: '1'})).toEqual([7, 0]);
  expect(squareToPos({file: 'a', rank: '8'})).toEqual([0, 0]);
  expect(squareToPos({file: 'h', rank: '1'})).toEqual([7, 7]);
  expect(squareToPos({file: 'h', rank: '8'})).toEqual([0, 7]);
  expect(squareToPos({file: 'e', rank: '4'})).toEqual([4, 4]);
});

test('Test result on board', () => {
  const unfinished = parser.parseRaw('test_pgns/test_legal_moves.pgn');
  const draw = parser.parseRaw('test_pgns/test_draw.pgn');
  const whiteWin = parser.parseRaw('test_pgns/test_white_win.pgn');
  const blackWin = parser.parseRaw('test_pgns/test_black_win.pgn');
  validator.validate(unfinished);
  validator.validate(draw);
  validator.validate(whiteWin);
  validator.validate(blackWin);

  expect(unfinished.resultOnBoard).toBe(results['*']);
  expect(draw.resultOnBoard).toBe(results['1/2-1/2']);
  expect(whiteWin.resultOnBoard).toBe(results['1-0']);
  expect(blackWin.resultOnBoard).toBe(results['0-1']);
});
