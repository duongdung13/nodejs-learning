const http = require('http');
const fs = require('fs');

const PORT = 3000;

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if( req.method !== 'GET' ) {
        sendResponse(res, 405, { error: 'Method not allowed' });
        return;
    }

    if( req.url !== '/transform' ) {
        sendResponse(res, 404, { error: 'Not found' });
        return;
    }
    // Khi client gọi endpoint, server sẽ đọc một file text lớn (input.txt)
    // Dùng stream để biến đổi nội dung: viết hoa toàn bộ chữ cái
    // Trả về file mới (output.txt) đã được chuyển đổi toàn bộ sang chữ in hoa
    // Không load toàn bộ file vào bộ nhớ

    const readStream = fs.createReadStream('input.txt', { encoding: 'utf8' });
    const writeStream = fs.createWriteStream('output.txt', { encoding: 'utf8' });

    // Tạo transform stream để chuyển đổi nội dung thành chữ in hoa
    const { Transform } = require('stream');
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            // Chuyển đổi chunk thành chữ in hoa
            const transformedChunk = chunk.toString().toUpperCase();
            callback(null, transformedChunk);
        }
    });

    // Kết nối các stream: read -> transform -> write
    readStream
        .pipe(transformStream)
        .pipe(writeStream);

    readStream.on('end', () => {
        sendResponse(res, 200, { message: 'File transformed successfully' });
    });

    readStream.on('error', (err) => {
        sendResponse(res, 500, { error: 'Error reading file', details: err.message });
    });
    
    
});

server.listen(PORT, () => {
    console.log(`🔥🔥🔥🔥🔥 Server is running on port ${PORT} 🔥🔥🔥🔥🔥`);
});