const path = require('path');
const events = require('./events');
const { readAll } = require('./utils');

class Layouts {
    path = path.join(process.env.RESOURCES_PATH, 'layouts');
    default = {
        en: {
            "backquote": {
                "default": "`",
                "caps": "`",
                "shift": "`"
            },
            "1": {
                "default": "1",
                "shift": "!"
            },
            "2": {
                "default": "2",
                "shift": "@"
            },
            "3": {
                "default": "3",
                "shift": "#"
            },
            "4": {
                "default": "4",
                "shift": "$"
            },
            "5": {
                "default": "5",
                "shift": "%"
            },
            "6": {
                "default": "6",
                "shift": "^"
            },
            "7": {
                "default": "7",
                "shift": "&"
            },
            "8": {
                "default": "8",
                "shift": "*"
            },
            "9": {
                "default": "9",
                "shift": "("
            },
            "0": {
                "default": "0",
                "shift": ")"
            },
            "-": {
                "default": "-",
                "shift": "_"
            },
            "=": {
                "default": "=",
                "shift": "+"
            },
            "q": {
                "default": "q",
                "caps": "Q",
                "shift": "Q"
            },
            "w": {
                "default": "w",
                "caps": "W",
                "shift": "W"
            },
            "e": {
                "default": "e",
                "caps": "E",
                "shift": "E"
            },
            "r": {
                "default": "r",
                "caps": "R",
                "shift": "R"
            },
            "t": {
                "default": "t",
                "caps": "T",
                "shift": "T"
            },
            "y": {
                "default": "y",
                "caps": "Y",
                "shift": "Y"
            },
            "u": {
                "default": "u",
                "caps": "U",
                "shift": "U"
            },
            "i": {
                "default": "i",
                "caps": "I",
                "shift": "I"
            },
            "o": {
                "default": "o",
                "caps": "O",
                "shift": "O"
            },
            "p": {
                "default": "p",
                "caps": "P",
                "shift": "P"
            },
            "[": {
                "default": "[",
                "shift": "{"
            },
            "]": {
                "default": "]",
                "shift": "}"
            },
            "\\": {
                "default": "\\",
                "shift": "|"
            },
            "a": {
                "default": "a",
                "caps": "A",
                "shift": "A"
            },
            "s": {
                "default": "s",
                "caps": "S",
                "shift": "S"
            },
            "d": {
                "default": "d",
                "caps": "D",
                "shift": "D"
            },
            "f": {
                "default": "f",
                "caps": "F",
                "shift": "F"
            },
            "g": {
                "default": "g",
                "caps": "G",
                "shift": "G"
            },
            "h": {
                "default": "h",
                "caps": "H",
                "shift": "H"
            },
            "j": {
                "default": "j",
                "caps": "J",
                "shift": "J"
            },
            "k": {
                "default": "k",
                "caps": "K",
                "shift": "K"
            },
            "l": {
                "default": "l",
                "caps": "L",
                "shift": "L"
            },
            ";": {
                "default": ";",
                "shift": ":"
            },
            "'": {
                "default": "'",
                "shift": "\""
            },
            "z": {
                "default": "z",
                "caps": "Z",
                "shift": "Z"
            },
            "x": {
                "default": "x",
                "caps": "X",
                "shift": "X"
            },
            "c": {
                "default": "c",
                "caps": "C",
                "shift": "C"
            },
            "v": {
                "default": "v",
                "caps": "V",
                "shift": "V"
            },
            "b": {
                "default": "b",
                "caps": "B",
                "shift": "B"
            },
            "n": {
                "default": "n",
                "caps": "N",
                "shift": "N"
            },
            "m": {
                "default": "m",
                "caps": "M",
                "shift": "M"
            },
            ",": {
                "default": ",",
                "shift": "<"
            },
            ".": {
                "default": ".",
                "shift": ">"
            },
            "/": {
                "default": "/",
                "shift": "?"
            }
        },
        ru: {
            "backquote": {
                "default": "ё",
                "caps": "Ё",
                "shift": "Ё"
            },
            "1": {
                "default": "1",
                "shift": "!"
            },
            "2": {
                "default": "2",
                "shift": "\""
            },
            "3": {
                "default": "3",
                "shift": "№"
            },
            "4": {
                "default": "4",
                "shift": ";"
            },
            "5": {
                "default": "5",
                "shift": "%"
            },
            "6": {
                "default": "6",
                "shift": ":"
            },
            "7": {
                "default": "7",
                "shift": "?"
            },
            "8": {
                "default": "8",
                "shift": "*"
            },
            "9": {
                "default": "9",
                "shift": "("
            },
            "0": {
                "default": "0",
                "shift": ")"
            },
            "-": {
                "default": "-",
                "shift": "_"
            },
            "=": {
                "default": "=",
                "shift": "+"
            },
            "q": {
                "default": "й",
                "caps": "Й",
                "shift": "Й"
            },
            "w": {
                "default": "ц",
                "caps": "Ц",
                "shift": "Ц"
            },
            "e": {
                "default": "у",
                "caps": "У",
                "shift": "У"
            },
            "r": {
                "default": "к",
                "caps": "К",
                "shift": "К"
            },
            "t": {
                "default": "е",
                "caps": "Е",
                "shift": "Е"
            },
            "y": {
                "default": "н",
                "caps": "Н",
                "shift": "Н"
            },
            "u": {
                "default": "г",
                "caps": "Г",
                "shift": "Г"
            },
            "i": {
                "default": "ш",
                "caps": "Ш",
                "shift": "Ш"
            },
            "o": {
                "default": "щ",
                "caps": "Щ",
                "shift": "Щ"
            },
            "p": {
                "default": "з",
                "caps": "З",
                "shift": "З"
            },
            "[": {
                "default": "х",
                "caps": "Х",
                "shift": "Х"
            },
            "]": {
                "default": "ъ",
                "caps": "Ъ",
                "shift": "Ъ"
            },
            "\\": {
                "default": "\\",
                "shift": "/"
            },
            "a": {
                "default": "ф",
                "caps": "Ф",
                "shift": "Ф"
            },
            "s": {
                "default": "ы",
                "caps": "Ы",
                "shift": "Ы"
            },
            "d": {
                "default": "в",
                "caps": "В",
                "shift": "В"
            },
            "f": {
                "default": "а",
                "caps": "А",
                "shift": "А"
            },
            "g": {
                "default": "п",
                "caps": "П",
                "shift": "П"
            },
            "h": {
                "default": "р",
                "caps": "Р",
                "shift": "Р"
            },
            "j": {
                "default": "о",
                "caps": "О",
                "shift": "О"
            },
            "k": {
                "default": "л",
                "caps": "Л",
                "shift": "Л"
            },
            "l": {
                "default": "д",
                "caps": "Д",
                "shift": "Д"
            },
            ";": {
                "default": "ж",
                "caps": "Ж",
                "shift": "Ж"
            },
            "'": {
                "default": "э",
                "caps": "Э",
                "shift": "Э"
            },
            "z": {
                "default": "я",
                "caps": "Я",
                "shift": "Я"
            },
            "x": {
                "default": "ч",
                "caps": "Ч",
                "shift": "Ч"
            },
            "c": {
                "default": "с",
                "caps": "С",
                "shift": "С"
            },
            "v": {
                "default": "м",
                "caps": "М",
                "shift": "М"
            },
            "b": {
                "default": "и",
                "caps": "И",
                "shift": "И"
            },
            "n": {
                "default": "т",
                "caps": "Т",
                "shift": "Т"
            },
            "m": {
                "default": "ь",
                "caps": "Ь",
                "shift": "Ь"
            },
            ",": {
                "default": "б",
                "caps": "Б",
                "shift": "Б"
            },
            ".": {
                "default": "ю",
                "caps": "Ю",
                "shift": "Ю"
            },
            "/": {
                "default": ".",
                "shift": ","
            }
        },
        uk: {
            "backquote": {
                "default": "'",
                "shift": "₴"
            },
            "1": {
                "default": "1",
                "shift": "!"
            },
            "2": {
                "default": "2",
                "shift": "\""
            },
            "3": {
                "default": "3",
                "shift": "№"
            },
            "4": {
                "default": "4",
                "shift": ";"
            },
            "5": {
                "default": "5",
                "shift": "%"
            },
            "6": {
                "default": "6",
                "shift": ":"
            },
            "7": {
                "default": "7",
                "shift": "?"
            },
            "8": {
                "default": "8",
                "shift": "*"
            },
            "9": {
                "default": "9",
                "shift": "("
            },
            "0": {
                "default": "0",
                "shift": ")"
            },
            "-": {
                "default": "-",
                "shift": "_"
            },
            "=": {
                "default": "=",
                "shift": "+"
            },
            "q": {
                "default": "й",
                "caps": "Й",
                "shift": "Й"
            },
            "w": {
                "default": "ц",
                "caps": "Ц",
                "shift": "Ц"
            },
            "e": {
                "default": "у",
                "caps": "У",
                "shift": "У"
            },
            "r": {
                "default": "к",
                "caps": "К",
                "shift": "К"
            },
            "t": {
                "default": "е",
                "caps": "Е",
                "shift": "Е"
            },
            "y": {
                "default": "н",
                "caps": "Н",
                "shift": "Н"
            },
            "u": {
                "default": "г",
                "caps": "Г",
                "shift": "Г"
            },
            "i": {
                "default": "ш",
                "caps": "Ш",
                "shift": "Ш"
            },
            "o": {
                "default": "щ",
                "caps": "Щ",
                "shift": "Щ"
            },
            "p": {
                "default": "з",
                "caps": "З",
                "shift": "З"
            },
            "[": {
                "default": "х",
                "caps": "Х",
                "shift": "Х"
            },
            "]": {
                "default": "ї",
                "caps": "Ї",
                "shift": "Ї"
            },
            "\\": {
                "default": "\\",
                "shift": "/"
            },
            "a": {
                "default": "ф",
                "caps": "Ф",
                "shift": "Ф"
            },
            "s": {
                "default": "і",
                "caps": "І",
                "shift": "І"
            },
            "d": {
                "default": "в",
                "caps": "В",
                "shift": "В"
            },
            "f": {
                "default": "а",
                "caps": "А",
                "shift": "А"
            },
            "g": {
                "default": "п",
                "caps": "П",
                "shift": "П"
            },
            "h": {
                "default": "р",
                "caps": "Р",
                "shift": "Р"
            },
            "j": {
                "default": "о",
                "caps": "О",
                "shift": "О"
            },
            "k": {
                "default": "л",
                "caps": "Л",
                "shift": "Л"
            },
            "l": {
                "default": "д",
                "caps": "Д",
                "shift": "Д"
            },
            ";": {
                "default": "ж",
                "caps": "Ж",
                "shift": "Ж"
            },
            "'": {
                "default": "є",
                "caps": "Є",
                "shift": "Є"
            },
            "z": {
                "default": "я",
                "caps": "Я",
                "shift": "Я"
            },
            "x": {
                "default": "ч",
                "caps": "Ч",
                "shift": "Ч"
            },
            "c": {
                "default": "с",
                "caps": "С",
                "shift": "С"
            },
            "v": {
                "default": "м",
                "caps": "М",
                "shift": "М"
            },
            "b": {
                "default": "и",
                "caps": "И",
                "shift": "И"
            },
            "n": {
                "default": "т",
                "caps": "Т",
                "shift": "Т"
            },
            "m": {
                "default": "ь",
                "caps": "Ь",
                "shift": "Ь"
            },
            ",": {
                "default": "б",
                "caps": "Б",
                "shift": "Б"
            },
            ".": {
                "default": "ю",
                "caps": "Ю",
                "shift": "Ю"
            },
            "/": {
                "default": ".",
                "shift": ","
            }
        }
    }

    async get() {
        return await events.wait('layouts:get', readAll(this.path, this.default));
    }
}

module.exports = new Layouts();