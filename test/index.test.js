const { exec } = require('child_process');
const { getAllFiles } = require('../src/Utils/traverseDirectory');


// Function to run Jest on a single test file
function runJestOnFile(filePath) {
  return new Promise((resolve, reject) => {
    const command = `npx jest ${filePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}



// Function to run Jest on all test files in a directory
async function runJestOnFilesInDirectory(directory) {
  const files = getAllFiles(directory);
  console.log(files);
  for (const file of files) {
    if (file.endsWith('.test.js')) {
      console.log(`Running Jest on ${file}`);
      try {
        const result = await runJestOnFile(file);
        console.log(result.stdout);
      } catch (error) {
        console.error(`Error running Jest on ${file}: ${error.message}`);
      }
    }
  }
}

// Specify the directory containing test files
const testDirectory = '/home/ubuntu/static-call-graph/test/src';

// Run Jest on all test files in the specified directory
runJestOnFilesInDirectory(testDirectory)
  .then(() => console.log('All test files executed successfully.'))
  .catch(error => console.error(`Error: ${error.message}`));
