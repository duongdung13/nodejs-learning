import express from 'express'
const router = express.Router()
import { checkAdmin } from '../app.js'

router.get('/', checkAdmin, (req, res) => {
    res.status(200).json({ message: 'Danh sách user' })
})
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Xem 1 user: ${req.params.id}` })
})

export default router
