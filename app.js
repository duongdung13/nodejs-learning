import express from 'express'
const app = express()
const PORT = 3000
import userRouter from './routes/user.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import cors from 'cors'
import helmet from 'helmet'
import expressRateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'

const limiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // 100 request
    message: 'Too many requests, please try again later.',
})

function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next() // chuyển sang middleware/route tiếp theo
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized 1' })
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, 'secret')
        console.log(`decoded {}`, decoded)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized 2' })
    }
}

function authorizationRole(...allowedRoles) {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) next()
        else res.status(403).json({ message: 'Bạn không có quyền truy cập' })
    }
}

export function checkAdmin(req, res, next) {
    if (req.headers['admin'] === 'true') next()
    else res.status(403).send('Bạn không phải admin')
}

app.use(cors()) // tất cả domain đều được truy cập
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// })); // chỉ domain localhost:3000 được truy cập
app.use(helmet())
app.use(limiter)
app.use(logger)
app.use(express.json())
app.use('/user', userRouter)

app.get('/public', (req, res) => {
    res.status(200).json({ message: 'Đây là nội dung công khai!' })
})

app.get('/private', authMiddleware, authorizationRole('user'), (req, res) => {
    res.status(200).json({
        message: 'Bạn đã truy cập nội dung riêng tư thành công!',
        data: {
            user: req.user,
        },
    })
})

app.use((req, res, next) => {
    res.status(404).json({ message: 'Không tìm thấy đường dẫn!' })
})

// Error handler middleware - phải đặt sau tất cả routes
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
})
