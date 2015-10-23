'use strict';

var phoneBook = []; // здесь вы храните записи как хотите

/*
   функция добавления записи в телефонную книгу.
   на вход может прийти что угодно, будьте осторожны.
*/

function isValidName(name) {
    if (name && typeof name === 'string') {
        return true;
    }
    console.log('Name', name, 'is not valid');
    return false;
}

function isValidPhone(phone) {
    var reg = new RegExp('^(\\+(?=\\d{1,3})\\d{1,3}|\\d{1,3})?[\\- ]?' +
        '((\\((?=\\d{3}\\))\\d{3}\\)|\\d{3})[\\- ]?)+[\\d\\- ]{0,7}$');
    if (!phone || typeof phone !== 'string' || !reg.test(phone)) {
        console.log('Phone', phone, 'is not valid');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    if (!email || typeof email !== 'string' || !(/^[^@]+@[^@]+\.[^@.]+$/i).test(email)) {
        console.log('Email', email, 'is not valid');
        return false;
    }
    return true;
}

module.exports.add = function add(name, phone, email) {
    if (arguments.length < 3) {
        return false;
    }
    if (!isValidName(name) || !isValidPhone(phone) || !isValidEmail(email)) {
        return false;
    }
    phoneBook.push({name: name, phone: phone, email: email});
    console.log('Запись добавлена ', name);
    return true;
};

/*
   функция поиска записи в телефонную книгу.
   поиск ведется по всем полям.
*/

function getInfo(person) {
    return [person.name, person.phone, person.email].join(', ');
}


function search(query, equal) {
    var eq = [];
    var nonEq = [];
    for (var id = 0; id < phoneBook.length; id++) {
        var person = phoneBook[id];
        var isEqu = false;
        for (var key in person) {
            if (person[key].indexOf(query) !== -1) {
                eq.push(person);
                isEqu = true;
            }
        }
        if (!isEqu) {
            nonEq.push(person);
        }
    }
    return equal ? eq : nonEq;
}

module.exports.find = function find(query) {
    var matches = ['найдено:'];
    var found = search(query, true);
    for (var i = 0; i < found.length; i++) {
        matches.push(getInfo(found[i]));
    }
    console.log(matches.join('\n'));
};

/*
   функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    var newPhoneBook = search(query, false);
    console.log('Удалено контактов:', phoneBook.length - newPhoneBook.length, '\n');
    phoneBook = newPhoneBook;
};

/*
   функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var countAdds = 0;
    try {
        var data = require('fs').readFileSync(filename, 'utf-8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return;
    }
    data = data.split('\n');
    for (var i = 0; i < data.length; i++) {
        if (data[i] === '') {
            continue;
        }
        var entry = data[i].split(';');
        if (module.exports.add(entry[0], entry[1], entry[2])) {
            countAdds++;
        }
    }
    console.log('Добавлено записей:', countAdds, '\n');
    // ваша чёрная магия:
    // - разбираете записи из `data`
    // - добавляете каждую запись в книгу
};

/*
   функция вывода всех телефонов в виде ascii (задача со звёздочкой!).
*/
function parse(str) {
    var indent = Math.floor((24 - str.length) / 2);
    var len = str.length;
    for (var i = 0; i < (len % 2 !== 0 ? indent + 1 : indent); i++) {
        str = (' ').concat(str);
    }
    for (var i = 0; i < indent; i++) {
        str = str.concat(' ');
    }
    return str;
}

module.exports.showTable = function showTable() {
    console.log('┌──────────────╥──────────────╥──────────────┐');
    console.log('│          Name          ║         Phone          ║         Email          │');

    for (var id = 0; id < phoneBook.length; id++) {
        var person = phoneBook[id];
        console.log('├──────────────╫──────────────╫──────────────┤');
        var name = parse(person['name']);
        var phone = parse(person['phone']);
        var email = parse(person['email']);
        console.log('│' + name + '║' + phone + '║' + email + '│');
    }
    console.log('└──────────────╨──────────────╨──────────────┘\n');
};
