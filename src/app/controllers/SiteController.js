const Course = require('../models/Course')

class SiteController {
    // [GET] /
    index(req, res) {
        Course.find().then((courses) => {
            // xử lý kết quả trả về
            res.json(courses);
          }).catch((err) => {
            // xử lý lỗi
            res.status(400).json({'error': err});
          });

       // res.render('home')
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
