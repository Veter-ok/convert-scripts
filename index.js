var start_cmd = new Map([
    ['python', ''],
    ['javascript', ''],
    ['c#', "using System;\n\nnamespace MyProgram\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n"],
    ['c++', '#include <iostream> \n#include < cstdlib > \nusing namespace std; \n\nint main()\n{']
]);
var last_cmd = new Map([
    ['python', ''],
    ['c#', '        }\n    }\n}'],
    ['c++', '}']
]);
var python_to_c_cmd_with_braces = new Map([
    ['def', 'function'],
    ['while', 'while'],
    ['for', 'for'],
    ['elif', 'else if'],
    ['if', 'if'],
    ['else', 'else']
]); // map with syntax language
var python_to_csharp_simple_cmd = new Map([
    ['import', 'using'],
    ['print', 'Console.WriteLine'],
    ['break', 'break'],
    ['variable', '']
]);

var python_to_c_for_value_variable = new Map([
    ['input', 'Console.Read()'],
    ['int', 'Convert.ToInt32']
]);

var to_convert = 'python';
var from_convert = 'python';
var num_space = 0;
var brackets = [];

$(function () {
    $("div.select-converter > span").on('click', function () {
        $('div.select-converter > span').attr('class', '');
        $(this).attr('class', 'active');
    });

    $("div.from-convert > span").on('click', function () {
        $('div.from-convert > span').attr('class', '');
        $(this).attr('class', 'active');
        from_convert = $(this).attr('value');
    });

    $("div.to-convert > span").on('click', function () {
        $('div.to-convert > span').attr('class', '');
        $(this).attr('class', 'active');
        to_convert = $(this).attr('value');
    });

    $('.convert-button').on('click', function () { // click on convert button
        num_space = 0; //reset the value
        brackets = []; // reset the value
        $('#my-script').text(); // output new script
        var script = $('#your-script').val(); // remember input script
        var new_script = convertScript(script); // write new script
        $('#my-script').text(new_script); // output new script
    });
})


function convertScript(script) { // function for conver script
    var array = script.split('\n') // split this script on strings
    var new_script = start_cmd.get(to_convert) // script on select language
    index = 1
    array.forEach(element => { // iterate over the script line by string
        if (from_convert == 'python' && to_convert == 'python') {
            new_script += (element + '\n');
        } else if (from_convert == 'python' && to_convert == 'javascript') {
            pass
        } else if (from_convert == 'python' && to_convert == 'c#') {
            new_script += '            ' + searchCommand(element, python_to_c_cmd_with_braces, python_to_csharp_simple_cmd, python_to_c_for_value_variable) + '\n'; // run function for search command in line
        } else if (from_convert == 'python' && to_convert == 'c++') {
            pass
        } else if (from_convert == 'javascript' && to_convert == 'python') {
            pass
        } else if (from_convert == 'javascript' && to_convert == 'javascript') {
            new_script += (element + '\n');
        } else if (from_convert == 'javascript' && to_convert == 'c#') {
            pass
        } else if (from_convert == 'javascript' && to_convert == 'c++') {
            pass
        } else if (from_convert == 'c#' && to_convert == 'python') {
            pass
        } else if (from_convert == 'c#' && to_convert == 'javascript') {
            pass
        } else if (from_convert == 'c#' && to_convert == 'c#') {
            new_script += (element + '\n');
        } else if (from_convert == 'c#' && to_convert == 'c++') {
            pass
        }
        per = 100 * index / array.length
        $('.progress-bar-line').css({ "width": (per.toString() + "%") });
        index += 1;
    });
    return new_script + last_cmd.get(to_convert)// return new script
}

function searchCommand(line, cmd_with_braces, simple_cmd, value_variable) {
    var new_line = undefined;
    var start_line = ""
    var i = 0;
    while (line.slice(0, (num_space - i) * 4) !== '    '.repeat(num_space - i)) {
        start_line += '    '.repeat(num_space - (i + 1)) + "}\n            "
        brackets.pop()
        i++;
    }
    num_space -= i;
    if (new_line == undefined) {
        new_line = searchCComments(line);
    } if (new_line == undefined) {
        new_line = searchCLoop(line, cmd_with_braces);
    } if (new_line == undefined) {
        new_line = searchCSimpleCmd(line, simple_cmd);
    } if (new_line == undefined) {
        new_line = searchCVariable(line, value_variable);
    } if (new_line == undefined) {
        return start_line + line
    }
    return start_line + new_line
}

