const http = require('http');
const fs = require('fs');
const readline = require('readline');

const PORT = 3000;

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if(req.method !== 'GET') {
        sendResponse(res, 405, { error: 'Method Not Allowed' });
        return;
    }
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(` {}`, url);

    if(url.pathname !== '/count-lines') {
        sendResponse(res, 404, { error: 'Not Found' });
        return;
    }

    const filePath = url.searchParams.get('path');
    console.log(`File path: ${filePath}`);
    if(!filePath) {
        sendResponse(res, 400, { error: 'File path is required' });
        return;
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        output: process.stdout,
        terminal: false
    });

    let lineCount = 0;
    rl.on('line', () => {
        lineCount++;
    });

    rl.on('close', () => {
        sendResponse(res, 200, { lineCount });
    });

    fileStream.on('error', (err) => {
        sendResponse(res, 500, { error: 'Error reading file' });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});