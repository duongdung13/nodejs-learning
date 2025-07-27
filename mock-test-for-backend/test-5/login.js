const http = require('http');
const crypto = require('crypto');
const { StringDecoder } = require('string_decoder');

const PORT = 3000;
const userStore = {};

const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const generateToken = (email, timestamp) => {
    return Buffer.from(`${email}:${timestamp}`).toString('base64');
};

const server = http.createServer((req, res) => {
    if(req.method !== 'POST') {
        sendResponse(res, 405, { error: 'Method Not Allowed' });
        return;
    }

    if(req.url !== '/login') {
        sendResponse(res, 404, { error: 'Not Found' });
        return;
    }

    const decoder = new StringDecoder('utf-8'); 
    let buffer = '';

    req.on('data', (chunk) => {
        buffer += decoder.write(chunk);
    });

    req.on('end', () => {
        buffer += decoder.end();
        
        // Kiểm tra buffer có rỗng không
        if (!buffer || buffer.trim() === '') {
            sendResponse(res, 400, { error: 'Request body is empty' });
            return;
        }
        
        let parsedData;
        try {
            parsedData = JSON.parse(buffer);
        } catch (error) {
            sendResponse(res, 400, { error: 'Invalid JSON format in request body' });
            return;
        }
        
        // Kiểm tra parsedData có phải là object và không null không
        if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
            sendResponse(res, 400, { error: 'Request body must be a valid JSON object' });
            return;
        }
        
        const { email, password } = parsedData;
        console.log(`Input: email: ${email}, password: ${password}`);
        if(!email || !password) {
            sendResponse(res, 400, { error: 'Email and password are required' });
            return;
        }
        
        const hashedPassword = hashPassword(password);
        console.log(`Hashed password: ${hashedPassword}`);
        
        if(userStore[email] && userStore[email].password === hashedPassword) {
            const token = generateToken(email, Date.now());
            console.log(`Token: ${token}`);
            sendResponse(res, 200, { token });
        } else {
            // Do bị sai nên lưu tạm vào biến để lần sau login đúng
            userStore[email] = { password: hashedPassword };

            console.log(`User store: ${JSON.stringify(userStore)}`);

            sendResponse(res, 401, { error: 'Invalid credentials' });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});