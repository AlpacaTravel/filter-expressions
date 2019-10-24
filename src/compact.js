const isEqual = require("lodash.isequal");
const isEmpty = require("lodash.isempty");

// Locate a property from the context
const resolveContext = (context, property) => {
  if (
    typeof property === "string" &&
    typeof context === "object" &&
    typeof context !== null
  ) {
    return context[property];
  }

  return property;
};

// Inverse of the result
const inverse = fn => (...args) => {
  const value = fn(...args);
  return (value === false && true) || false;
};

// Existence
const has = (args, context) => {
  const prop = args[0];
  // If the second arg is an object, use that, not context
  const val =
    args.length === 1
      ? resolveContext(context, prop)
      : resolveContext(args[1], prop);
  return typeof val !== "undefined";
};
const exists = (args, context) => {
  const prop = args[0];
  const val = resolveContext(context, prop);
  return typeof val !== "undefined" && val !== null;
};
const empty = (args, context) => {
  const prop = args[0];
  const val = resolveContext(context, prop);
  return isEmpty(val);
};

// Comparatives
const compare = (comparison, args, context) => {
  const valueA = resolveContext(context, args[0]);
  const valueB = args[1];
  return comparison(compareable(valueA), compareable(valueB));
};
const compareable = value => {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value.getTime();
  }

  return value;
};
const eq = (args, context) => compare((a, b) => isEqual(a, b), args, context);
const lt = (args, context) =>
  compare((a, b) => typeof a == typeof b && a < b, args, context);
const lte = (args, context) =>
  compare((a, b) => typeof a == typeof b && a <= b, args, context);
const gt = (args, context) =>
  compare((a, b) => typeof a == typeof b && a > b, args, context);
const gte = (args, context) =>
  compare((a, b) => typeof a == typeof b && a >= b, args, context);

const fIn = (args, context) => {
  const [prop, ...remaining] = args;
  const value = resolveContext(context, prop);
  if (Array.isArray(value)) {
    return value.reduce(
      (carry, comp) => carry || remaining.indexOf(comp) > -1,
      false
    );
  }
  return remaining.indexOf(value) > -1;
};

const toNumber = args => {
  const [prop] = args;
  return Number(prop);
};
const toDate = args => {
  const [prop] = args;
  return new Date(prop);
};
const toBoolean = args => {
  const [prop] = args;
  if (typeof prop === "string") {
    const val = prop.toLowerCase();
    if (val === "1" || val === "true" || val === "yes") {
      return true;
    }
  }
  return false;
};
const toString = args => {
  const [prop] = args;
  if (prop === null) {
    return "";
  }
  if (typeof prop === "string") {
    if (prop === true) {
      return "true";
    }
    return "false";
  }
  return `${prop}`;
};
const fTypeof = args => {
  const [prop] = args;
  return typeof prop;
};
const concat = args => {
  return args.map(toString).reduce((c, t) => c.concat(t), "");
};
const lowercase = args => {
  const [prop] = args;
  return toString(prop).toLowerCase();
};
const uppercase = args => {
  const [prop] = args;
  return toString(prop).toUpperCase();
};

const fCase = args => {
  let [...remaining] = args;
  while (remaining.length > 2) {
    const [condition, output] = remaining;
    if (condition) {
      return output;
    }
    [, , ...remaining] = remaining;
  }
  return remaining[0];
};
const coalesce = args => {
  return args.find(f => f !== null);
};

const all = args => {
  return args.every(arg => arg);
};
const any = args => {
  return args.some(arg => arg);
};

const fLet = (args, context, stack) => {
  const [prop, value] = args;
  stack[prop] = value;
  return true;
};
const fVar = (args, context, stack) => {
  const [prop] = args;
  return stack[prop];
};
const length = (args, context) => {
  const [prop] = args;
  const value = resolveContext(context, prop);
  if (value && value.length) {
    return value.length;
  }
  return 0;
};
const at = args => {
  const [index, ...value] = args;
  if (Array.isArray(value) && value.length > 1) {
    return value[index];
  }
  if (Array.isArray(value[0])) {
    return value[0][index];
  }
  return undefined;
};

const string = args => {
  return args.find(arg => typeof arg === "string");
};
const number = args => {
  return args.find(arg => typeof arg === "number");
};
const object = args => {
  return args.find(arg => typeof arg === "object");
};
const boolean = args => {
  return args.find(arg => typeof arg === "boolean");
};
const array = args => {
  return args.find(arg => Array.isArray(arg));
};

// Register of functions
const register = {
  has,
  have: has,
  exists,
  exist: exists,
  eq,
  ["=="]: eq,
  ["="]: eq,
  lt,
  ["<"]: lt,
  lte,
  ["<="]: lte,
  gt,
  [">"]: gt,
  gte,
  [">="]: gte,
  empty,
  in: fIn,
  toDate,
  ["to-date"]: toDate,
  toNumber,
  ["to-number"]: toNumber,
  toBoolean,
  ["to-boolean"]: toBoolean,
  toString,
  ["to-string"]: toString,
  ["typeof"]: fTypeof,
  concat,
  uppercase,
  upcase: uppercase,
  lowercase,
  downcase: lowercase,
  case: fCase,
  coalesce,
  all,
  any,
  none: inverse(any),
  let: fLet,
  var: fVar,
  length,
  at,
  string,
  number,
  boolean,
  object,
  array
};

const evaluate = (expr, context = undefined, options = {}, stack = {}) => {
  // If we have an array expression, check if it is valid
  if (Array.isArray(expr) && typeof expr[0] === "string") {
    // Identify the type
    const [type, ...args] = expr;

    // Resolve the args
    const resolvedArgs = args.map(arg =>
      evaluate(arg, context, options, stack)
    );

    // Check for starting with ! to inverse result
    let invert = false;
    if (type.substr(0, 1) === "!") {
      invert = true;
      // Straight negation "!"
      if (type.length === 1) {
        return !toBoolean(resolvedArgs[0]);
      }
    }

    // Identify
    let fn = invert ? register[type.substr(1)] : register[type];

    // If matching a target
    if (typeof fn === "function") {
      // Perform
      const resolvedFn = invert ? inverse(fn) : fn;
      return resolvedFn(resolvedArgs, context, stack);
    }
  }

  return expr;
};

module.exports = { evaluate };
