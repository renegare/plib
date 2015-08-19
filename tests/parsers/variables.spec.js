describe('parse variables', function() {
    var dss = require('dss'),
        plib = source(),
        parsedData
        ;

    plib.initVariableParser(dss, 'variables');

    describe('single declaration of variables', function() {
        beforeEach(function(done) {
            dss.parse([
                '/**',
                ' * @name Variables',
                ' * @description Some nice variables',
                ' * @variables',
                '*/',
                '$string_var: red;',
                '$number_var: 1;',
                '$pixel_var: 20px;',
                '$em_var: 0.3em;',
                '$percentage_var: 45%;',
                '$list_var: red 1 20px 0.3em 45%;'
            ].join("\n"), {}, function(parsed) {
                parsedData = parsed;
                done();
            });
        });

        it('should list variables in block', function() {
            parsedData.should.eql({
                blocks: [
                    {
                        name: 'Variables',
                        description: 'Some nice variables',
                        variables: [
                            {name: 'string_var', value: 'red', type: 'ident'},
                            {name: 'number_var', value: '1', type: 'number'},
                            {name: 'pixel_var', value: '20px', type: 'dimension'},
                            {name: 'em_var', value: '0.3em', type: 'dimension'},
                            {name: 'percentage_var', value: '45%', type: 'percentage'},
                            {name: 'list_var', value: 'red, 1, 20px, 0.3em, 45%', type: 'list'}
                        ]
                    }
                ]
            });
        });
    });

    describe('multi declaration of variables', function() {
        beforeEach(function(done) {
            dss.parse([
                '/**',
                ' * @name Colours',
                ' * @description Some nice colours',
                ' * @variables',
                '*/',
                '$primary-color: red;',
                '$secondary-color: blue;',
                '$tertiary-color: green;',

                '/**',
                ' * @name Grid dims',
                ' * @description Grid widths',
                ' * @variables',
                '*/',
                '$grid-gutter-width: 10px;',
                '$grid-cols: 10;',
                '$grid-col-width: 30px;'
            ].join("\n"), {}, function(parsed) {
                parsedData = parsed;
                done();
            });
        });

        it('should list variables in block', function() {
            parsedData.should.eql({
                blocks: [
                    {
                        name: 'Colours',
                        description: 'Some nice colours',
                        variables: [
                            {name: 'primary-color', value: 'red', type: 'ident'},
                            {name: 'secondary-color', value: 'blue', type: 'ident'},
                            {name: 'tertiary-color', value: 'green', type: 'ident'}
                        ]
                    },
                    {
                        name: 'Grid dims',
                        description: 'Grid widths',
                        variables: [
                            {name: 'grid-gutter-width', value: '10px', type: 'dimension'},
                            {name: 'grid-cols', value: '10', type: 'number'},
                            {name: 'grid-col-width', value: '30px', type: 'dimension'}
                        ]
                    }
                ]
            });
        });
    });


    describe('describe variable type', function() {
        beforeEach(function(done) {
            dss.parse([
                '/**',
                ' * @name Colours',
                ' * @description Some nice colours',
                ' * @variables colour',
                '*/',
                '$primary-color: red;',
                '$secondary-color: blue;',
                '$tertiary-color: green;',
            ].join("\n"), {}, function(parsed) {
                parsedData = parsed;
                done();
            });
        });

        it('should list variables in block', function() {
            parsedData.should.eql({
                blocks: [
                    {
                        name: 'Colours',
                        description: 'Some nice colours',
                        variables: [
                            {name: 'primary-color', value: 'red', colour: true, type: 'ident'},
                            {name: 'secondary-color', value: 'blue', colour: true, type: 'ident'},
                            {name: 'tertiary-color', value: 'green', colour: true, type: 'ident'}
                        ]
                    }
                ]
            });
        });
    });
});
