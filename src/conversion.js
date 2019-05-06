const utils = require('./utils');


/*
 * [x] - Basic document conversions
 * [-] - Test nested/inner document selections, eg. { 'field.innerField': { ... } }
 * [-] - Geospatial comparisons
 * [-] - Geospatial comparisons
 */
const asMongoDbQueryDocument = (expression) => {
  // If the supplied expression is resolved
  if (typeof expression === 'boolean') {
    return expression;
  }

  // Check if we have an expression
  if (!utils.isValidExpression(expression)) {
    return expression;
  }

  // Resolve the expressions
  // ... each part of an expression is possible to be evaluated..
  const resolvedExpressions = expression.map(expr => asMongoDbQueryDocument(expr));

  switch(resolvedExpressions[0].toLowerCase()) {
    // Existence
    case 'has':
    case 'have':
    case 'exists':
    case 'exist': {
      return { [resolvedExpressions[1]]: { $exists: true } };
    }

    case '!has':
    case '!have':
    case '!exist':
    case '!exists': {
      return { [resolvedExpressions[1]]: { $exists: false } };
    }

    // Basic equalities
    case '==': {
      return { [resolvedExpressions[1]]: { $eq: resolvedExpressions[2] }};
    }
    case '!=': {
      return { [resolvedExpressions[1]]: { $ne: resolvedExpressions[2] }};
    }
    case '>': {
      return { [resolvedExpressions[1]]: { $gt: resolvedExpressions[2] }};
    }
    case '<': {
      return { [resolvedExpressions[1]]: { $lt: resolvedExpressions[2] }};
    }
    case '>=': {
      return { [resolvedExpressions[1]]: { $gte: resolvedExpressions[2] }};
    }
    case '<=': {
      return { [resolvedExpressions[1]]: { $lte: resolvedExpressions[2] }};
    }
    // Membership
    case 'in': {
      return { [resolvedExpressions[1]]: { $in: [...resolvedExpressions.slice(2)] }};
    }
    case '!in': {
      return { [resolvedExpressions[1]]: { $nin: [...resolvedExpressions.slice(2)] }};
    }
    // Regex
    case 'match': {
      const [regex, flags=undefined] = resolvedExpressions.slice(2);
      if (flags) {
        return { [resolvedExpressions[1]]: { $regex: regex, $options: flags }};
      }
      return { [resolvedExpressions[1]]: { $regex: regex }};
    }
    // Combining
    case 'all': {
      return { $and: resolvedExpressions.slice(1) };
    }
    case 'any': {
      return { $or: resolvedExpressions.slice(1) };
    }
    case 'none': {
      return { $nor: resolvedExpressions.slice(1) };
    }
  }

  return null;
}

module.exports = {
  asMongoDbQueryDocument,
}