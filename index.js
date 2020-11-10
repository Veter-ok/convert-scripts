$(function () {
    syntax = {'print':'console.log', 'pass':'pass',
              'def' : 'function', 'while' : 'while',
              'if' : 'if'};
    close_brackets = false;

    $('.convert-button').on('click', function(){
        var script = $('#your-script').val();
        var new_script = convertScript(script)
        $('#my-script').text(new_script);
    });
})

function convertScript(script) {
    var array  = script.split('\n') // split this script on strings
    var new_script = '' // script on select language
    array.forEach(element => { // iterate over the script line by string
        new_script += (searchCommand(element) + '\n'); // starting function for search lino
    });
    return new_script
}

function searchCommand(line){
    var cmd = '';
    var new_cmd = ''; // command in this string on select language
    var check = true; // Does we check string to end?
    var latest_symbol = ''; // Latest symbol in the string (for example: {} ; )
    var type_cmd = '' // type
    if  (close_brackets){
        if (line.slice(0,4) === '    '){
            close_brackets = true;
        }
    }else{
        console.log('внутри скобок')
        if (line.slice(0,4) !== '    '){
            close_brackets = true;
        }
    }
    for (let char of line){
        cmd += char;
        if (check){
            if (syntax[cmd] != undefined){
                if (syntax[cmd] === 'function'){
                    type_cmd = 'brackets';
                    new_cmd += syntax[cmd];
                    latest_symbol = '{';
                    check = false;
                }else if (syntax[cmd] === 'while' || syntax[cmd] === 'if'){
                    type_cmd = 'brackets'
                    new_cmd += syntax[cmd] + ' (';
                    latest_symbol = '){';
                    check = false;
                }else{
                    type_cmd = 'no brackets'
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
    if (type_cmd === 'brackets'){
        return (new_cmd.slice(0,new_cmd.length - 1)) + latest_symbol
    }else{
        if (close_brackets){
            return new_cmd + latest_symbol + '\n}'
        }
        return new_cmd + latest_symbol
    }
}