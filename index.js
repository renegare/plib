var gonzales = require('gonzales-pe'),
    util = require('util')
    ;

module.exports = {
    initVariableParser: function(dss, name, opts) {
        dss.parser(name, function(i, line, commentBlock, file){
            var ast = gonzales.cssToAST({
                css: file,
                syntax: 'scss'
            });

            var blocks = (function() {
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
                                        var variable;
                                        switch(step[3][2][0]) {
                                            case 'dimension':
                                                variable = step[3][2][1].pop() + step[3][2][2].pop();
                                                break;
                                            default:
                                                variable = step[3][2].pop();
                                                break;
                                        }
                                        currentBlock.variables.push({name: step[1][1][1][1], value: variable});
                                    }
                                    break;
                            }
                        }

                        return blocks;
                    }, [])
                    .filter(function(block) {
                        return block.comment.indexOf(commentBlock) > -1;
                    });
                })();

            return blocks.length? blocks.shift().variables : [];
        });
    }
}
