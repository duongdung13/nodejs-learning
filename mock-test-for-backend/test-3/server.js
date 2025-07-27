const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = 3000;

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const validateUrl = (url) => {
    return url.startsWith('http') || url.startsWith('https');
}

const server = http.createServer((req, res) => {
    try {
        if(req.method !== 'GET') {
            sendResponse(res, 405, { error: 'Method Not Allowed' });
            return;
        }

        if(!req.url.startsWith('/proxy')) {
            sendResponse(res, 404, { error: 'Not Found' });
            return;
        }

        const parseUrl = new URL(req.url, `http://${req.headers.host}`);
        console.log(`::: parseUrl: ${parseUrl}`);
        const target = parseUrl.searchParams.get('url');
        console.log(`::: target: ${target}`);

        if(!target) {
            sendResponse(res, 400, { error: 'Missing url parameter' });
            return;
        }

        if(!validateUrl(target)) {
            sendResponse(res, 400, { error: 'Invalid URL' });
            return;
        }

       const proxyModule = target.protocol === 'https:' ? https : http;
       const proxyRequest = proxyModule.get(target, (proxyResponse) => {
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            proxyResponse.pipe(res);
       });

       proxyRequest.setTimeout(10000, () => {   
        proxyRequest.destroy();
        sendResponse(res, 504, { error: 'Request Timeout' });
       });

       proxyRequest.on('error', (error) => {
        console.log(`::: error message: ${error.message}`);
        sendResponse(res, 502, { error: 'Internal Server Error' });
       });

    } catch (error) {
        console.log(`::: error message: ${error.message}`);
        sendResponse(res, 500, { error: 'Internal Server Error' });
    }
});

server.listen(PORT, () => {
    console.log(`::: Server is running at http://localhost:${PORT}`);
});