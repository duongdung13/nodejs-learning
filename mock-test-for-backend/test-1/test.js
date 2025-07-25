const http = require('http');

const PORT = 3001;

function sendResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message }));
}


const server = http.createServer((req, res) => {
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({ message: 'Hello World' }));


    return sendResponse(res, 200, 'Hello World');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});