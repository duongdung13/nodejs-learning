const fs = require('fs');

function readData(callback) {
    fs.readFile('data.txt', 'utf8', (err, data) => {
      if (err) return callback(err);
      callback(null, data);
    });
  }

  function callback(err, data) {
    if (err) {
        console.error('Lỗi:', err);
    } else {
        console.log('Dữ liệu:', data);
    }
  }

  readData(callback);