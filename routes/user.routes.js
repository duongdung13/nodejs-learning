import express from 'express'
const router = express.Router()
import { checkAdmin } from '../app.js'
import jwt from 'jsonwebtoken'

router.get('/', checkAdmin, (req, res) => {
    res.status(200).json({ message: 'Danh sách user' })
})

router.get('/error', (req, res, next) => {
    const error = new Error('Lỗi test')
    error.status = 400
    next(error)
})

router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Xem 1 user: ${req.params.id}` })
})

router.post('/login', (req, res) => {
    console.log(req.body)
    const { username, password } = req.body
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: 'Vui lòng nhập username và password' })
    }
    if (username === 'user' && password === '123456') {
        const user = {
            username,
            role: 'user',
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
        }

        const token = generateToken(user)

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                user,
                token,
            },
        })
    }
    return res
        .status(401)
        .json({ message: 'Tài khoản hoặc mật khẩu không chính xác' })
})

function generateToken(user) {
    return jwt.sign(user, 'secret', { expiresIn: '1h' })
}

export default router
