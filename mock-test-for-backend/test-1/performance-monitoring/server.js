const http = require('http');
const url = require('url');

const PORT = 3000;
const THRESHOLD = 200; // millisecond
const responseTimes = {};

function sendResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
}

function logResponse(endpoint, duration) {
    if( !responseTimes[endpoint] ) {
        responseTimes[endpoint] = [];
    }

    responseTimes[endpoint].push(duration);

    console.log(`Response time for ${endpoint} is ${duration}ms`);

    if( duration > THRESHOLD ) {
        console.warn(`[ALERT] Response time for ${endpoint} is ${duration}ms`);
    }
}

function getReport(){
    const report = {};

    for( const endpoint in responseTimes ) {
        const times = responseTimes[endpoint];
        const average = times.reduce((sum, time) => sum + time, 0) / times.length;
        report[endpoint] = {
            average: `${average.toFixed(2)}ms`,
        };
    }

    return report;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    console.log(`parsedUrl: {}`, parsedUrl);
    const pathname = parsedUrl.pathname;
    console.log(`pathname: ${pathname}`);
    const startTime = Date.now();

    if( req.method === 'GET') {
        console.log(`req.method: ${req.method}`);
        if( pathname === '/api/fast' ) {
            sendResponse(res, 200, 'Fast response');
        }

        if( pathname === '/api/slow' ) {
            await sleep(250);
         sendResponse(res, 200, 'Slow response');
        }

        if( pathname === '/api/medium' ) {
            await sleep(100);
            sendResponse(res, 200, 'Medium response');
        }

        if( pathname === '/api/report' ) {
           const report = getReport();
           sendResponse(res, 200, report);
           
         //  sendResponse(res, 200, 'Report response');

        }

        const duration = Date.now() - startTime;
        logResponse(pathname, duration);
    }else{
        return sendResponse(res, 405, 'Method Not Allowed');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🔥🔥🔥🔥🔥`);
});