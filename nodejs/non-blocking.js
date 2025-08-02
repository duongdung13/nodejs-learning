const fs = require('fs');

console.log('1. Bắt đầu đọc file');

fs.readFile('test.txt', 'utf8', (err, data) => {
  console.log('3. Nội dung file:', data);
});

console.log('2. Kết thúc đoạn code');