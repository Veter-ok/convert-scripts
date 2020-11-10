$(function () {
    syntax = {'print':'console.log', 'pass':'pass',
              'def' : 'function', 'while' : 'while',
              'if' : 'if'}; // map with syntax language
    brackets = undefined; // Does we shuld write "}" in the end

    $('.convert-button').on('click', function(){ // click on convert button
        var script = $('#your-script').val(); // remember input script
        var new_script = convertScript(script) // write new script
        $('#my-script').text(new_script); // output new script
    });
})

function convertScript(script) { // function for conver script
    var array  = script.split('\n') // split this script on strings
    array.push('\n')
    var new_script = '' // script on select language
    array.forEach(element => { // iterate over the script line by string
        new_script += (searchCommand(element) + '\n'); // run function for search line
    });
    return new_script // return new script
}

function searchCommand(line){  // function for search command in line
    var cmd = '';
    var new_cmd = ''; // command in this string on select language
    var check = true; // Does we check string to end?
    var latest_symbol = ''; // Latest symbol in the string (for example: "{}", ";" )
    var first_symbols = '';
    if (brackets === 'open'){
        if (line.slice(0,4) != '    ') {
            brackets = 'close'
            console.log(line,"скобки закроються")
            first_symbols = '}\n'
        }else if (line.slice(0,4) == '    ') {
            first_symbols = '    '
            line = line.slice(4,line.length)
            console.log(line,"скобки открыты")
        }
        else{
            console.log(line,'nothings')
        }
    }
    for (let char of line){
        cmd += char;
        if (check){
            if (syntax[cmd] != undefined){
                if (syntax[cmd] === 'function' || syntax[cmd] === 'while' || syntax[cmd] === 'if'){
                    if (syntax[cmd] === 'function'){
                        new_cmd += syntax[cmd];
                        latest_symbol = '{';
                    }else{
                        new_cmd += syntax[cmd] + ' (';
                        latest_symbol = '){';
                    }
                    brackets = 'open'
                    check = false;
                }else{
                    check = false;
                    new_cmd += syntax[cmd];
                    latest_symbol = ';';
                }
                cmd = '';
            }
        }else{
            new_cmd += cmd;
            cmd = '';
        }
    }
    if (brackets === 'open'){
        return first_symbols + new_cmd + latest_symbol
    }else if (brackets === 'close'){
        brackets = undefined
        return first_symbols + new_cmd + latest_symbol
    }else{
        return new_cmd + latest_symbol // return line with close symbol
    }
}

// while dsa == 23:
//     print('dsada')