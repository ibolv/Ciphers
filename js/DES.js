
var blockSize = 64;
var charSize = 16;

var IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17,  9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

var IP_REVERS = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9,  49, 17, 57, 25
];

var SHIFT = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var SHIFT_REV = [ 0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];


function textToBinary(text) {
    var outStr = '';
    var char = '';
    for (var i = 0; i < text.length; i++) {
        char += text[i].charCodeAt(0).toString(2) + '';
        while (char.length < charSize) {
            char = '0' + char;
        }
        outStr += char;
        char = '';
    }
    return outStr;
}

function binaryToText(value) {
    var output = "";
    for (var i = 0; i < value.length / charSize; i++) {
        var char = value.substring(i * charSize, (i + 1) * charSize);
        output += String.fromCharCode(parseInt(char, 2));
    }
    return output;
}

//добавляем символы, чтобы разделить на блоки по 64bit
function addChar(text) {
    while ((text.length * charSize) % blockSize != 0) {
        text += '#';
    }
    return text;
}

function addCharKey(key, lengthKey) {
    if (key.length > lengthKey) {
        key = key.substr(0, lengthKey);
    } else {
        while (key.length < lengthKey) {
            key = '0' + key;
        }
    }
    return key;
}

//делим на блоки по 64bit
function getBlocks(text) {
    var block = [];
    var lengthBlock = text.length/blockSize;
    for (var i = 0; i < lengthBlock; i++) {
        block[i] = text.substr(i * blockSize, blockSize);
    }
    return block;
}

//подстановка в таблицу
function tablePerm(block, table) {
    var newBlock = '';
    for (var i = 0; i < table.length; i++) {
        newBlock += block[table[i] - 1];
    }
    return newBlock;
}

function XOR(string1, string2){
    var result = '';
    for (var i = 0; i < string1.length; i++) {
        var a = parseInt(string1[i]);
        var b = parseInt(string2[i]);
        if (a ^ b) {
            result += '1';
        } else {
            result += '0'
        }
    }
    return result;
}

function keyNext(key, num) {
    for (var i = 0; i < SHIFT[num]; i++) {
        key = key + key[0];
        key = key.slice(1);
    }
    return key;
}

function keyPrev(key, num) {
    for (var i = 0; i < SHIFT_REV[num]; i++) {
        key = key[key.length - 1] + key;
        key = key.slice(0, key.length - 1);
    }
    return key;
}

function F(str1, str2) {
    return XOR(str1, str2);
}

function encodeRound(text, key) {
    var left = text.substr(0, text.length/2);
    var right = text.substr(text.length/2, text.length/2);
    return (right + XOR(left, F(right, key)));
}

function decodeRound(text, key) {
    var left = text.substr(0, text.length/2);
    var right = text.substr(text.length/2, text.length/2);
    return (XOR(F(left, key), right) + left);
}


function encode(text, key) {
    text = addChar(text);
    text = textToBinary(text);
    key = textToBinary(key);
    key = addCharKey(key, 56);
    var textBlock = getBlocks(text);
    var newTextBlock = [];
    for (var i = 0; i < textBlock.length; i++) {
        newTextBlock[i] = tablePerm(textBlock[i], IP);
    }
    for (var i = 0; i < 16; i++) {
        key = keyNext(key, i);
        for (var j = 0; j < newTextBlock.length; j++) {
            newTextBlock[j] = encodeRound(newTextBlock[j], key);
        }
    }
    
    key = keyPrev(key, 0);
    for (var i = 0; i < newTextBlock.length; i++) {
        newTextBlock[i] = tablePerm(newTextBlock[i], IP_REVERS);
    }
    var result = '';
    for (var i = 0; i < newTextBlock.length; i++) {
        result += newTextBlock[i];
    }
    result = binaryToText(result);
    return {newTextBlock : newTextBlock, key:key, result:result};
}


function decode(key, arr) {
    var newTextBlock = arr;
    for (var i = 0; i < newTextBlock.length; i++) {
        newTextBlock[i] = tablePerm(newTextBlock[i], IP);
    }
    for (var i = 0; i < 16; i++) {
        key = keyPrev(key, i);
        for (var j = 0; j < newTextBlock.length; j++) {
            newTextBlock[j] = decodeRound(newTextBlock[j], key);
        }
    }
    for (var i = 0; i < newTextBlock.length; i++) {
        newTextBlock[i] = tablePerm(newTextBlock[i], IP_REVERS);
    }
    var result = '';
    for (var i = 0; i < newTextBlock.length; i++) {
        result += newTextBlock[i];
    }
    result = binaryToText(result);
    return result;

}

function DES() {
    var text = document.getElementById('inputAreaTextDES').value;
    var key = document.getElementById('inputAreaKeyDES').value;
    var outputAreaDES = document.getElementById('outputAreaDES');
    var select = document.getElementById('actionDES');
    if (select.selectedIndex == 1) {
        window.keyForDecode = encode(text, key).key;
        window.arr = encode(text, key).newTextBlock;
        outputAreaDES.value = encode(text, key).result;
     }
    if (select.selectedIndex == 2) {
        outputAreaDES.value = decode(keyForDecode, arr);
    }

}




