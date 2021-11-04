const parser = require('./pgn_parser');
const validator = require('./pgn_validator');

test('Test legal move validation', () => {
    let parsedPgn = parser.parse("test_pgns/test_legal_moves.pgn");
    validator.validate(parsedPgn);
    expect(parsedPgn.moves[0].white.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.rav.black.legalMove).toBeFalsy();
    expect(parsedPgn.moves[1].white.legalMove).toBeTruthy();
});