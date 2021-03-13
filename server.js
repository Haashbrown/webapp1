const express = require('express')
const morgan = require('morgan')
const { students } = require('./students')
const app = express();

app.set('view engine', 'ejs');

app.listen(3000)

app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Home', studentData: students });
  //res.sendFile('./views/index.html', { root: __dirname });
})
app.get('/about', function (req, res) {
  res.render('about', {title: 'About Us',  heading: 'New Heading' });
  //res.sendFile('./views/about.html', { root: __dirname });
})
app.get('/contact', function (req, res) {
  res.render('contact', {title: 'Contacts' });
  //res.sendFile('./views/contact.html', { root: __dirname });
})
app.get('/aboutus', function (req, res) {
  res.redirect('/about');
})


app.use((req, res) => {
  res.render('404', {title: 'Error 404' });
  //res.status(404).sendFile('./tobedeleted/404.html', { root: __dirname });
});
