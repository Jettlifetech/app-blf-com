const fs = require('fs');
const path = '/var/www/app.brokenlinksfinder.com/user-reports/test-file1.csv';

fs.writeFile(path, 'Test content', (err) => {
  if (err) {
    return console.error('Error writing file:', err);
  }
  console.log('File written successfully!');
});
