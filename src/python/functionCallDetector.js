const path = require('path');
const Parser = require('tree-sitter');
const Python = require('tree-sitter-python');
const { findPythonImports } = require('./importsDetector');
const { findPythonFunctionDefinitions } = require('./functionDefinitionDetector');

function findPythonFunctionCalls(code, fileName) {
    const parser = new Parser();
    parser.setLanguage(Python);

    const tree = parser.parse(code);
    const functionCalls = [];

    const imports = findPythonImports(code);
    

    const functionDefinitions = findPythonFunctionDefinitions(code, fileName);
    
    const functionNamesCurrentFile = functionDefinitions.map((definition) => definition.name);
    
    const walkTree = (node) => {
        if (node.type === 'call' && node.child(0).type === 'identifier') {
            const functionName = node.child(0).text;
            const moduleName = node.child(0).text;

            if (Object.prototype.hasOwnProperty.call(imports, moduleName)) {
                const functionFileName = imports[moduleName];
                functionCalls.push({
                    type: 'FunctionCall',
                    functionName: functionName,
                    fileName: functionFileName,
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    startColumn: node.startPosition.column,
                    endColumn: node.endPosition.column,
                    startCharPosition: node.startIndex,
                    endCharPosition: node.endIndex
                });
            } else if(functionNamesCurrentFile.includes(functionName)) {
                // If function is defined in the same file, use the provided file name
                functionCalls.push({
                    type: 'FunctionCall',
                    functionName: functionName,
                    fileName: fileName,
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    startColumn: node.startPosition.column,
                    endColumn: node.endPosition.column,
                    startCharPosition: node.startIndex,
                    endCharPosition: node.endIndex
                });
            }
        }

        // Traverse children
        for (let i = 0; i < node.childCount; i += 1) {
            walkTree(node.child(i));
        }
    };

    walkTree(tree.rootNode);
    return functionCalls;
}

module.exports = { findPythonFunctionCalls };
