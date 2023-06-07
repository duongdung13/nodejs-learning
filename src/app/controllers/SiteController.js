const Course = require('../models/Course')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class SiteController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                })
            })
            .catch(next)
        //
    }

    // [GET] /search
    search(req, res) {
        res.render('search')
    }

    welcome(req, res) {
        res.send('Welcome to NodeJS!')
    }

    //Page Not Load Layout
    pagelayoutfalse(req, res) {
        res.render('pageLayoutFalse', { layout: false })
    }
}

module.exports = new SiteController()
