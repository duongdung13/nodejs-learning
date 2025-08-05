import express from 'express'
const app = express()
const PORT = 3000
import userRouter from './routes/user.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next() // chuyển sang middleware/route tiếp theo
}

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']
    if (token === 'secret123') {
        next() // hợp lệ, cho qua
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid token' })
    }
}

export function checkAdmin(req, res, next) {
    if (req.headers['admin'] === 'true') next()
    else res.status(403).send('Bạn không phải admin')
}
app.use(logger);


app.use('/user', userRouter)

app.get('/public', (req, res) => {
    res.status(200).json({ message: 'Đây là nội dung công khai!' })
})

app.get('/private', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Bạn đã truy cập nội dung riêng tư thành công!',
    })
})

app.use((req, res, next) => {
    res.status(404).json({ message: 'Không tìm thấy đường dẫn!' })
})

// Error handler middleware - phải đặt sau tất cả routes
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
