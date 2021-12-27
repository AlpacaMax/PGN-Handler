# PGN-Handler
`PGN-Handler` is a package containing a collection of functions for handling `PGN` files, aka **P**ortable **G**ame **N**otaion, including a parser, modification functions, and validation function.

# Development Progress
This project is still under development. Currently it only has a parser, a validation function, and some modifier functions for the parsed result, the last two types of functions are essentially wrapper functions for chess.js.

# API
## parseRaw(filename)
`parseRaw(filename)` takes a PGN filename and parse the file. It returns the raw output from the parser.

``` js
> console.log(JSON.stringify(parseRaw('test_pgns/test_legal_moves.pgn'), null, 2));
{
  "header": {
    "event": "F/S Return Match",
    "site": "Belgrade, Serbia JUG",
    "date": {
      "year": "1992",
      "month": "11",
      "day": "04"
    },
    "round": null,
    "white": "Fischer, Robert J.",
    "black": "Spassky, Boris V.",
    "result": "Draw"
  },
  "moves": [
    {
      "move": 1,
      "white": {
        "type": 1,
        "piece": "P",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "e",
          "rank": "4"
        },
        "suffixParsed": null,
        "san": "e4"
      },
      "black": {
        "type": 1,
        "piece": "P",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "e",
          "rank": "5"
        },
        "suffixParsed": null,
        "san": "e5",
        "rav": [
          {
            "move": 1,
            "white": null,
            "black": {
              "type": 1,
              "piece": "P",
              "from": {
                "file": null,
                "rank": null
              },
              "to": {
                "file": "c",
                "rank": "4"
              },
              "suffixParsed": null,
              "san": "c4"
            }
          }
        ]
      }
    },
    {
      "move": 2,
      "white": {
        "type": 1,
        "piece": "N",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "f",
          "rank": "3"
        },
        "suffixParsed": null,
        "san": "Nf3"
      },
      "black": null
    }
  ]
}
```
*This PGN file is in this repo*

## parse(filename)
`parse(filename)` is a wrapper function of `parseRaw(filename)`. In addition to what `parseRaw(filename)` can do, `parse(filename)`:
- Labels if the current move is legal or not. If it's not then the following moves will not get labeled
- Fills in the starting position of each move(fills in `from`)
- Add current FEN after each move
- Judge the result of game and correct the result in header if necessary

``` js
> console.log(JSON.stringify(parse('test_pgns/test_legal_moves.pgn'), null, 2));
{
  "header": {
    "event": "F/S Return Match",
    "site": "Belgrade, Serbia JUG",
    "date": {
      "year": "1992",
      "month": "11",
      "day": "04"
    },
    "round": null,
    "white": "Fischer, Robert J.",
    "black": "Spassky, Boris V.",
    "result": "Draw"
  },
  "moves": [
    {
      "move": 1,
      "white": {
        "type": 1,
        "piece": "P",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "e",
          "rank": "4"
        },
        "suffixParsed": null,
        "san": "e4",
        "legalMove": true,
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
      },
      "black": {
        "type": 1,
        "piece": "P",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "e",
          "rank": "5"
        },
        "suffixParsed": null,
        "san": "e5",
        "rav": [
          {
            "move": 1,
            "white": null,
            "black": {
              "type": 1,
              "piece": "P",
              "from": {
                "file": null,
                "rank": null
              },
              "to": {
                "file": "c",
                "rank": "4"
              },
              "suffixParsed": null,
              "san": "c4",
              "legalMove": false
            }
          }
        ],
        "legalMove": true,
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
      }
    },
    {
      "move": 2,
      "white": {
        "type": 1,
        "piece": "N",
        "from": {
          "file": null,
          "rank": null
        },
        "to": {
          "file": "f",
          "rank": "3"
        },
        "suffixParsed": null,
        "san": "Nf3",
        "legalMove": true,
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
      },
      "black": null
    }
  ],
  "resultOnBoard": "Unfinished"
}
```

# Contributing
Please run `npx eslint changed_file.js` before commiting
