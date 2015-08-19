var gonzales = require('gonzales-pe'),
    util = require('util')
    ;

function getVariableValue(ast, delim) {
    delim = typeof delim === 'undefined'? ', ' : delim;
    if(ast.length === 1) {
        var value = ast[0];
        var type = value[0];

        switch(type) {
            case 'dimension':
                value = getVariableValue(value.slice(1), '').value;
                break;
            case 'percentage':
                value = getVariableValue([value[1]]).value + '%';
                break;
            default:
                value = value[1];
        }

        return {
            value: value,
            type: type
        }
    } else if(util.isArray(ast) && ast.length > 1) {
        var value = ast.map(function(item) {
            return getVariableValue([item]).value;
        }).join(delim);

        return {
            value: value,
            type: 'list'
        };
    }

    throw new Error('Not implemented');
}

function getVariableType(ast) {

}

function getVariable(ast) {
    var name = ast[1][1][1][1],
        variable = getVariableValue(ast[3].filter(function(item) {
            return util.isArray(item) && item[0] !== 's';
        }))
        ;

    return {
        name: name,
        type: variable.type,
        value: variable.value
    };

    // var variable;
    // switch(type) {
    //     case 'pixel':
    //         variable = step[3][2][1][1] + step[3][2][2][1]
    //         break;
    //     case 'em':
    //         variable = step[3][2][1].pop() + step[3][2][2].pop();
    //         break;
    //     case 'percentage':
    //         variable = step[3][2][1].pop() + '%';
    //         break;
    //     case 'list':
    //         variable = step[3].filter(function(item) {
    //             return item.length && item[0] === 'number';
    //         }).map(function(item) {
    //             return item[1];
    //         }).join(', ')
    //         ;
    //         break;
    //     default:
    //         variable = step[3][2].pop();
    //         break;
    // }
}


module.exports = {
    initVariableParser: function(dss, name, opts) {
        dss.parser(name, function(i, type, commentBlock, file){
            var blocks = function(ast) {
                var currentBlock
                    ;
                return ast.reduce(function(blocks, step) {
                        if(util.isArray(step)) {
                            switch(step[0]) {
                                case 'commentML':
                                    var block = {
                                        comment: step[1],
                                        variables: []
                                    }
                                    blocks.push(block)
                                    currentBlock = block;
                                    break;
                                case 'declaration':
                                    // var name = step[1][1][1][1],
                                    //     type = step[1][1][1][1]
                                    //     ;
                                    //
                                    // dir(step)
                                    if(currentBlock) {
                                        currentBlock.variables.push(getVariable(step));
                                    }
                            }
                        }

                        return blocks;
                    }, [])
                    .filter(function(block) {
                        return block.comment.indexOf(commentBlock) > -1;
                    });
                }(gonzales.cssToAST({
                    css: file,
                    syntax: 'scss'
                }));

            return (blocks.length? blocks.shift().variables : []).map(function(variable) {
                if(type) {
                    variable[type] = true;
                }
                return variable;
            });
        });
    }
}
