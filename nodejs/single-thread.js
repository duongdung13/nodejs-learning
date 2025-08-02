const http = require('http');

const server = http.createServer((req, res) => {
    if( req.url === '/block') {
        const start = Date.now();
        while (Date.now() - start < 5000) {
            // Blocking code
            console.log('Blocking code');
        }
        res.end('Hello World - Blocking code');
        console.log('Hello World - Blocking code');
    } else {
        res.end('Hello World - Non-blocking code');
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});