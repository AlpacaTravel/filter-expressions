const { expect } = require("chai");
const { asMongoDbQueryDocument } = require("../src/conversion");

describe("filter-expressions", () => {
  describe("asMongoDbQueryDocument()", () => {
    describe('using "!exist"', () => {
      it('["!exist", "foo"] === { foo: { $exists: false } }', () => {
        expect(asMongoDbQueryDocument(["!exist", "foo"])).to.deep.equal({
          foo: { $exists: false }
        });
      });
      it('["!exists", "foo"] === { foo: { $exists: false } }', () => {
        expect(asMongoDbQueryDocument(["!exists", "foo"])).to.deep.equal({
          foo: { $exists: false }
        });
      });
      it('["!has", "foo"] === { foo: { $exists: false } }', () => {
        expect(asMongoDbQueryDocument(["!has", "foo"])).to.deep.equal({
          foo: { $exists: false }
        });
      });
      it('["!have", "foo"] === { foo: { $exists: false } }', () => {
        expect(asMongoDbQueryDocument(["!have", "foo"])).to.deep.equal({
          foo: { $exists: false }
        });
      });
    });
    describe('using "exists"', () => {
      it('["exist", "foo"] === { foo: { $exists: true } }', () => {
        expect(asMongoDbQueryDocument(["exist", "foo"])).to.deep.equal({
          foo: { $exists: true }
        });
      });
      it('["exists", "foo"] === { foo: { $exists: true } }', () => {
        expect(asMongoDbQueryDocument(["exists", "foo"])).to.deep.equal({
          foo: { $exists: true }
        });
      });
      it('["has", "foo"] === { foo: { $exists: true } }', () => {
        expect(asMongoDbQueryDocument(["has", "foo"])).to.deep.equal({
          foo: { $exists: true }
        });
      });
      it('["have", "foo"] === { foo: { $exists: true } }', () => {
        expect(asMongoDbQueryDocument(["have", "foo"])).to.deep.equal({
          foo: { $exists: true }
        });
      });
    });
    describe("when supplying comparative conditions", () => {
      describe('using "=="', () => {
        it('["==", "foo", "bar"] === { foo: { $eq: "bar" } }', () => {
          expect(asMongoDbQueryDocument(["==", "foo", "bar"])).to.deep.equal({
            foo: { $eq: "bar" }
          });
        });
      });
      describe('using "!="', () => {
        it('["!=", "foo", "bar"] === { foo: { $ne: "bar" } }', () => {
          expect(asMongoDbQueryDocument(["!=", "foo", "bar"])).to.deep.equal({
            foo: { $ne: "bar" }
          });
        });
      });
      describe('using ">"', () => {
        it('[">", "foo", 10] === { foo: { $gt: 10 } }', () => {
          expect(asMongoDbQueryDocument([">", "foo", 10])).to.deep.equal({
            foo: { $gt: 10 }
          });
        });
      });
      describe('using "<"', () => {
        it('["<", "foo", 10] === { foo: { $lt: 10 } }', () => {
          expect(asMongoDbQueryDocument(["<", "foo", 10])).to.deep.equal({
            foo: { $lt: 10 }
          });
        });
      });
      describe('using "<="', () => {
        it('["<=", "foo", 10] === { foo: { $lte: 10 } }', () => {
          expect(asMongoDbQueryDocument(["<=", "foo", 10])).to.deep.equal({
            foo: { $lte: 10 }
          });
        });
      });
      describe('using ">="', () => {
        it('[">=", "foo", 10] === { foo: { $gte: 10 } }', () => {
          expect(asMongoDbQueryDocument([">=", "foo", 10])).to.deep.equal({
            foo: { $gte: 10 }
          });
        });
      });
    });
    describe("when supplying type conversions", () => {
      it('["==", "foo", ["date", "2020-01-01"]] === { foo: { $eq: new Date("2020-01-01") } }', () => {
        const value = asMongoDbQueryDocument([
          "==",
          "foo",
          ["date", "2020-01-01"]
        ]);
        expect(typeof value.foo).to.equal("object");
        expect(typeof value.foo.$eq).to.equal("object");
        expect(typeof value.foo.$eq.getTime).to.equal("function");
        expect(value.foo.$eq.getTime()).to.equal(1577836800000);
      });
    });
    describe("when supplying membership conditions", () => {
      it('["in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $in: ["foo", "bar"] } });
      });
      it('["!in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["!in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $nin: ["foo", "bar"] } });
      });
    });
    describe("when supplying membership conditions", () => {
      it('["in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $in: ["foo", "bar"] } });
      });
      it('["!in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["!in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $nin: ["foo", "bar"] } });
      });
    });
    describe("when supplying membership conditions", () => {
      it('["in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $in: ["foo", "bar"] } });
      });
      it('["!in", "tags", "foo", "bar"] === { tags: { $in: ["foo", "bar"] } }', () => {
        expect(
          asMongoDbQueryDocument(["!in", "tags", "foo", "bar"])
        ).to.deep.equal({ tags: { $nin: ["foo", "bar"] } });
      });
    });
    describe("when supplying string comparision conditions", () => {
      describe('using "match" without flags', () => {
        it('["match", "foo", "bar"] === { foo: { $regex: "foo" } }', () => {
          expect(asMongoDbQueryDocument(["match", "foo", "bar"])).to.deep.equal(
            { foo: { $regex: "bar" } }
          );
        });
      });
      describe('using "match" with flags', () => {
        it('["match", "foo", "bar", "i"] === { foo: { $regex: "foo", $options: "i" } }', () => {
          expect(
            asMongoDbQueryDocument(["match", "foo", "bar", "i"])
          ).to.deep.equal({ foo: { $regex: "bar", $options: "i" } });
        });
      });
    });
    describe("when supplying combination conditions", () => {
      describe('using "all"', () => {
        it('["all", ["==", "foo", "bar"], ["==", "value", "bang"]] === { $and: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }] }', () => {
          expect(
            asMongoDbQueryDocument([
              "all",
              ["==", "foo", "bar"],
              ["==", "value", "bang"]
            ])
          ).to.deep.equal({
            $and: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }]
          });
        });
      });
      describe('using "any"', () => {
        it('["any", ["==", "foo", "bar"], ["==", "value", "bang"]] === { $or: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }] }', () => {
          expect(
            asMongoDbQueryDocument([
              "any",
              ["==", "foo", "bar"],
              ["==", "value", "bang"]
            ])
          ).to.deep.equal({
            $or: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }]
          });
        });
      });
      describe('using "none"', () => {
        it('["none", ["==", "foo", "bar"], ["==", "value", "bang"]] === { $or: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }] }', () => {
          expect(
            asMongoDbQueryDocument([
              "none",
              ["==", "foo", "bar"],
              ["==", "value", "bang"]
            ])
          ).to.deep.equal({
            $nor: [{ foo: { $eq: "bar" } }, { value: { $eq: "bang" } }]
          });
        });
      });
    });
    describe("operations", () => {
      describe("using a custom expression", () => {
        it("will return the translated value", () => {
          expect(
            asMongoDbQueryDocument(["example", "value"], {
              converter: { example: val => val }
            })
          ).to.equal("value");
        });
      });
    });
    describe("value accessor", () => {
      describe('using "get"', () => {
        it('["get", "foo"]');
      });
    });
    describe("when supplying geo based conditions", () => {
      describe('using "geo-within"', () => {
        it('["geo-within", geoA, geoB]');
        it('["!geo-within", geoA, geoB]');
      });
      describe('using "geo-within" with polygon', () => {
        it('["geo-within", geoA, geoB]');
        it('["!geo-within", geoA, geoB]');
      });
      describe('using "geo-contains"', () => {
        it('["geo-contains", geoA, geoB]');
        it('["!geo-contains", geoA, geoB]');
      });
      describe('using "geo-disjoint"', () => {
        it('["geo-disjoint", geoA, geoB]');
        it('["!geo-disjoint", geoA, geoB]');
      });
      describe('using "geo-crosses"', () => {
        it('["geo-crosses", geoA, geoB]');
        it('["!geo-crosses", geoA, geoB]');
      });
      describe('using "geo-overlap"', () => {
        it('["geo-overlap", geoA, geoB]');
        it('["!geo-overlap", geoA, geoB]');
      });
    });
  });
});
