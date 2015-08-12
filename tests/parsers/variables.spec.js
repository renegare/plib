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
                ' * @name Colours',
                ' * @description Some nice colours',
                ' * @variables',
                '*/',
                '$primary-color: red;',
                '$secondary-color: blue;',
                '$tertiary-color: green;',

                // '/**',
                // ' * @name Grid dims',
                // ' * @description Grid widths',
                // ' * @variables',
                // '*/',
                // '$grid-gutter-width: 10px;',
                // '$grid-cols: 10;',
                // '$grid-col-width: 30px',
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
                            {name: 'primary-color', value: 'red'},
                            {name: 'secondary-color', value: 'blue'},
                            {name: 'tertiary-color', value: 'green'}
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
                            {name: 'primary-color', value: 'red'},
                            {name: 'secondary-color', value: 'blue'},
                            {name: 'tertiary-color', value: 'green'}
                        ]
                    },
                    {
                        name: 'Grid dims',
                        description: 'Grid widths',
                        variables: [
                            {name: 'grid-gutter-width', value: '10px'},
                            {name: 'grid-cols', value: '10'},
                            {name: 'grid-col-width', value: '30px'}
                        ]
                    }
                ]
            });
        });
    });
});
