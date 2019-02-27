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
    describe('value accessor', () => {
      describe('using "get"', () => {
        it('["get", 0]', () => {
          expect(evaluate(['get', 0])).to.equal(0);
        });
        it('["get", "foo"], { foo: "bar" }', () => {
          expect(evaluate(['get', 'foo'], { foo: 'bar' })).to.equal('bar');
        });
      })
    })
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
    describe('when comparing two field values', () => {
      it('["==", ["get", "foo"], ["get", "bar"]], { foo: 1, bar: 1 } === true', () => {
        expect(evaluate(["==", ["get", "foo"], ["get", "bar"]], { foo: 1, bar: 1 })).to.equal(true);
      });
      it('["==", ["get", "foo"], ["get", "bar"]], { foo: 1, bar: 2 } === false', () => {
        expect(evaluate(["==", ["get", "foo"], ["get", "bar"]], { foo: 1, bar: 2 })).to.equal(false);
      });
    })
    describe('when supplying geo based conditions', () => {
      describe('using "geo-within"', () => {
        it('["geo-within", geoA, geoB]', () => {
          const geoA = { type: 'Point', coordinates: [1, 2] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['geo-within', geoA, geoB])).to.equal(true);
        });
        it('["!geo-within", geoA, geoB]', () => {
          const geoA = { type: 'Point', coordinates: [2, 1] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['!geo-within', geoA, geoB])).to.equal(true);
        });
      });
      describe('using "geo-contains"', () => {
        it('["geo-contains", geoA, geoB]', () => {
          const geoA = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          const geoB = { type: 'Point', coordinates: [1, 2] };
          expect(evaluate(['geo-contains', geoA, geoB])).to.equal(true);
        });
        it('["!geo-contains", geoA, geoB]', () => {
          const geoA = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          const geoB = { type: 'Point', coordinates: [2, 1] };
          expect(evaluate(['!geo-contains', geoA, geoB])).to.equal(true);
        });
      });
      describe('using "geo-disjoint"', () => {
        it('["geo-disjoint", geoA, geoB]', () => {
          const geoA = { type: 'Point', coordinates: [2, 1] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['geo-disjoint', geoA, geoB])).to.equal(true);
        });
        it('["!geo-disjoint", geoA, geoB]', () => {
          const geoA = { type: 'Point', coordinates: [1, 2] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['!geo-disjoint', geoA, geoB])).to.equal(true);
        });
      });
      describe('using "geo-crosses"', () => {
        it('["geo-crosses", geoA, geoB]', () => {
          const geoA = { type: 'LineString', coordinates: [[-2, 2], [4, 2]] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['geo-crosses', geoA, geoB])).to.equal(true);
        });
        it('["!geo-crosses", geoA, geoB]', () => {
          const geoA = { type: 'LineString', coordinates: [[-2, -2], [-4, -4]] };
          const geoB = { type: 'LineString', coordinates: [[1, 1], [1, 2], [1, 3], [1, 4]] };
          expect(evaluate(['!geo-crosses', geoA, geoB])).to.equal(true);
        });
      });
      describe('using "geo-overlap"', () => {
        it('["geo-overlap", geoA, geoB]', () => {
          const geoA = { type: 'Polygon', coordinates: [[[0, 0], [0,5], [5, 5], [5, 0], [0, 0]]] };
          const geoB = { type: 'Polygon', coordinates: [[[1, 1], [1, 6], [6, 6], [6, 1], [1, 1]]] };
          expect(evaluate(['geo-overlap', geoA, geoB])).to.equal(true);
        });
        it('["!geo-overlap", geoA, geoB]', () => {
          const geoA = { type: 'Polygon', coordinates: [[[1, 1], [1, 6], [6, 6], [6, 1], [1, 1]]] };
          const geoB = { type: 'Polygon', coordinates: [[[10, 10], [10, 15], [15, 15], [15, 10], [10, 10]]] };
          expect(evaluate(['!geo-overlap', geoA, geoB])).to.equal(true);
        });
      });
    });
    describe('using options', () => {
      describe('with modifiers', () => {
        it('will use a matching modifier', () => {
          expect(
            evaluate(['==', 'not(a)', false], { a: true }, {
              modifiers: { not: (val) => (!val) },
            })
          ).to.equal(true);
        });
        it('will user a matching modifier in collection', () => {
          expect(
            evaluate(['all', ['==', 'not(a)', false]], { a: true }, {
              modifiers: { not: (val) => (!val) },
            })
          ).to.equal(true);
        });
      });
      describe('with comparisons', () => {
        it('will use a matching comparison', () => {
          expect(
            evaluate(['custom', 'a', true], { a: true }, {
              comparisons: { custom: (a, b) => (a == b) },
            })
          ).to.equal(true);
        });
        it('will use an inverse matching comparison', () => {
          expect(
            evaluate(['!custom', 'a', true], { a: true }, {
              comparisons: { custom: (a, b) => (a == b) },
            })
          ).to.equal(false);
        });
      });
      describe('with operators', () => {
        it('will use a operator', () => {
          expect(
            evaluate(['at', '1', [2, 4, 6]], {}, {
              operators: { at: (context, index, array) => array && array[index] }
            })
          ).to.equal(4);
        });
        it('will use a operator within expressions', () => {
          expect(
            evaluate(['==', ['at', '1', [2, 4, 6]], 4], {}, {
              operators: { at: (target, index, array) => array && array[index] }
            })
          ).to.equal(true);
          expect(
            evaluate(['num', 'foo'], { foo: 4 }, {
              operators: { num: (target, a) => Number(target[a]) }
            })
          ).to.equal(4);
          expect(
            evaluate(['to-number', '4'], {}, {
              operators: { 'to-number': (target, a) => Number(a) }
            })
          ).to.equal(4);
        });
      });
      describe('more complex combinations', () => {
        it('selects any safely', () => {
          const context = {
            ancestors: 0,
            discriminator: 'collection',
          };
          const filter = [
            'any',
            // Adding as place to the top level collection
            ['all', ['==', 'discriminator', 'collection'], ['==', 'ancestors', 0]],
            // true,
            // ['==', 'ancestors', 1],
            // Adding to directions from the top level collection
            // ['all', ['==', 'discriminator', 'directions'], ['==', 'ancestors', 2]]
          ];
          expect(evaluate(filter, context)).to.equal(true);
        });
        it('selects basic all', () => {
          const context = {
            ancestors: 0,
            discriminator: 'collection',
          };
          const filter = ['all', ['==', 'discriminator', 'collection'], ['==', 'ancestors', 0]];
          expect(evaluate(filter, context)).to.equal(true);
        });
        it('selects basic all', () => {
          const context = {
            ancestors: 0,
            discriminator: 'collection',
          };
          const filter = ['==', 'ancestors', 0];
          expect(evaluate(filter, context)).to.equal(true);
        });
      });
    });
  });
});
