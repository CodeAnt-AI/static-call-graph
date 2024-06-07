const fs = require('fs');
const path = require('path');

function getAllFiles(directory) {
    let files = [];
    const items = fs.readdirSync(directory);
    items.forEach(item => {
      const fullPath = path.join(directory, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        files = files.concat(getAllFiles(fullPath)); // Recursively get files in subdirectories
      } else {
        files.push(fullPath);
      }
    });
    return files;
  }

module.exports = { getAllFiles};