const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const http = require('http');

const PORT = 3000;
const SOURCE_FILE = path.join(__dirname, 'large_file.txt');
const COMPRESSED_FILE = path.join(__dirname, 'large_file.txt.gz');

function sendResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
}

const server = http.createServer((req, res) => {
    if(req.method === 'GET' && req.url === '/compress') {
        // check source file exists?
        if(!fs.existsSync(SOURCE_FILE)){
            return sendResponse(res, 404, 'Source file not found');
        }
        // create stream: read source file, compress, write to compressed file
        const readStream = fs.createReadStream(SOURCE_FILE);
        const gzipStream = zlib.createGzip();
        const writeStream = fs.createWriteStream(COMPRESSED_FILE);

        // handle errors
        readStream.on('error', (err) => {
            console.error('Error reading source file:', err);
            return sendResponse(res, 500, 'Error reading source file');
        });
        gzipStream.on('error', (err) => {
            console.error('Error compressing file:', err);
            return sendResponse(res, 500, 'Error compressing file');
        });
        writeStream.on('error', (err) => {
            console.error('Error writing compressed file:', err);
            return sendResponse(res, 500, 'Error writing compressed file');
        });

        // handle success
        writeStream.on('finish', () => {
            console.log('File compressed successfully');
            return sendResponse(res, 200, 'Compress success');
        });

        // pipe streams
        readStream.pipe(gzipStream).pipe(writeStream);
       
    }else{
        return sendResponse(res, 404, 'Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});