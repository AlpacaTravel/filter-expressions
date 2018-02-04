# Overview

Simple util  to provide the ability to evaluate targets based on simple evaluation conditions expressed as arrays.

## Example

The below example shows the simple filter expressions on a collection.

```javascript
// Import evaluate from the library
import { evaluate } from 'json-filter-expressions';

// JSON definition of filter
const json = {
  "filter": ["all", ["==", "type", "document"], ["in", "tags", "example", "other"]]
}

// Example objects
const objects = [
  { type: "document", src: "https://alpacamaps/document1.json", tags: ["example"] },
  { type: "document", src: "https://alpacamaps/document2.json", tags: ["something"] },
  { type: "document", src: "https://alpacamaps/document3.json", tags: ["other"] },
  { type: "image", src: "https://alpacamaps/image.png", tags: ["example"] }
]

// Match the objects
const matched = evaluate(json.filter, objects);
// Returns [
//   { type: "document", src: "https://alpacamaps/document1.json", tags: ["example"] },
//   { type: "document", src: "https://alpacamaps/document3.json", tags: ["other"] }
// ]
```

## Installation

You can add this using NPM

```
$ npm install json-filter-expressions
```

## Supported Evaluators

* Existence: exists / exist / !exists / !exist
* Comparison: == / != / > / >= / < / <=
* Membership: in / !in
* Combining: all / any / none

## Notes

* Comparisons are done as using lodash "isEqual".
* Run npm t to run tests
* Inspired based on mapbox style filters
