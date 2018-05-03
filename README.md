# Overview

Simple util  to provide the ability to evaluate targets based on simple evaluation conditions expressed as arrays. Primarily created so that external JSON files can express conditional expressions.

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

* Existence: exists / exist / !exists / !exist
* Comparison: == / != / > / >= / < / <=
* Membership: in / !in
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

## Notes

* Comparisons are done as using lodash "isEqual".
* Run npm t to run tests
* Inspired based on Mapbox style filters
