const parser = require('./pgn_parser');
const validator = require('./pgn_validator');

test('Test legal move validation', () => {
    let parsedPgn = parser.parse("test_pgns/test_legal_moves.pgn");
    validator.validate(parsedPgn);
    expect(parsedPgn.moves[0].white.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.rav[0].black.legalMove).toBeFalsy();
    expect(parsedPgn.moves[1].white.legalMove).toBeTruthy();
});

test('Test move types', () => {
    let parsedPgn = parser.parse("test_pgns/test_move_type.pgn");
    expect(parsedPgn.moves[0].white.type).toBe(1);
    expect(parsedPgn.moves[0].black.type).toBe(3);
    expect(parsedPgn.moves[1].white.type).toBe(4);
    expect(parsedPgn.moves[1].black.type).toBe(8);
    expect(parsedPgn.moves[2].white.type).toBe(17);
    expect(parsedPgn.moves[2].black.type).toBe(33);
    expect(parsedPgn.moves[3].white.type).toBe(65);
})