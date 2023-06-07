const Course = require('../models/Course')
const {
    mongooseToObject,
    mutipleMongooseToObject,
} = require('../../util/mongoose')

class CourseController {
    // [GET] /course
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                })
            })
            .catch(next)
    }

    // [GET] /course/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                res.render('courses/show', { course: mongooseToObject(course) })
            })
            .catch(next)
    }

    // [GET] /course/create
    create(req, res, next) {
        res.render('courses/create')
    }

    // [POST] /course/create
    store(req, res, next) {
        req.body.image = `http://i3.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg`
        const course = new Course(req.body)
        course.save().then(() => res.redirect('/'))
    }
}

module.exports = new CourseController()
