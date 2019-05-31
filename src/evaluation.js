const _isEqual = require('lodash.isequal');
const _get = require('lodash.get');
const _isEmpty = require('lodash.isempty');
const turfBooleanWithin = require('@turf/boolean-within').default;
const turfBooleanContains = require('@turf/boolean-contains').default;
const turfBooleanDisjoint = require('@turf/boolean-disjoint').default;
const turfBooleanCrosses = require('@turf/boolean-crosses').default;
const turfBooleanOverlap = require('@turf/boolean-overlap').default;

const modifier = /^(.+)\(([^\)]+)\)$/;

// Evaluate an expression
const evaluate = (expression, target = null, options = {}) => {
  // If the supplied expression is resolved
  if (typeof expression === 'boolean') {
    return expression;
  }
  // Expressions are arrays
  if (!Array.isArray(expression)) {
    return expression;
  }
  // Expressions should have more than 2 values
  if (expression.length < 2) {
    return expression;
  }
  // Expressions start with a string in teh array
  if (typeof expression[0] !== 'string') {
    return expression;
  }

  // Resolve the expressions
  // ... each part of an expression is possible to be evaluated..
  const resolvedExpressions = expression.map(expr => evaluate(expr, target, options));

  // Identify the comparative target
  // ... targets can allow you to extract from context..
  let comparative = resolvedExpressions[1];
  comparative = _get(target || {}, resolvedExpressions[1], resolvedExpressions[1]);

  // Support function modifiers
  // ... you can modify values.. e.g. not(a)
  if (modifier.test(resolvedExpressions[1]) && typeof resolvedExpressions[1] === 'string' && options && options.modifiers) {
    const modifierParts = expression[1].match(modifier);
    const modifierFunc = modifierParts[1];
    const modifierVal = modifierParts[2];
    if (options.modifiers[modifierFunc]) {
      let value = target ? _get(target, modifierVal) : modifierVal;
      comparative = options.modifiers[modifierFunc](value, target);
    }
  }

  // Evaluate the expression
  switch (resolvedExpressions[0].toLowerCase()) {
    // Existence
    case 'has':
    case 'have':
    case 'exists':
    case 'exist': {
      const t = target ? target[resolvedExpressions[1]] : resolvedExpressions[1];
      return ((typeof t !== 'undefined' && t !== null));
    }

    case 'empty': {
      const t = target ? target[resolvedExpressions[1]] : resolvedExpressions[1];
      return _isEmpty(t);
    }
    case '!empty': {
      const t = target ? target[resolvedExpressions[1]] : resolvedExpressions[1];
      return !_isEmpty(t);
    }

    case '!has':
    case '!have':
    case '!exist':
    case '!exists': {
      const t = target ? target[resolvedExpressions[1]] : resolvedExpressions[1];
      return ((typeof t === 'undefined' || t === null));
    }

    // Comparison expressions
    case '==':
      return (_isEqual(comparative, resolvedExpressions[2]));
    case '!=':
      return (!_isEqual(comparative, resolvedExpressions[2]));
    case '>':
    case '>=':
    case '<':
    case '<=': {
      if (typeof comparative !== 'number' || typeof resolvedExpressions[2] !== 'number') {
        return false;
      }
      switch (expression[0]) {
        case '>':
          return (comparative > resolvedExpressions[2]);
        case '>=':
          return (comparative >= resolvedExpressions[2]);
        case '<':
          return (comparative < resolvedExpressions[2]);
        case '<=':
          return (comparative <= resolvedExpressions[2]);
        default:
          return false;
      }
    }

    // Membership
    case 'in': {
      if (Array.isArray(comparative)) {
        return comparative.reduce((carry, comp) => carry || expression.slice(2).indexOf(comp) > -1, false);
      }
      return expression.slice(2).indexOf(comparative) > -1;
    }
    case '!in': {
      if (Array.isArray(comparative)) {
        return comparative.reduce((carry, comp) => carry || expression.slice(2).indexOf(comp) === -1, false);
      }
      return expression.slice(2).indexOf(comparative) === -1;
    }

    // String
    case 'match': {
      const [regex, flags=undefined] = resolvedExpressions.slice(2);
      return new RegExp(regex, flags).test(comparative);
    }

    // Combining
    case 'all': {
      return resolvedExpressions.slice(1).reduce((carry, expr) => (carry && expr === true), true);
    }
    case 'any': {
      return resolvedExpressions.slice(1).reduce((carry, expr) => (carry || expr === true), false);
    }
    case 'none': {
      return !resolvedExpressions.slice(1).reduce((carry, expr) => (carry || expr === true), false);
    }

    // Geo evaluation
    case 'geo-within': {
      return turfBooleanWithin(comparative, resolvedExpressions[2]);
    }
    case '!geo-within': {
      return !turfBooleanWithin(comparative, resolvedExpressions[2]);
    }
    case 'geo-contains': {
      return turfBooleanContains(comparative, resolvedExpressions[2]);
    }
    case '!geo-contains': {
      return !turfBooleanContains(comparative, resolvedExpressions[2]);
    }
    case 'geo-disjoint': {
      return turfBooleanDisjoint(comparative, resolvedExpressions[2]);
    }
    case '!geo-disjoint': {
      return !turfBooleanDisjoint(comparative, resolvedExpressions[2]);
    }
    case 'geo-crosses': {
      return turfBooleanCrosses(comparative, resolvedExpressions[2]);
    }
    case '!geo-crosses': {
      return !turfBooleanCrosses(comparative, resolvedExpressions[2]);
    }
    case 'geo-overlap': {
      return turfBooleanOverlap(comparative, resolvedExpressions[2]);
    }
    case '!geo-overlap': {
      return !turfBooleanOverlap(comparative, resolvedExpressions[2]);
    }

    // Accessors
    case 'get': {
      const t = target ? _get(target, resolvedExpressions[1], resolvedExpressions[2]) : resolvedExpressions[1];
      return t;
    }

    // Otherwise ...
    default:
      // Support pluggable comparisons
      if (options) {
        const keyLower = resolvedExpressions[0].toLowerCase();

        // Look for the comparison
        let func = options.comparisons && options.comparisons[keyLower];
        let inverse = false;
        let type = 'comparison';

        // Look for an inverse comparison expression
        if (!func && keyLower[0] === '!') {
          inverse = true;
          func = options.comparisons[keyLower.substr(1)];
        }

        // Look for an operator
        if (!func && options.operators) {
          func = options.operators[keyLower];
          type = 'operator';
        }

        // Check the result
        if (typeof func === 'function') {
          if (type === 'comparison') {
            const value = func(comparative, ...resolvedExpressions.slice(2));
            if (value) {
              return inverse ? false : true;
            } else {
              return inverse ? true : false;
            }
          } else if (type === 'operator') {
            const value = func(target, ...resolvedExpressions.slice(1));
            // Return the actual result
            return value;
          }
        }
      }

      return resolvedExpressions;
  }
};

module.exports = { evaluate };