const isEqual = require('lodash.isequal');
const turfBooleanWithin = require('@turf/boolean-within').default;
const turfBooleanContains = require('@turf/boolean-contains').default;
const turfBooleanDisjoint = require('@turf/boolean-disjoint').default;
const turfBooleanCrosses = require('@turf/boolean-crosses').default;
const turfBooleanOverlap = require('@turf/boolean-overlap').default;

const modifier = /^(.+)\(([^\)]+)\)$/;

const evaluate = (condition, target = null, options = {}) => {
  if (typeof condition === 'boolean') {
    return condition;
  }
  if (!Array.isArray(condition)) {
    return false;
  }
  if (condition.length < 2) {
    return false;
  }
  if (typeof condition[0] !== 'string') {
    return false;
  }

  // Identify the comparative target
  let comparative = target ? target[condition[1]] : condition[1];

  // Support function modifiers
  if (modifier.test(condition[1]) && options && options.modifiers) {
    const modifierParts = condition[1].match(modifier);
    const modifierFunc = modifierParts[1];
    const modifierVal = modifierParts[2];
    if (options.modifiers[modifierFunc]) {
      let value = target ? target[modifierVal] : modifierVal;
      comparative = options.modifiers[modifierFunc](value, target);
    }
  }

  // Evaluate the condition
  switch (condition[0].toLowerCase()) {
    // Existence
    case 'has':
    case 'have':
    case 'exists':
    case 'exist':
      return ((typeof comparative !== 'undefined' && comparative !== null));
    case '!has':
    case '!have':
    case '!exist':
    case '!exists':
      return ((typeof comparative === 'undefined' || comparative === null));

    // Comparison Conditions
    case '==':
      return (isEqual(comparative, condition[2]));
    case '!=':
      return (!isEqual(comparative, condition[2]));
    case '>':
    case '>=':
    case '<':
    case '<=': {
      if (typeof comparative !== 'number' || typeof condition[2] !== 'number') {
        return false;
      }
      switch (condition[0]) {
        case '>':
          return (comparative > condition[2]);
        case '>=':
          return (comparative >= condition[2]);
        case '<':
          return (comparative < condition[2]);
        case '<=':
          return (comparative <= condition[2]);
        default:
          return false;
      }
    }

    // Membership
    case 'in': {
      if (Array.isArray(comparative)) {
        return comparative.reduce((carry, comp) => carry || condition.slice(2).indexOf(comp) > -1, false);
      }
      return condition.slice(2).indexOf(comparative) > -1;
    }
    case '!in': {
      if (Array.isArray(comparative)) {
        return comparative.reduce((carry, comp) => carry || condition.slice(2).indexOf(comp) === -1, false);
      }
      return condition.slice(2).indexOf(comparative) === -1;
    }

    // Combining
    case 'all': {
      return condition.slice(1).reduce((carry, cond) => (carry && evaluate(cond, target, options)), true);
    }
    case 'any': {
      return condition.slice(1).reduce((carry, cond) => (carry || evaluate(cond, target, options)), false);
    }
    case 'none': {
      return !condition.slice(1).reduce((carry, cond) => (carry || evaluate(cond, target, options)), false);
    }

    // Geo evaluation
    case 'geo-within': {
      return turfBooleanWithin(comparative, condition[2]);
    }
    case '!geo-within': {
      return !turfBooleanWithin(comparative, condition[2]);
    }
    case 'geo-contains': {
      return turfBooleanContains(comparative, condition[2]);
    }
    case '!geo-contains': {
      return !turfBooleanContains(comparative, condition[2]);
    }
    case 'geo-disjoint': {
      return turfBooleanDisjoint(comparative, condition[2]);
    }
    case '!geo-disjoint': {
      return !turfBooleanDisjoint(comparative, condition[2]);
    }
    case 'geo-crosses': {
      return turfBooleanCrosses(comparative, condition[2]);
    }
    case '!geo-crosses': {
      return !turfBooleanCrosses(comparative, condition[2]);
    }
    case 'geo-overlap': {
      return turfBooleanOverlap(comparative, condition[2]);
    }
    case '!geo-overlap': {
      return !turfBooleanOverlap(comparative, condition[2]);
    }

    // Otherwise ...
    default:
      // Support pluggable comparisons
      if (options && options.comparisons) {
        const keyLower = condition[0].toLowerCase();

        // Look fro the comparison
        let func = options.comparisons[keyLower];
        let inverse = false;

        // Look for an inverse condition
        if (!func && keyLower[0] === '!') {
          inverse = true;
          func = options.comparisons[keyLower.substr(1)];
        }

        // Check the result
        if (typeof func === 'function') {
          if (func(comparative, ...condition.slice(2))) {
            return inverse ? false : true;
          } else {
            return inverse ? true : false;
          }
        }
      }

      return false;
  }
};

module.exports = { evaluate };
