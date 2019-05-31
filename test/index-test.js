const { expect } = require('chai');
const { evaluate, asMongoDbQueryDocument } = require('../src/index');

describe('filter-expressions', () => {
  describe('index module.exports', () => {
    it('contains evaluate()', () => {
      expect(typeof evaluate).to.equal('function');
    });
    it('contains asMongoDbQueryDocument', () => {
      expect(typeof asMongoDbQueryDocument).to.equal('function');
    });
  });
});