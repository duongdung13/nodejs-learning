const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

function sendResponse(res, statusCode, message, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message, data }));
}

function validateFile(file, res) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return sendResponse(res, 400, 'Invalid file type');
    }

    if (file.size > maxSize) {
        return sendResponse(res, 400, 'File size exceeds the limit');
    }

}

const server = http.createServer((req, res) => {
    if (req.url === '/upload') {
        if (req.method === 'POST') {
            // Lấy boundary từ header
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.startsWith('multipart/form-data')) {
                return sendResponse(res, 400, 'Content-Type must be multipart/form-data');
            }
            const boundary = '--' + contentType.split('boundary=')[1];
            let data = Buffer.alloc(0);
            req.on('data', chunk => {
                data = Buffer.concat([data, chunk]);
            });
            req.on('end', () => {
                // Tách các phần theo boundary
                const parts = data.toString().split(boundary);
                for (let part of parts) {
                    if (part.includes('name="image"')) {
                        // Lấy tên file
                        const matchFilename = part.match(/filename="(.+?)"/);
                        if (!matchFilename) {
                            return sendResponse(res, 400, 'No file uploaded');
                        }
                        const filename = matchFilename[1];
                        // Lấy content-type
                        const matchType = part.match(/Content-Type: (.+)/);
                        const fileType = matchType ? matchType[1].trim() : '';
                        // Lấy binary data
                        const fileDataMatch = part.match(/\r\n\r\n([\s\S]*)\r\n$/);
                        if (!fileDataMatch) {
                            return sendResponse(res, 400, 'File data not found');
                        }
                        let fileData = fileDataMatch[1];
                        // Chuyển về buffer
                        const fileBuffer = Buffer.from(fileData, 'binary');
                        // Validate file
                        const file = { type: fileType, size: fileBuffer.length };
                        if (validateFile(file, res)) {
                            return;
                        }
                        // Lưu file
                        const ext = path.extname(filename).toLowerCase();
                        const newFileName = `${Date.now()}${ext}`;
                        const filePath = path.join(uploadDir, newFileName);
                        fs.writeFile(filePath, fileBuffer, err => {
                            if (err) {
                                return sendResponse(res, 500, 'Internal Server Error');
                            }
                            const url = `/uploads/${newFileName}`;
                            sendResponse(res, 200, 'File uploaded successfully', { url });
                        });
                        return;
                    }
                }
                sendResponse(res, 400, 'No image field found');
            });
        } else {
            sendResponse(res, 405, 'Method Not Allowed');
        }
    } else {
        sendResponse(res, 404, 'Not Found');
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})