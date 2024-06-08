const { functionContextBuilderPython } = require('./src/python/functionContextBuilder');
function getNeighbours(directoryPath, filePath, functionName) {
    
    return functionContextBuilderPython(directoryPath, filePath, functionName);
}

module.exports = { getNeighbours };