var cmd_with_braces = new Map([
    ['def', 'function'],
    ['while', 'while'],
    ['elif', 'else if'],
    ['if', 'if'],
    ['else', 'else']
]); // map with syntax language
var simple_cmd = new Map([
    ['print', 'Console.WriteLine']
]);
var num_space = 0; // sum of space in the string
var brackets = []; // Does we shuld write "}" in the end
var to_convert = ''
var from_convert = ''

$(function () {
    $("div.select-converter > span").on('click', function () {
        $('div.select-converter > span').attr('class', '')
        $(this).attr('class', 'active')
    });

    $("div.from-convert > span").on('click', function () {
        $('div.from-convert > span').attr('class', '')
        $(this).attr('class', 'active')
        from_convert = $(this).attr('value')
    });

    $("div.to-convert > span").on('click', function () {
        $('div.to-convert > span').attr('class', '')
        $(this).attr('class', 'active')
        to_convert = $(this).attr('value')
    });

    $('.convert-button').on('click', function () { // click on convert button
        num_space = 0; //reset the value
        brackets = []; // reset the value
        var script = $('#your-script').val(); // remember input script
        var new_script = convertScript(script) // write new script
        $('#my-script').text(new_script); // output new script
    });
})


function convertScript(script) { // function for conver script
    var array = script.split('\n') // split this script on strings
    array.push('\n') // add /n to the end of the array to see the array to the end
    var new_script = "using System;\n\nnamespace MyProgram\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n" // script on select language
    array.forEach(element => { // iterate over the script line by string
        new_script += '            ' + (searchCommand(element) + '\n'); // run function for search command in line
    });
    return new_script + '        }\n    }\n}'// return new script
}

function searchCommand(line) {  // function for search command in line
    if (line.indexOf('#') !== -1) { // if it's comment 
        return line.slice(0, line.indexOf('#')) + '//' + line.slice(line.indexOf('#') + 1, line.length) // then return it and replace # with //
    }

    if (brackets[brackets.length - 1] === 'open') { // Check if brackets are open
        if (line.slice(0, num_space * 4) !== '    '.repeat(num_space)) {
            brackets[brackets.length - 1] = "close"
            num_space -= 1
        }
    }

    for (var [key, value] of cmd_with_braces) {
        if (line.indexOf(key) !== -1) {
            brackets.push("open");
            num_space += 1
            if (value == "function") {
                return '    '.repeat(num_space - 1) + value + line.slice(key.length + (num_space - 1) * 4, line.length) + '{'
            } else if (value == 'else') {
                return '    '.repeat(num_space - 1) + '}' + value + '{'
            } else if (value == 'else if') {
                return '    '.repeat(num_space - 1) + '}' + value + ' (' + line.slice(key.length + (num_space - 1) * 4, line.length - 1) + '){'
            } else {
                return '    '.repeat(num_space - 1) + value + ' (' + line.slice(key.length + (num_space - 1) * 4, line.length - 1) + '){'
            }
        }
    }

    for (var [key, value] of simple_cmd) {
        if (line.indexOf(key) !== -1) {
            if (brackets[brackets.length - 1] == "close") {
                brackets.pop()
                return '    '.repeat(num_space) + "}\n" + '    '.repeat(num_space) + '            ' + value + line.slice(key.length + num_space * 4, line.length) + ';'
            }
            return '    '.repeat(num_space) + value + line.slice(key.length + num_space * 4, line.length) + ';'
        }
    }

    if (line == '\n' && brackets[brackets.length - 1] === "close") {
        return '}'
    }

    return ''
}


// It's piece of python code for check my code
// n = 23
// while n == 23:
//     print('Hello')
//     print(n)
// print('dsada')

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