const { expect } = require("chai");
const { evaluate, asMongoDbQueryDocument } = require("../src/index");

describe("filter-expressions", () => {
  describe("index module.exports", () => {
    it("contains evaluate()", () => {
      expect(typeof evaluate).to.equal("function");
    });
    it("contains asMongoDbQueryDocument", () => {
      expect(typeof asMongoDbQueryDocument).to.equal("function");
    });
  });

  describe("use case example", () => {
    it("will evaluate a complex query with custom options", () => {
      const item = {
        attributes: [
          {
            attribute: { $ref: "alpaca://attribute/foo" },
            locale: "en",
            value: "2020-08-19"
          },
          {
            attribute: { $ref: "alpaca://attribute/foo" },
            locale: "en_AU",
            value: "1983-08-19"
          }
        ]
      };

      // Include custom operator, type etc.
      const expression = [
        ">",
        ["date", ["attribute-value", "alpaca://attribute/foo", "en"]],
        ["date", ["attribute-value", "alpaca://attribute/foo", "en_AU"]]
      ];
      const evaluateOptions = {
        operators: {
          ["attribute-value"]: (context, ref, locale) => {
            let expr = item =>
              item.attribute.$ref === ref &&
              (locale ? item.locale === locale : true);
            const attribute = context.attributes.find(expr);
            return (attribute && attribute.value) || undefined;
          }
        }
      };

      expect(evaluate(expression, item, evaluateOptions)).to.equal(true);

      const expression2 = [
        "==",
        ["attribute-value", "alpaca://attribute/foo", "en"],
        ["attribute-value", "alpaca://attribute/foo", "en"]
      ];

      expect(evaluate(expression2, item, evaluateOptions)).to.equal(true);
    });
  });
});
