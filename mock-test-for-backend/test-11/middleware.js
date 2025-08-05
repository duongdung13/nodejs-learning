const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const LOG_FILE = path.join(__dirname, 'errors.log');
const errorStats = {};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function logError(request, error) {
    console.log(`logError url {}`, request.url);
    const timestamp = new Date().toISOString();
    const endpoint = request.url;
    const message = error.message || `Unknown error`;

    const logLine = `${timestamp} - ${endpoint} - ${message}\n`;
    console.log(`logLine: {}`, logLine);
    fs.appendFileSync(LOG_FILE, logLine, 'utf8', (err) => {
        if(err) {
            console.error('Error writing to log file:', err);
        }
    });
    
    // Update error stats
    if(!errorStats[endpoint]) {
        errorStats[endpoint] = 0;
    }
    errorStats[endpoint]++;
}

function printErrorStats() {
    console.log(`Thống kê lỗi mỗi phút theo endpoint: `);
    Object.keys(errorStats).forEach(endpoint => {
        console.log(`${endpoint}: ${errorStats[endpoint]} lỗi`);
    });

    for(const key in errorStats) {
        delete errorStats[key];
    }
}

setInterval(printErrorStats, 60000);

async function handleError(req, res, error) {
    console.log(`handleError req.url {}`, req.url);
    await logError(req, error);

    sendResponse(res, 500, { error: 'Internal server error' });
}

function startErrorStatsTimer() {
    setInterval(printErrorStats, 60000);
}

const server = http.createServer((req, res) => {
    if(req.method !== 'GET') {
        sendResponse(res, 405, { error: 'Method not allowed' });
        return;
    }

    if(req.url !== '/fail' && req.url !== '/log') {
        sendResponse(res, 404, { error: 'Not found' });
        return;
    }

    try{
        if(req.url === '/fail') {
            throw new Error('This is a test error');
        }


        sendResponse(res, 200, { message: 'Hello, World!' });
    }catch(error){
      console.log(`req.url: {}`, req.url);
        handleError(req, res, error);
    }
});

server.listen(PORT, () => {
    console.log(`🔥🔥🔥🔥🔥 Server is running on port ${PORT} 🔥🔥🔥🔥🔥`);
});