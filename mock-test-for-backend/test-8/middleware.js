const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if(req.method !== 'GET') {
        sendResponse(res, 405, { error: 'Method Not Allowed' });
        return;
    }

    if(req.url !== '/api/path') {
        sendResponse(res, 404, { error: 'Not Found' });
        return;
    }

    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        if(duration > 300) {
            console.log(`ALERT: [${new Date().toISOString()}] GET /api/path took ${duration}ms`);
        }
        console.log(`INFO: [${new Date().toISOString()}] GET /api/path took ${duration}ms`);

        const logMessage = `[${new Date().toISOString()}] GET /api/path took ${duration}ms`;
        console.log(logMessage);
        
        // Ghi log vào file logs.txt
        const logStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' });
        logStream.write(logMessage + '\n');
        logStream.end();
    });

    res.on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });

    sendResponse(res, 200, { message: 'OK 2' });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});