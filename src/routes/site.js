var express = require('express')
var router = express.Router()

const siteController = require('../app/controllers/SiteController')

router.use('/search', siteController.search)
router.use('/welcome', siteController.welcome)
router.use('/page-layout-false', siteController.pagelayoutfalse)
router.use('/', siteController.index)

module.exports = router
