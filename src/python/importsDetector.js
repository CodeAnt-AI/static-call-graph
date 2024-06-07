const Parser = require('tree-sitter');
const Python = require('tree-sitter-python');


function findAllIdentifierNodes(node, identifierNodes, nodeType) {
    // Base case: if the current node is an identifier node, add it to the list
    if (node.type === nodeType) {
        identifierNodes.push(node);
    } else {
        // If the current node is not an identifier, recursively search its children
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => findAllIdentifierNodes(child, identifierNodes, nodeType));
        }
    }
}

function parseCode(code) {
    return new Promise((resolve, reject) => {
        const parser = new Parser();
        parser.setLanguage(Python);
        const tree = parser.parse(code);
        resolve(tree);
    });
}

function findPythonImports(code) {
    const parser = new Parser();
    parser.setLanguage(Python);
    const tree = parser.parse(code);
    
    
    const imports = {};

    const walkTree = (node) => {
        
        if (node && node.type === 'import_statement') {
            const aliasedImportNode = node.children.find(child => child.type === 'aliased_import');
            if (aliasedImportNode) {
                const dottedNameNode = aliasedImportNode.children.find(child => child.type === 'dotted_name');
                const moduleName = dottedNameNode ? dottedNameNode.text : '';
                
                const identifierNode = aliasedImportNode.children.find(child => child.type === 'identifier');
                const alias = identifierNode ? identifierNode.text : moduleName.split('.').pop();
                
                const modulePath = moduleName.replace(/\./g, '/');
                imports[alias] = modulePath;
            } else {
                const dottedNameNode = node.children.find(child => child.type === 'dotted_name');
                const moduleName = dottedNameNode ? dottedNameNode.text : '';
                
                
                const modulePath = moduleName.replace(/\./g, '/');
                imports[moduleName.split('.').pop()] = modulePath;
            }
        } else if (node && node.type === 'import_from_statement') {
            
            const aliasedImportNode = node.children.find(child => child.type === 'aliased_import');
            if (aliasedImportNode) {
                const dottedNameNodes = []
                findAllIdentifierNodes(node, dottedNameNodes, 'dotted_name');
                const identifierNodes = []
                findAllIdentifierNodes(node, identifierNodes, 'identifier');
                const textDotNameNodes = dottedNameNodes.map(node => node.text);
                const textIdentifierNodes = identifierNodes.map(node => node.text);

                // Filter out the dotted_name nodes that are also identifiers
                const nonIdentifierDottedNameNodes = dottedNameNodes.filter(dottedNameNode => {
                    return !identifierNodes.some(identifierNode => identifierNode.text === dottedNameNode.text);
                });

                
            
                // Construct module path using the remaining dotted_name node
                const moduleName = nonIdentifierDottedNameNodes.map(node => node.text).join('.');
                
                // from all the identifier nodes, get the ones that if node.text has dot in it then separate that as well
                const dottedIdentifiersName = [].concat(...textDotNameNodes.map(item => item.split('.')));
                const alias = textIdentifierNodes.filter(text => !dottedIdentifiersName.includes(text))[0];
                
                const modulePath = moduleName.replace(/\./g, '/');
                imports[alias] = modulePath;
            } else {
                const dottedNameNode = node.children.find(child => child.type === 'dotted_name');
                const moduleName = dottedNameNode ? dottedNameNode.text : '';
                const dottedNameNodeTexts = moduleName.split('.');
                // print children of node
                const identifierNodes = []
                findAllIdentifierNodes(node, identifierNodes, 'identifier');
                const identifierNodeTexts = identifierNodes.map(node => node.text);
                // here see if there is no intersection of startPosition and endPosition of dottedNameNode and identifierNodes, and whatever doesnt have that then give it as importName
                const importName = identifierNodeTexts.filter(text => !dottedNameNodeTexts.includes(text))[0];
                const modulePath = moduleName.replace(/\./g, '/');
                imports[importName] = modulePath;
            }
        }

        // Traverse children
        if(node && node.children){
            node.children.forEach(child => walkTree(child));
        
        }
    };

    walkTree(tree.rootNode);

    return imports;
}

module.exports = { findPythonImports };
