const defaultAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


function getKeyRepeat(key, letters) {
    var p = key;
    while (p.length < letters.length) {
        p = p + key;
    }
    return p.substr(0, letters.length);
}


function Encrypt(keyRepeat, letters) {
    var encText = '';
    for (var i = 0; i < letters.length; i++) {
        var letterIndex = defaultAlphabet.indexOf(letters[i]);
        var keyIndex = defaultAlphabet.indexOf(keyRepeat[i]);
        encText = encText + defaultAlphabet[(letterIndex + keyIndex) % defaultAlphabet.length];
    }

    return encText;
}

function Decrypt(keyRepeat, encText) {
    var decText = '';
    for (var i = 0; i < encText.length; i++) {
        var decTextIndex = defaultAlphabet.indexOf(encText[i]);
        var keyIndex = defaultAlphabet.indexOf(keyRepeat[i]);
        decText = decText + defaultAlphabet[(decTextIndex - keyIndex + defaultAlphabet.length) % defaultAlphabet.length]
    }
    return decText;
}

function Vigenere() {
    var key = document.getElementById('inputAreaKey').value.toUpperCase();
    var letters = document.getElementById('inputAreaLetters').value.toUpperCase();
    var keyRepeat = getKeyRepeat(key, letters);
    var outputArea = document.getElementById('outputArea');
    var select = document.getElementById('action');
    if (select.selectedIndex == 1) {
        outputArea.value = Encrypt(keyRepeat, letters);
    }
    if (select.selectedIndex == 2) {
        outputArea.value =  Decrypt(keyRepeat, letters);
    }
}






