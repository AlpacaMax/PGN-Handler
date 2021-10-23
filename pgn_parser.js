const fs = require('fs');
const ohm = require('ohm-js');
const g = ohm.grammar(fs.readFileSync('pgn_grammar.ohm'));

const semantics = g.createSemantics().addOperation('parse', {
    _terminal() {
        return this.sourceString;
    },
    _iter(...children) {
        return children.map(c => c.parse());
    },      
    string(l, str, r) {
        str = str.sourceString;
        return str.replaceAll("\\\\", "\\").replaceAll("\\\"", "\"");
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
    fourDigitNum(a, b, c, d){
        return a.sourceString
             + b.sourceString
             + c.sourceString
             + d.sourceString;
    },
    number(n) {
        return n.sourceString==="?" || n.sourceString==="-" 
               ? null : parseInt(n.sourceString, 10);
    },
    date(year, a, month, b, day) {
        return {
            Year: year.parse(),
            Month: month.parse(),
            Day: day.parse(),
        };
    },
    time(hour, a, minute, b, second) {
        return {
            Hour: hour.parse(),
            Minute: minute.parse(),
            Second: second.parse(),
        };
    },
    roundNums(list) {
        return list.sourceString==="-" || list.sourceString==="?"
               ? null : list.asIteration().parse();
    },
    result(r){
        switch (r.sourceString) {
            case "1-0": return "White wins";
            case "0-1": return "Black wins";
            case "1/2-1/2": return "Draw";
            case "*": return null;
        }
    },
    square(file, rank) {
        return {
            File: file.sourceString,
            Rank: rank.sourceString
        };
    },
    piece(p) {
        p = p.parse();
        return typeof(p)==="object" ? "P" : p;
    },
    normalMove(piece, destSquare) {
        return {
            // mate, check,long_castle, short_castle, promotion, takes
            type: 0b0,
            Piece: piece.parse(),
            From: {
                File: null,
                Rank: null,
            },
            To: destSquare.parse(),
        };
    },
    specificMove(piece, startFile, startRank, takes, destSquare) {
        startFile = startFile.parse();
        startRank = startRank.parse();
        takes = takes.parse();

        return {
            type: takes.length===0 ? 0b0 : 0b1,
            Piece: piece.parse(),
            From: {
                File: startFile.length===0 ? null : startFile[0],
                Rank: startRank.length===0 ? null : startRank[0],
            },
            To: destSquare.parse(),
        };
    },
    promotion(move, equals, piece) {
        const result = move.parse();
        result.type |= 0b10;
        result.Promotion = piece.parse();
        return result;
    },
    castle(move) {
        return {
            type: move.parse()==="O-O" ? 0b100 : 0b1000
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

        if (checkOrMateParsed[0] === "+") {
            moveParsed.type |= 0b10000;
        } else if (checkOrMateParsed[0] === "#") {
            moveParsed.type |= 0b100000;
        }

        moveParsed.SuffixParsed = suffixParsed.length===0 ? null : suffixParsed[0];
        moveParsed.SAN = this.sourceString;

        return moveParsed;
    },
    movesTimePair(numMoves, _, time) {
        return {
            NumMoves: parseInt(numMoves.sourceString, 10),
            Time: parseInt(time.sourceString, 10),
        };
    },
    Header(list) {
        return {
            Header: Object.fromEntries(list.asIteration().parse())
        };
    },
    Tag(l, sym, str, r) {
        const tag = sym.parse();
        const content = str.parse();
        return [tag, content==='?' || content=='-' ? null : content];
    },
    Rav(l, firstRound, moves, r) {
        const firstRoundParsed = firstRound.parse();
        const movesParsed = moves.parse();

        if (firstRoundParsed.length > 0) {
            movesParsed.splice(0, 0, firstRoundParsed[0]);
        }

        return movesParsed;
    },
    Move(san, comment, rav) {
        const sanParsed = san.parse();
        const commentParsed = comment.parse();
        const ravParsed = rav.parse();

        if (commentParsed.length > 0) sanParsed.Comment = commentParsed[0];
        if (ravParsed.length > 0) sanParsed.RAV = ravParsed[0];

        return sanParsed;
    },
    Round(moveNum, whiteMove, blackMove) {
        return {
            move: moveNum.parse(),
            white: whiteMove.parse(),
            black: blackMove.parse(),
        };
    },
    FirstRound(moveNum, whiteMove, blackMove) {
        const white = whiteMove.parse();
        const black = blackMove.parse();
        return {
            move: moveNum.parse(),
            white: white==="..." ? null : white,
            black: black,
        };
    },
    LastRound(moveNum, whiteMove) {
        const white = whiteMove.parse();
        return {
            move: moveNum.parse(),
            white: white,
            black: null,
        };
    },
    Moves(list, lastSan) {
        const moves = list.asIteration().parse();
        lastSan = lastSan.parse();
        if (lastSan.length > 0) moves.push(lastSan[0]);
        return moves;
    },
    Game(header, moves, result) {
        return {
            ...header.parse(),
            Moves: moves.parse(),
        };
    },
});

function parse(filename) {
    let match = g.match(fs.readFileSync(filename));
    return semantics(match).parse();
}

exports.parse = parse;