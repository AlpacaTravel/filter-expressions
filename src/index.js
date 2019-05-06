const { evaluate } = require('./evaluation');
const { asMongoDbQueryDocument } = require('./conversion');

module.exports = {
  evaluate,
  asMongoDbQueryDocument,
};