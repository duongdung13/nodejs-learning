var express = require('express')
var router = express.Router()

const courseController = require('../app/controllers/CourseController')

router.get('/create', courseController.create)
router.post('/store', courseController.store)
router.put('/update/:id', courseController.update)
router.get('/edit/:id', courseController.edit)
router.get('/:slug', courseController.show)
router.get('/', courseController.index)

module.exports = router
