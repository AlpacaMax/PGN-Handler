const fs = require('fs');
const ohm = require('ohm-js');
const {moveTypes, results} = require('./config');

const g = ohm.grammar(fs.readFileSync('pgn_grammar.ohm'));

const semantics = g.createSemantics().addOperation('parse', {
  _terminal() {
    return this.sourceString;
  },
  _iter(...children) {
    return children.map((c) => c.parse());
  },
  string(l, str, r) {
    str = str.sourceString;
    return str.replaceAll('\\\\', '\\').replaceAll('\\"', '"');
  },
  fstring(l, format, r) {
    return format.parse();
  },
  symbol(a, b) {
    return this.sourceString;
  },
  twoDigitNum(a, b) {
    return a.sourceString + b.sourceString;
  },
  fourDigitNum(a, b, c, d) {
    return a.sourceString +
             b.sourceString +
             c.sourceString +
             d.sourceString;
  },
  number(n) {
    return n.sourceString === '?' || n.sourceString === '-' ?
      null : parseInt(n.sourceString, 10);
  },
  date(year, a, month, b, day) {
    return {
      year: year.parse(),
      month: month.parse(),
      day: day.parse(),
    };
  },
  time(hour, a, minute, b, second) {
    return {
      hour: hour.parse(),
      minute: minute.parse(),
      second: second.parse(),
    };
  },
  roundNums(list) {
    return list.sourceString === '-' || list.sourceString === '?' ?
      null : list.asIteration().parse();
  },
  result(r) {
    return results[r.sourceString];
  },
  square(file, rank) {
    return {
      file: file.sourceString,
      rank: rank.sourceString,
    };
  },
  piece(p) {
    p = p.parse();
    return typeof (p) === 'object' ? 'P' : p;
  },
  normalMove(piece, destSquare) {
    return {
      // mate, check, promotion, long_castle, short_castle, takes, normal
      type: moveTypes.NORMAL,
      piece: piece.parse(),
      from: {
        file: null,
        rank: null,
      },
      to: destSquare.parse(),
    };
  },
  specificMove(piece, startFile, startRank, takes, destSquare) {
    startFile = startFile.parse();
    startRank = startRank.parse();
    takes = takes.parse();

    return {
      type: takes.length === 0 ?
            moveTypes.NORMAL : moveTypes.NORMAL | moveTypes.CAPTURE,
      piece: piece.parse(),
      from: {
        file: startFile.length === 0 ? null : startFile[0],
        rank: startRank.length === 0 ? null : startRank[0],
      },
      to: destSquare.parse(),
    };
  },
  promotion(move, equals, piece) {
    const result = move.parse();
    result.type |= moveTypes.PROMOTION;
    result.promotion = piece.parse();
    return result;
  },
  castle(move) {
    return {
      type: move.parse() === 'O-O' ?
            moveTypes.SHORTCASTLE : moveTypes.LONGCASTLE,
    };
  },
  moveNum(num, dot) {
    return parseInt(num.sourceString, 10);
  },
  comment(l, comment, r) {
    return comment.sourceString;
  },
  san(move, checkOrMate, suffix) {
    const moveParsed = move.parse();
    const checkOrMateParsed = checkOrMate.parse();
    const suffixParsed = suffix.parse();

    if (checkOrMateParsed[0] === '+') {
      moveParsed.type |= moveTypes.CHECK;
    } else if (checkOrMateParsed[0] === '#') {
      moveParsed.type |= moveTypes.CHECKMATE;
    }

    moveParsed.suffixParsed = suffixParsed.length === 0 ?
                              null : suffixParsed[0];
    moveParsed.san = this.sourceString;

    return moveParsed;
  },
  movesTimePair(numMoves, _, time) {
    return {
      numMoves: parseInt(numMoves.sourceString, 10),
      time: parseInt(time.sourceString, 10),
    };
  },
  Header(list) {
    return {
      header: Object.fromEntries(list.asIteration().parse()),
    };
  },
  Tag(l, sym, str, r) {
    const tag = sym.parse().toLowerCase();
    const content = str.parse();
    return [tag, content === '?' || content == '-' ? null : content];
  },
  Rav(l, moves, r) {
    const movesParsed = moves.parse();

    return movesParsed;
  },
  Move(san, comment) {
    const sanParsed = san.parse();
    if (sanParsed == "..") return null;

    const commentParsed = comment.parse();

    if (commentParsed.length > 0) sanParsed.comment = commentParsed[0];

    return sanParsed;
  },
  NormalRound(moveNum, whiteMove, blackMove, rav) {
    const move = moveNum.parse();
    const white = whiteMove.parse();
    const black = blackMove.parse();
    const ravParsed = rav.parse();

    if (ravParsed.length > 0) black.rav = ravParsed[0];

    return {
      move,
      white,
      black,
    };
  },
  RoundWhiteRav(moveNum, whiteMove, rav) {
    const move = moveNum.parse();
    const white = whiteMove.parse()
    white.rav = rav.parse()[0];

    return {
      move,
      white,
      black: null,
    }
  },
  LastRound(moveNum, whiteMove) {
    const white = whiteMove.parse();
    return {
      move: moveNum.parse(),
      white,
      black: null,
    };
  },
  Moves(list, lastSan) {
    const moves = list.asIteration().parse();
    lastSan = lastSan.parse();
    if (lastSan.length > 0) moves.push(lastSan[0]);

    let i = 0;
    let shift = 0;
    while (i < moves.length - 1) {
      if (
        moves[i].moveNum == moves[i+1].moveNum &&
        moves[i].black == null &&
        moves[i+1].white == null
      ) {
        moves[i].black = moves[i+1].black;
        shift += 1;
        i += 2;
      } else {
        i++;
      }

      moves[i-shift] = moves[i];
      // The reason we can do this is because objects are stored as references
      // in the array
    }

    for (let i=0; i < shift; i++) {
      moves.pop();
    }

    return moves;
  },
  Game(header, moves, result) {
    return {
      ...header.parse(),
      moves: moves.parse(),
    };
  },
});

function parseRaw(filename) {
  const match = g.match(fs.readFileSync(filename));
  return semantics(match).parse();
}

exports.parseRaw = parseRaw;
