const { findPythonFunctionDefinitions } = require('./functionDefinitionDetector');
const { findPythonFunctionCalls } = require('./functionCallDetector');

function functionContextBuilder(codeDirectory, fileName, functionName){
    const functionLocationsForFiles = {};
    // iterate on all files in the codeDirectory recursively and find all function definitions
    const files = getAllFiles(codeDirectory);
    files.forEach(file => {
        const code = fs.readFileSync(file, 'utf8');
        const definitions = findPythonFunctionDefinitions(code, file);
        functionLocationsForFiles[file] = definitions;
    });

    // if key of fileName is not present for functionLocationsForFiles, then add it
    if (!functionLocationsForFiles[fileName]) {
        const code = fs.readFileSync(fileName, 'utf8');
        const definitions = findPythonFunctionDefinitions(code, fileName);
        functionLocationsForFiles[fileName] = definitions;
    }

    // find all function calls in the fileName
    const code = fs.readFileSync(fileName, 'utf8');
    const calls = findPythonFunctionCalls(code, fileName);

    // get the coordinates of current functionName in the fileName
    const currentFunction = functionLocationsForFiles[fileName].find(func => func.name === functionName);
    const {startLine, endLine} = currentFunction;


    // localize only the function calls that are in the scope of the current functionName
    const localizedCalls = calls.filter(call => {
        return call.startLine >= startLine && call.endLine <= endLine;
    });

    // Step 6: Reconstruct fileNames and functionNames for the localized function calls
    const reconstructedCalls = localizedCalls.map(call => {
        const relativePath = path.relative(codeDirectory, call.fileName);
        return {
            fileName: relativePath,
            functionName: call.functionName
        };
    });

    // Step 7: Return children
    return reconstructedCalls;


}

module.exports = { functionContextBuilder };