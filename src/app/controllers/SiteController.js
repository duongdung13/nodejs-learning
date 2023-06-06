const Course = require('../models/Course')

class SiteController {
    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                courses = courses.map((course) => course.toObject())
                res.render('home', { courses })
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
