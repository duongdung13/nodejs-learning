const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// check folder data if not exist, create it
if(!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

function validateFile(file, res) {
    const allowedTypes = ['text/csv'];
    const maxSize = 10 * 1024 * 1024;

    if(!allowedTypes.includes(file.type)) {
        sendResponse(res, 400, { error: 'File type is not allowed' });
        return false;
    }

    if(file.size > maxSize) {
        sendResponse(res, 400, { error: 'File size exceeds the limit' });
        return false;
    }

    return true;
}

function analyzeCSV(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const numberOfRows = lines.length;
        
        // Đếm số cột từ dòng đầu tiên (header)
        const firstLine = lines[0];
        const columns = firstLine.split(',').length;
        
        return {
            rows: numberOfRows,
            columns: columns
        };
    } catch (error) {
        console.error('Error analyzing CSV:', error);
        return {
            rows: 0,
            columns: 0,
            error: 'Could not analyze CSV file'
        };
    }
}

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if(req.method !== 'POST') {
        sendResponse(res, 405, { error: 'Method not allowed' });
        return;
    }

    if(req.url !== '/upload-csv') {
        sendResponse(res, 404, { error: 'Not found' });
        return;
    }

    const contentType = req.headers['content-type'];
    if(!contentType || !contentType.startsWith('multipart/form-data')) {
        sendResponse(res, 400, { error: 'Content-Type must be multipart/form-data' });
        return;
    }

    const boundary = '--' + contentType.split('boundary=')[1];
    let data = Buffer.alloc(0);
    req.on('data', chunk => {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => {
        const parts = data.toString().split(boundary);

        for(let part of parts) {
            if(part.includes('name="file"')) {
                const fileDataMatch = part.match(/\r\n\r\n([\s\S]*)\r\n$/);
                if(!fileDataMatch) {
                    sendResponse(res, 400, { error: 'File data not found' });
                    return;
                }
                let fileData = fileDataMatch[1];
                const fileBuffer = Buffer.from(fileData, 'binary');

                const matchType = part.match(/Content-Type: (.+)/);
                        const fileType = matchType ? matchType[1].trim() : '';

                const file = { type: fileType, size: fileBuffer.length };
                if (!validateFile(file, res)) {
                    return;
                }

                const filePath = path.join(__dirname, 'data', 'data.csv');
                fs.writeFileSync(filePath, fileBuffer);
                
                // Phân tích file CSV để đếm số dòng và số cột
                const csvInfo = analyzeCSV(filePath);
                
                sendResponse(res, 200, { 
                    message: 'File uploaded successfully',
                    fileInfo: {
                        size: fileBuffer.length,
                        rows: csvInfo.rows,
                        columns: csvInfo.columns
                    }
                });
                return;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});