const http = require('http');
const PORT = 3000;

const rateLimiter = {
    ips: new Map(),
    maxRequests: 5,
    window: 60000, // 1 phút
};

const rateLimiterMiddleware = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`::: ip: ${ip}`);
    const now = Date.now();
    
    // Xóa các entry cũ (quá 1 phút)
    for (const [key, data] of rateLimiter.ips.entries()) {
        if (now - data.timestamp > rateLimiter.window) {
            rateLimiter.ips.delete(key);
        }
    }
    
    // Kiểm tra và cập nhật số lượng request
    if (!rateLimiter.ips.has(ip)) {
        rateLimiter.ips.set(ip, {
            count: 1,
            timestamp: now
        });
    } else {
        const data = rateLimiter.ips.get(ip);
        data.count += 1;
        rateLimiter.ips.set(ip, data);
    }
    
    const currentData = rateLimiter.ips.get(ip);
    console.log(`::: IP ${ip} đã gọi ${currentData.count} lần trong 1 phút`);
    
    if (currentData.count > rateLimiter.maxRequests) {
        console.log(`::: IP ${ip} đã gọi tối đa ${rateLimiter.maxRequests} lần trong 1 phút`);
        sendResponse(res, 429, 'Too Many Requests - Chỉ được gọi tối đa 5 lần trong 1 phút');
        return;
    }
    
    next();
};

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(data);
}

const server = http.createServer((req, res) => {
    if(req.method !== 'GET') {
        sendResponse(res, 405, 'Method Not Allowed');
        return;
    }

    if(req.url !== '/api/data') {
        sendResponse(res, 404, 'Not Found');
        return;
    }

    rateLimiterMiddleware(req, res, () => {
        sendResponse(res, 200, 'Hello World');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});