function searchCLoop(line, cmd_with_braces) {
    for (var [key, value] of cmd_with_braces) {
        if (line.indexOf(key) !== -1) {
            brackets.push("open");
            num_space += 1
            if (value == "function") {
                return '    '.repeat(num_space - 1) + value + line.slice(key.length + (num_space - 1) * 4, line.length - 1) + '{'
            } else if (value == 'else') {
                return '    '.repeat(num_space - 1) + value + '{'
            } else if (value == 'else if') {
                return '    '.repeat(num_space - 1) + value + ' (' + line.slice(key.length + (num_space - 1) * 4, line.length - 1) + '){'
            } else {
                return '    '.repeat(num_space - 1) + value + ' (' + line.slice((key.length + 1) + (num_space - 1) * 4, line.length - 1) + '){'
            }
        }
    }
    return undefined
}

function searchCComments(line) {
    if (line.indexOf('#') !== -1) { // if it's comment 
        return line.slice(0, line.indexOf('#')) + '//' + line.slice(line.indexOf('#') + 1, line.length) // then return it and replace # with "//"
    }
    return undefined
}

function searchCSimpleCmd(line, simple_cmd) {
    for (var [key, value] of simple_cmd) {
        if (line.indexOf(key) !== -1) {
            return '    '.repeat(num_space) + value + line.slice(key.length + num_space * 4, line.length) + ';'
        }
    }
    return undefined
}

function searchCVariable(line, all_value_variable) {
    if (line.indexOf('=') !== -1) {
        name_variable = line.slice(num_space * 4, line.indexOf('='));
        name_variable = name_variable.replace(/ +/g, '').trim(); // delete all space from name variable
        value_variable = line.slice(line.indexOf('=') + 1, line.length) // value variable
        if (value_variable.slice(1, 2) == '"' || value_variable.slice(1, 2) == "'") {
            return '    '.repeat(num_space) + 'string ' + name_variable + " = " + value_variable + ';'
        } else if (value_variable.indexOf("True") !== -1 || value_variable.indexOf("False") !== -1) {
            return '    '.repeat(num_space) + 'bool ' + name_variable + " = " + (value_variable.slice(1, 2)).toUpperCase() + value_variable.slice(2, value_variable.length) + ';'
        } else if (value_variable.indexOf(".") !== -1 && !(isNaN(value_variable))) {
            return '    '.repeat(num_space) + 'float ' + name_variable + " = " + value_variable + ';'
        } else if (!(isNaN(value_variable))) {
            return '    '.repeat(num_space) + 'int ' + name_variable + " = " + value_variable + ';'
        } else {
            for (var [key, value] of all_value_variable) {
                if (line.indexOf(key) !== -1) {
                    value_in_bracets = line.slice((line.indexOf(key) + key.length), line.length)
                    if (value == 'Console.Read()') {
                        return '    '.repeat(num_space) + 'Console.WriteLine' + value_in_bracets + ';\n            ' + ('    '.repeat(num_space)) + 'var ' + name_variable + " = " + value + ';'
                    }
                    console.log(value)
                    return '    '.repeat(num_space) + name_variable + " = " + value + value_in_bracets + ';'
                }
            }
        }
    }
    return undefined
}


// It's piece of python code for check my code

// n = 23
// while n == 23:
//     print('Hello')
//     while n == 2:
//         print(n)
// print('dsada')

//while n == 23:
//     while n == 2:
//         print(n)
//     print(n)
//print('dsada')

// n = 23
// while n == 23:
//     print('Hello')
//     while n == 2:
//         print(n)
//         while n == 2:
//             print(n)
//        print('Hello')
// print('dsada')