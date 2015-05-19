var chai = require('chai');

chai.use(require('sinon-chai'));

chai.should();

chai.Assertion.includeStack = true;

module.exports = chai;

module.exports.sinon = require('sinon-chai/node_modules/sinon');


