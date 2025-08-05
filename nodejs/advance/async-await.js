const fs = require('fs');

async function showData() {
    try {
      const data = await readFilePromise('data.txt');
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  }

showData();

function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
  