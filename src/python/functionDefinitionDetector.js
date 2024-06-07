const Parser = require('tree-sitter');
const Python = require('tree-sitter-python');


function findPythonFunctionDefinitions(code, fileName) {
    const parser = new Parser();
        parser.setLanguage(Python);
        const tree = parser.parse(code);
    const functions = [];

    const walkTree = (node, startLine, endLine) => {
        if (node && node.type === 'function_definition') {
            const {startPosition, endPosition} = node;
            
            functions.push({
                type: 'Function',
                fileName: fileName,
                name: node.child(1).text, // Function name is the second child
                startLine: startPosition.row + 1,
                endLine: endPosition.row + 1,
                startColumn: startPosition.column,
                endColumn: endPosition.column,
                startCharPosition: node.startIndex,
                endCharPosition: node.endIndex
            });
            
        }

        // Traverse children
        if(node){
            for (let i = 0; i < node.childCount; i+=1) {
                walkTree(node.child(i), startLine, endLine);
            }
        }
        
        
    };

    walkTree(tree.rootNode);

    return functions;
}

module.exports = { findPythonFunctionDefinitions };
