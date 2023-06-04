class SiteController{
    
    // [GET] /
    index(req, res) {
        res.render('home');
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }

    welcome(req, res) {
        res.send('Welcome to NodeJS!');
    }

    //Page Not Load Layout
    pagelayoutfalse(req, res) {
        res.render('pageLayoutFalse', {layout: false});
    }

}

module.exports = new SiteController;