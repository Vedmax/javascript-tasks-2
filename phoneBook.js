'use strict';

var phoneBook = []; // здесь вы храните записи как хотите

/*
   функция добавления записи в телефонную книгу.
   на вход может прийти что угодно, будьте осторожны.
*/

function isValidData(name, phone, email) {
    if (!(/^[а-яёa-z0-9 ]+$/i).test(name)) {
        return false;
    }
    if (!(/^(\+?[\d]{0,3}[\- ]?)?((\((?=\d{3}\))\d{3}\)|\d{3})[\- ]?)+[\d\- ]{7,10}$/)
            .test(phone)) {
        return false;
    }
    return ((/^[-\w.]+@([а-яёa-z0-9][-а-яёa-z0-9]+\.)+[а-яёa-z0-9]{2,4}$/i).test(email));
}

module.exports.add = function add(name, phone, email) {
    if (!isValidData(name, phone, email)) {
        return false;
    }
    var person = {name: name, phone: phone, email: email};
    phoneBook.push(person);
    return true;
};

/*
   функция поиска записи в телефонную книгу.
   поиск ведется по всем полям.
*/

function getInfo(person) {
    var info = '';
    for (var key in person) {
        info = info.concat(person[key], ', ');
    }
    info = info.replace(/, $/, '');
    return info;
}

module.exports.find = function find(query) {
    var matches = 'найдено:\n';
    for (var id in phoneBook) {
        var person = phoneBook[id];
        for (var key in person) {
            if (person[key].indexOf(query) != -1) {
                matches = matches.concat(getInfo(person), '\n');
                break;
            }
        }
    }
    console.log(matches);
};

/*
   функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    var newPhoneBook = [];
    for (var id in phoneBook) {
        var person = phoneBook[id];
        for (var key in person) {
            var needToDelete = false;
            if (person[key].indexOf(query) != -1) {
                needToDelete = true;
                break;
            }
        }
        if (!needToDelete) {
            newPhoneBook.push(person);
        }
    }
    console.log('Удалено контактов:', phoneBook.length - newPhoneBook.length, '\n');
    phoneBook = newPhoneBook;
};

/*
   функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var countAdds = 0;
    var data = require('fs').readFileSync(filename, 'utf-8').split('\r\n');
    for (var i in data) {
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
    for (var i = 0; i < (len % 2 != 0 ? indent + 1 : indent); i++) {
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

    for (var id in phoneBook) {
        var person = phoneBook[id];
        console.log('├──────────────╫──────────────╫──────────────┤');
        var name = parse(person['name']);
        var phone = parse(person['phone']);
        var email = parse(person['email']);
        console.log('│' + name + '║' + phone + '║' + email + '│');
    }
    console.log('└──────────────╨──────────────╨──────────────┘\n');
};
