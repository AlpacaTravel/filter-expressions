const { expect } = require('chai');
const { evaluate } = require('../src/index');

describe('json-filter-expressions', () => {
  describe('evaluate()', () => {
    describe('when supplying existential conditions', () => {
      describe('using "!exist"', () => {
        it('["!exist", 1] === false', () => {
          expect(evaluate(['!exist', 1])).to.equal(false);
        });
        it('["!exist", null] === true', () => {
          expect(evaluate(['!exist', null])).to.equal(true);
        });
        it('["!exist", undefined] === true', () => {
          expect(evaluate(['!exist', undefined])).to.equal(true);
        });
      });
      describe('using "exists"', () => {
        it('["has", 1] === true', () => {
          expect(evaluate(['has', 1])).to.equal(true);
        })
        it('["exists", 1] === true', () => {
          expect(evaluate(['exists', 1])).to.equal(true);
        });
        it('["exists", null] === true', () => {
          expect(evaluate(['exists', null])).to.equal(false);
        });
        it('["exists", undefined] === true', () => {
          expect(evaluate(['exists', undefined])).to.equal(false);
        });
      });
      describe('using "!in"', () => {
        it('["!in", 1, 1, 2] === false', () => {
          expect(evaluate(['!in', 1, 1, 2])).to.equal(false);
        });
        it('["!in", 0, 1, 2] === true', () => {
          expect(evaluate(['!in', 0, 1, 2])).to.equal(true);
        });
      });
    });
    describe('when supplying comparative conditions', () => {
      describe('using ==', () => {
        it('["==", 1, 1] === true', () => {
          expect(evaluate(['==', 1, 1])).to.equal(true);
        });
        it('["==", 1, 2] === false', () => {
          expect(evaluate(['==', 1, 2])).to.equal(false);
        });
        it('["==", 1, "1"] === false', () => {
          expect(evaluate(['==', 1, '1'])).to.equal(false);
        });
        it('["==", [1,2], [1,2]] === true', () => {
          expect(evaluate(['==', [1, 2], [1, 2]])).to.equal(true);
        });
      });
      describe('using !=', () => {
        it('["!=", 1, 1] === false', () => {
          expect(evaluate(['!=', 1, 1])).to.equal(false);
        });
        it('["!=", 1, 2] === true', () => {
          expect(evaluate(['!=', 1, 2])).to.equal(true);
        });
      });
      describe('using >', () => {
        it('[">", 1, 1] === false', () => {
          expect(evaluate(['>', 1, 1])).to.equal(false);
        });
        it('[">", 1, 2] === false', () => {
          expect(evaluate(['>', 1, 2])).to.equal(false);
        });
        it('[">", 1, 0] === true', () => {
          expect(evaluate(['>', 1, 0])).to.equal(true);
        });
        it('[">", "1", 0] === false', () => {
          expect(evaluate(['>', '1', 0])).to.equal(false);
        });
      });
      describe('using >=', () => {
        it('[">=", 1, 1] === true', () => {
          expect(evaluate(['>=', 1, 1])).to.equal(true);
        });
        it('[">=", 1, 2] === false', () => {
          expect(evaluate(['>=', 1, 2])).to.equal(false);
        });
        it('[">=", 1, 0] === true', () => {
          expect(evaluate(['>=', 1, 0])).to.equal(true);
        });
        it('[">=", "1", 0] === false', () => {
          expect(evaluate(['>=', '1', 0])).to.equal(false);
        });
      });
      describe('using <', () => {
        it('["<", 1, 1] === false', () => {
          expect(evaluate(['<', 1, 1])).to.equal(false);
        });
        it('["<", 1, 2] === true', () => {
          expect(evaluate(['<', 1, 2])).to.equal(true);
        });
        it('["<", 1, 0] === false', () => {
          expect(evaluate(['<', 1, 0])).to.equal(false);
        });
        it('["<", "1", 0] === false', () => {
          expect(evaluate(['<', '1', 0])).to.equal(false);
        });
      });
      describe('using <=', () => {
        it('["<=", 1, 1] === true', () => {
          expect(evaluate(['<=', 1, 1])).to.equal(true);
        });
        it('["<=", 1, 2] === true', () => {
          expect(evaluate(['<=', 1, 2])).to.equal(true);
        });
        it('["<=", 1, 0] === false', () => {
          expect(evaluate(['<=', 1, 0])).to.equal(false);
        });
        it('["<=", "1", 0] === false', () => {
          expect(evaluate(['<=', '1', 0])).to.equal(false);
        });
      });
    });
    describe('when supplying membership conditions', () => {
      describe('using "in"', () => {
        it('["in", 1, 1, 2] === true', () => {
          expect(evaluate(['in', 1, 1, 2])).to.equal(true);
        });
        it('["in", 0, 1, 2] === false', () => {
          expect(evaluate(['in', 0, 1, 2])).to.equal(false);
        });
      });
      describe('using "!in"', () => {
        it('["!in", 1, 1, 2] === false', () => {
          expect(evaluate(['!in', 1, 1, 2])).to.equal(false);
        });
        it('["!in", 0, 1, 2] === true', () => {
          expect(evaluate(['!in', 0, 1, 2])).to.equal(true);
        });
      });
    });
    describe('when supplying combination conditions', () => {
      describe('using "all"', () => {
        it('["all", ["==", 1, 1], ["==", 1, 1]] === true', () => {
          expect(evaluate(['all', ['==', 1, 1], ['==', 1, 1]])).to.equal(true);
        });
        it('["all", ["==", 1, 2], ["==", 1, 1]] === false', () => {
          expect(evaluate(['all', ['==', 1, 2], ['==', 1, 1]])).to.equal(false);
        });
      });
      describe('using "any"', () => {
        it('["any", ["==", 1, 1], ["==", 1, 1]] === true', () => {
          expect(evaluate(['any', ['==', 1, 1], ['==', 1, 1]])).to.equal(true);
        });
        it('["any", ["==", 1, 2], ["==", 1, 1]] === true', () => {
          expect(evaluate(['any', ['==', 1, 2], ['==', 1, 1]])).to.equal(true);
        });
        it('["any", ["==", 1, 2], ["==", 1, 2]] === false', () => {
          expect(evaluate(['any', ['==', 1, 2], ['==', 1, 2]])).to.equal(false);
        });
      });
      describe('using "none"', () => {
        it('["none", ["==", 1, 1], ["==", 1, 1]] === false', () => {
          expect(evaluate(['none', ['==', 1, 1], ['==', 1, 1]])).to.equal(false);
        });
        it('["none", ["==", 1, 2], ["==", 1, 1]] === false', () => {
          expect(evaluate(['none', ['==', 1, 2], ['==', 1, 1]])).to.equal(false);
        });
        it('["none", ["==", 1, 2], ["==", 1, 2]] === true', () => {
          expect(evaluate(['none', ['==', 1, 2], ['==', 1, 2]])).to.equal(true);
        });
      });
    });
    describe('when supplying a target', () => {
      it('["in", "numbers", 1] === true', () => {
        expect(evaluate(['in', 'numbers', 1], { numbers: [1, 2] })).to.equal(true);
      });
      it('["has", "numbers"] === true', () => {
        expect(evaluate(['has', 'numbers'], { numbers: [1, 2] })).to.equal(true);
      });
      it('["!have", "numbers"] === true', () => {
        expect(evaluate(['!have', 'numbers'], { letters: ['a'] })).to.equal(true);
      });
      it('["have", "numbers"] === false', () => {
        expect(evaluate(['have', 'numbers'], { letters: ['a'] })).to.equal(false);
      });
    });
  });
});
