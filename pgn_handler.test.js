const parser = require('./pgn_parser');
const validator = require('./pgn_validator');

test('Test legal move validation', () => {
    let parsedPgn = parser.parseRaw("test_pgns/test_legal_moves.pgn");
    validator.validate(parsedPgn);
    expect(parsedPgn.moves[0].white.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.legalMove).toBeTruthy();
    expect(parsedPgn.moves[0].black.rav[0].black.legalMove).toBeFalsy();
    expect(parsedPgn.moves[1].white.legalMove).toBeTruthy();
});

test('Test move types', () => {
    let parsedPgn = parser.parseRaw("test_pgns/test_move_type.pgn");
    expect(parsedPgn.moves[0].white.type).toBe(
        parser.moveTypes.NORMAL
    );
    expect(parsedPgn.moves[0].black.type).toBe(
        parser.moveTypes.NORMAL | parser.moveTypes.CAPTURE
    );
    expect(parsedPgn.moves[1].white.type).toBe(
        parser.moveTypes.SHORTCASTLE
    );
    expect(parsedPgn.moves[1].black.type).toBe(
        parser.moveTypes.LONGCASTLE
    );
    expect(parsedPgn.moves[2].white.type).toBe(
        parser.moveTypes.NORMAL | parser.moveTypes.PROMOTION
    );
    expect(parsedPgn.moves[2].black.type).toBe(
        parser.moveTypes.NORMAL | parser.moveTypes.CHECK
    );
    expect(parsedPgn.moves[3].white.type).toBe(
        parser.moveTypes.NORMAL | parser.moveTypes.CHECKMATE
    );
})