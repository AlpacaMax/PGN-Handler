const {parseRaw} = require('./pgn_parser');
const {validate} = require('./pgn_validator');
const {fillFEN, fillStartPosition} = require('./pgn_modifiers');

/**
 * A compound parse function with validation and slight modification of
 * the parsed result
 *
 * @param {string} filename - Filename of the PGN file
 * @return {object} The object representation of the PGN file
 */
function parse(filename) {
  const parsedPgn = parseRaw(filename);
  validate(parsedPgn);
  fillStartPosition(parsedPgn);
  fillFEN(parsedPgn);

  return parsedPgn;
}

exports.parseRaw = parseRaw;
exports.parse = parse;
