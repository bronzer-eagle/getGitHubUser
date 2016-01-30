var flagSelect = false;
var text = [];
var td = document.getElementById("responseTable").getElementsByTagName('td');
var form = document.getElementById('formData');
var select = document.getElementsByTagName('select')[0];

form.addEventListener("submit", function (event) {
    sendInputValues();
    event.preventDefault();
});

function selectedValue() {
    if (flagSelect) {
        if (select.options[1].selected) {
            for (var j = 0; j < text.length; j++) {
                td[j + 2].innerHTML = '';
                if ((j % 2) == 0) {
                    for (var i = 0; i < text[j].length; i++) {
                        td[j + 2].innerHTML += text[j][i] + '<br>';
                    }
                }
                else {
                    for (i = 0; i < text[j].length; i++) {
                        td[j + 2].innerHTML += text[j][i] + '<br>';
                    }
                }
            }
        }
        else if (select.options[2].selected) {
            for (i = 0; i < text.length; i++) {
                var clone = [];
                for (var key in text[i]) {
                    clone[key] = text[i][key];
                }                
                text[i].repeats = countRepeats(clone, 0, []);                
                var maxV = text[i].repeats[0][0];
                var maxI = 0;
                for (j = 0; j < text[i].repeats.length; j++) {
                    if (maxV < text[i].repeats[0][j + 1]) {
                        maxV = text[i].repeats[0][j + 1];
                        maxI = j + 1;
                    }
                }
                if ((i % 2) == 0) {
                    td[i + 2].innerHTML = text[i].repeats[1][maxI] + '<br>';
                }
                else {
                    td[i + 2].innerHTML = text[i].repeats[1][maxI] + '<br>';
                }
            }

        }
    } else {
        event.preventDefault();
    }
}

function countRepeats(value, i, length) {
    if (i >= value.length) {
        return [length, value];
    }
    else {
        var current = value[i];
        var amount = [];
        for (var k = 0; k < value.length; k++) {
            if (current == value[k]) {
                amount.push(k);
            }
        }
        length.push(amount.length);

        k = 1;
        for (var j = amount[1]; j < value.length; j++) {

            if (j == amount[k]) {

                value.splice(j, 1);
            }
            k++;
        }
        i++;
        return countRepeats(value, i, length);
    }
}

function createNewinput() {
    var flag = true;
    var inputs = document.getElementsByClassName('address');

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            flag = false;
        }
        else {
            flag = true;
        }
    }

    if (flag) {
        var table = document.getElementById("addressTable");
        var row = table.insertRow(inputs.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var input = document.createElement("input");

        cell1.className = 'number';
        cell1.innerHTML = inputs.length + 1;

        input.name = 'address';
        input.type = 'url';
        input.placeholder = 'Enter the address';
        input.onblur = createNewinput;
        input.className = 'address';

        cell2.appendChild(input);
    }
}

function sendInputValues() {
    var data = $('#formData').serializeArray();    
    var xhr = new XMLHttpRequest();
    var json = JSON.stringify(data);

    xhr.open("POST", 'server.js', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    /*xhr.upload.onprogress = function(event) {

     };*/
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            makeResponse(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(json);
}

function makeResponse(data) {
    var table = document.getElementById("responseTable");

    for (var i = 0; i < data.length; i++) {

        var newData = data[i].split('|||');
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        for (var j = 0; j < newData.length - 1; j++) {
            if ((j % 2) == 0) {
                cell1.innerHTML += newData[j] + '<br>';
            }
            else if (j == 1) {
                var str = newData[j].split('');
                str.splice(0, 1);
                newData[j] = null;
                newData[j] = str.join('');
                cell2.innerHTML += newData[j] + '<br>';
            }
            else {
                cell2.innerHTML += newData[j] + '<br>';
            }
        }
    }
    flagSelect = true;
    divideText();
}

function divideText() {
    for (var i = 2; i < td.length; i++) {
        text[i - 2] = td[i].innerHTML.split('<br>');
        for (var j = 0; j < text[i - 2].length; j++) {
            if (text[i - 2][j][0] == '\n' || text[i - 2][j][0] == ' ') {
                var newText = text[i - 2][j].split('');
                newText.splice(0, 1);
                newText = newText.join('');
                text[i - 2][j] = newText;
            }
        }
        text[i - 2].splice(-1, 1);
    }

}
