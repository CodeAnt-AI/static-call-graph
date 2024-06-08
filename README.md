# Static Function Call Graph Generator

## Why This Package Exists

In the evolving landscape of software development, adoption of AI in software development is increasing at a rapid pace. Despite significant advancements in code generation and refactoring tools, a unified and accurate API to generate function call graphs across multiple programming languages is missing.

This package addresses this gap by providing a robust library capable of identifying both parent and child functions within a codebase. This enables developers to construct a comprehensive and meaningful context around each function. With this enhanced understanding, developers can create more effective unit tests, generate improved documentation, facilitate schema changes, and implement more efficient code refactorings. Ultimately, this library serves as a foundational tool for enhancing code quality and maintainability through deeper insights into function interactions.


## Installation

Install the package via npm:

```bash
npm install static-function-call-graph-generator
```

## Example usage
The main interface to use the call graph generator is the getNeighbours function. Here’s a basic example of how to use this function within your project:

```javascript
const { getNeighbours } = require('static-call-graph');

// Define the directory containing Python code, the specific file, and function you are interested in
const codeDirectory = './path/to/your/python/code';
const fileName = './path/to/file/where/function/is/defined';
const functionName = 'functionName';

// Generate the call graph context
const callGraphContext = functionContextBuilderPython(codeDirectory, fileName, functionName);

// Output the result
console.log(callGraphContext);
// {
//     parents:[],
//     children:[]
// }
```