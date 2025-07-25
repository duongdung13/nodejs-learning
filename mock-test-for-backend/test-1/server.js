const http = require('http');
const { StringDecoder } = require('string_decoder');

const PORT = 3000;

const usersDB = {};

function isValidateUsername(username) {
    return /^[a-zA-Z0-9]+$/.test(username);
}

function isValidateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidatePassword(password) {
    return typeof password === 'string' && password.length >= 8;
}

function sendResponse(res, statusCode, message) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        message
    }));
}

function parseRawHeaders(rawHeaders) {
    const headers = {};
    for (let i = 0; i < rawHeaders.length; i += 2) {
      const key = rawHeaders[i].toLowerCase(); // header keys are case-insensitive
      const value = rawHeaders[i + 1];
      headers[key] = value;
    }
    return headers;
  }

const server = http.createServer((req, res) => {
    console.log(`parseRawHeaders ::: `, parseRawHeaders(req.rawHeaders));
    if( req.method === 'POST' && req.url === '/register') {
        const decoder = new StringDecoder('utf-8');
        let buffer = '';

        req.on('data', (chunk) => {
            buffer += decoder.write(chunk);
            console.log(`data buffer ::: `, buffer);
        });

        req.on('end', () => {
            buffer += decoder.end();
            console.log(`end buffer ::: `, buffer);

            let data;
            try {
                data = JSON.parse(buffer);
            } catch (error) {
                return sendResponse(res, 400, 'Invalid JSON');
            }

            const { username, email, password } = data;

            if(!username || !isValidateUsername(username)) {
                return sendResponse(res, 400, 'Invalid username');
            }

            if(!email || !isValidateEmail(email)) {
                return sendResponse(res, 400, 'Invalid email');
            }

            if(!password || !isValidatePassword(password)) {
                return sendResponse(res, 400, 'Invalid password');
            }

            // store user in memory
            usersDB[email] = {
                username,
                email,
                password
            };

            console.log(`Confirmation email sent to ${email}`);

            console.log(`DB after register: `,usersDB);

            return sendResponse(res, 201, 'User registered successfully');
        });
    }else{
        return sendResponse(res, 404, 'Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🔥🔥🔥🔥🔥`);
});