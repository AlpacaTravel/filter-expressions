# Overview

Simple util to provide the ability to evaluate targets based on simple evaluation conditions expressed as arrays. Primarily created so that external JSON files can express conditional expressions.

## Example

The below example shows the simple filter expressions on a collection.

```javascript
// Import evaluate from the library
import { evaluate } from 'filter-expressions';

// JSON definition of filter
const json = {
  "filter": [
    "all",
    ["==", "type", "document"],
    ["in", "tags", "example", "other"]
  ]
};

// Example objects
const objects = [
  { type: 'document', tags: ['example'], src: 'https://alpacamaps/document1.json' },
  { type: 'document', tags: ['something'], src: 'https://alpacamaps/document2.json' },
  { type: 'document', tags: ['other'], src: 'https://alpacamaps/document3.json' },
  { type: 'image', tags: ['example'], src: 'https://alpacamaps/image.png' }
];

// Match the objects
const matched = objects.filter(obj => evaluate(json.filter, obj));
// Returns [
//   { type: "document", src: "https://alpacamaps/document1.json", tags: ["example"] },
//   { type: "document", src: "https://alpacamaps/document3.json", tags: ["other"] }
// ]
```

## Installation

You can add this using NPM

```
$ npm install filter-expressions
```

## Supported Comparison Operators

* Existence: exists / exist / !exists / !exist / empty / !empty
* Comparison: == / != / > / >= / < / <=
* Membership: in / !in
* String Comparision: match
* Combining: all / any / none
* Geospatial comparisons: geo-within / geo-contains / geo-disjoint / geo-crosses / geo-overlap

## Extensions

### Custom Comparison Operators

You can provide your own comparison operator implementations.

```javascript
import { evaluate } from 'filter-expressions';

const options = {
  comparisons: {
    custom: (a, b) => a === b,
  },
};

// evaluate(expression, object, [options])
const result = evaluate(['custom', 'foo', 'bar'], { 'foo': 'bar' }, options);

console.log(result); // Prints true
```

### Custom Value Modifiers

You can implement your own value modifiers.

```javascript
import { evaluate } from 'filter-expressions';

const options = {
  modifiers: {
    not: (val) => !val,
  },
};

// evaluate(expression, object, [options])
const result = evaluate(['==', 'not(a)', false], { a: true }, options);

console.log(result); // Prints true
```

### Custom Operators

You can implement custom operators to perform transformations

```javascript
import { evaluate } from 'filter-expressions';

const options = {
  operators: {
    at: (target, index, array) => array && array[index],
    'to-number': (target, val) => Number(val),
  },
};

console.log(evaluate(['at', 1, [2, 4, 6]])); // Prints 4
console.log(evaluate(['to-number', '4'])); // Prints 4
```

## Conversion of query

```javascript
// Import asMongoDbQueryDocument from the library
import { asMongoDbQueryDocument } from 'filter-expressions';

// JSON definition of an expression that can run both on a local collection
const json = [
  "all",
  ["==", "type", "document"],
  ["in", "tags", "example", "other"]
];

// Convert the evaluation into a mongodb query document that can run on
// a mongo db collection
const query = asMongoDbQueryDocument(json);
```

## Notes

* Comparisons are done as using lodash "isEqual".
* Run npm t to run tests
* Inspired based on Mapbox style filters
