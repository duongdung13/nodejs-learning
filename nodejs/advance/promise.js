const fs = require('fs');

function readFilePromise(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
  
  readFilePromise('data.txt')
    .then(data => console.log(data))
    .catch(err => console.error(err));