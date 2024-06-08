const { findPythonFunctionDefinitions } = require('./functionDefinitionDetector');
const { findPythonFunctionCalls } = require('./functionCallDetector');
const { getAllFiles } = require('../Utils/traverseDirectory');
const fs = require('fs');
const path = require('path');

function functionContextBuilderPython(codeDirectory, fileName, functionName){
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

    // Reconstruct fileNames and functionNames for the localized function calls
    const reconstructedCalls = localizedCalls.map(call => {
        
        const importedFileName = call.fileName;
        // iterate in files, and see if the importedFileName is present in the files, see for maximum overlap and get that fileName
        let maxOverlap = 0;
        let maxOverlapFile = "";
        let maxOverlapPosition = 0;

        // TODO: Improve better logic for finding the file with maximum overlap
        files.forEach(file => {
            for (let i = 0; i < file.length; i+=1) {
                let overlap = 0;
                while (i + overlap < file.length && overlap < importedFileName.length && file[i + overlap] === importedFileName[overlap]) {
                    overlap+=1;
                }
                if (overlap > maxOverlap || (overlap === maxOverlap && i > maxOverlapPosition)) {
                    maxOverlap = overlap;
                    maxOverlapFile = file;
                    maxOverlapPosition = i;
                }
            }
        });

        return {
            fileName: maxOverlapFile,
            functionName: call.functionName
        };
    });

    // find all the parent functions of the current functionName
    const parentFunctions = [];
    files.forEach(file => {
        const code = fs.readFileSync(file, 'utf8');
        const functionCalls = findPythonFunctionCalls(code, file);
        functionCalls.forEach(call => {
            if (call.functionName === functionName && fileName.includes(call.fileName)) {
                const callerFunction = functionLocationsForFiles[file].find(func =>
                    func.startLine <= call.startLine && func.endLine >= call.endLine);
                if (callerFunction) {
                    parentFunctions.push({
                        fileName: file,
                        functionName: callerFunction.name
                    });
                }
            }
        });
    });

    return {
        parents: parentFunctions,
        children: reconstructedCalls
    
    };

}

module.exports = { functionContextBuilderPython };