var sizeBlock = 256;
var S = [];
var x = 0;
var y = 0;

function swap(arr, ind1, ind2) {
    var temp = arr[ind1];
    arr[ind1] = arr[ind2];
    arr[ind2] = temp;
    return arr;
}
function keyInit(key) {
    for (var i = 0; i < sizeBlock; i++) {
        S[i] = i;
    }

    var j = 0;
    for (var i = 0; i < sizeBlock; i++) {
        j = (j + S[i] + key.charCodeAt(i % key.length)) % sizeBlock;
        swap(S,i,j);
    }
}

function keyItem() {
    x = (x + 1) % sizeBlock;
    y = (y + S[x]) % sizeBlock;
    swap(S, x, y);
    return S[(S[x] + S[y]) % sizeBlock];
}

function Encode(text) {
    var result = '';
    for (var k = 0; k < text.length; k++) {
        result += String.fromCharCode(text.charCodeAt(k) ^ keyItem());
        //arr[k] = text.charCodeAt(k) ^ keyItem();
    }
    return result;
}

function Decode(text) {
    return Encode(text);
}

function normalForm(value) {
    for (var m = 0; m < value.length; m++) {
        value[m] = value[m].charCodeAt(0);
    }
    return value;
}

function rc4() {
    y = 0;
    x = 0;
    var text = document.getElementById('inputAreaTextrc4').value;
    var key = document.getElementById('inputAreaKeyrc4').value;
    var outputArearc4 = document.getElementById('outputArearc4');
    keyInit(key);
    outputArearc4.value = Encode(text);
    

}