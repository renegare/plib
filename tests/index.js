'use strict';

var chai = require('chai'),
    util = require('util'),
    path = require('path')
    ;

global.noop = function() {};
global.expect = chai.expect;
global.dir = function(obj) {
    console.log(util.inspect(obj, {depth: null}));
};
global.source = function(modPath) {
    return require(path.resolve(__dirname, '..', modPath || 'index.js'));
}

chai.should();
