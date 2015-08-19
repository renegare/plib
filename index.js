var gonzales = require('gonzales-pe'),
    util = require('util')
    ;

function getVariableValue(ast, delim) {
    if(!util.isArray(ast) || ast.length < 1) {
        throw new Error('Cannot understand AST:' + JSON.stringify(ast));
    }

    delim = typeof delim === 'undefined'? ', ' : delim;

    if(ast.length > 1) {
        return {
            value: ast.map(function(item) {
                    return getVariableValue([item]).value;
                }).join(delim),
            type: 'list'
        };
    }

    var value = ast[0],
        type = value[0]
        ;

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
    };
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
