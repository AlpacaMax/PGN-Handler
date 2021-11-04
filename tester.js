const fs = require('fs');

const parser = require('./pgn_parser');
const validator = require('./pgn_validator');

let parsedPgn = parser.parse("test_pgns/test_legal_moves.pgn");

validator.validate(parsedPgn);
console.log(JSON.stringify(parsedPgn, null, 2));
