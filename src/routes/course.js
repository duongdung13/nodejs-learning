var express = require('express')
var router = express.Router()

const courseController = require('../app/controllers/CourseController')

router.use('/:slug', courseController.show)
router.use('/', courseController.index)

module.exports = router
