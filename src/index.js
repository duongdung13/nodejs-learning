const path = require("path");
const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars').engine;

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'public/')));

//HTTP Logger
app.use(morgan('combined'));

//Template engine
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "resources/views"));

//Page home
app.get('/', (req, res) => {
  res.render('home');
});

//Page news
app.get('/news', (req, res) => {
  res.render('news', {
    showTitle: true
  });
});

//Page Not Load Layout
app.get('/page-layout-false', (req, res, next) => {
  res.render('pageLayoutFalse', {layout: false});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})