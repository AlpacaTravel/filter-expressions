const isValidExpression = (expression) => {
  // Expressions are arrays
  if (!Array.isArray(expression)) {
    return false;
  }
  // Expressions should have more than 2 values
  if (expression.length < 2) {
    return false;
  }
  // Expressions start with a string in teh array
  if (typeof expression[0] !== 'string') {
    return false;
  }

  // Assume valid after checks
  return true;
}

module.exports = {
  isValidExpression,
}