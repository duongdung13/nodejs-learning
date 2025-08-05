export function errorHandler(err, req, res, next) {
    console.error('🔥 Error Handler được gọi!')
    console.error(err.stack)
    
    // Sử dụng status code từ error nếu có, mặc định là 500
    const statusCode = err.status || 500;
    
    res.status(statusCode).json({ 
        message: 'Đã xảy ra lỗi phía server!', 
        error: err.message,
        status: statusCode
    })
}