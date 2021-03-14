const express = require('express')
const morgan = require('morgan')
const request = require('request')
const { students } = require('./students')
const weather = require('weather-js');
const app = express();

app.set('view engine', 'ejs');

app.listen(3000)

app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Home', studentData: students });
})
app.get('/about', function (req, res) {
  weather.find({search: 'Gensan, PH', degreeType: 'C'}, function(
    err, 
    result
  ) {
    if(err) {
      console.log(err);

      res.render('about', {title: 'About Us',  heading: 'New Heading', weather: 'Nothing' });
    }
    else{
      console.log(JSON.stringify(result, null, 2));
      res.render('about', {title: 'About Us',  heading: 'New Heading', weather: result });
    }
  });

})
app.get('/contact', function (req, res) {
  request('https://www.thecocktaildb.com/api/json/v1/1/random.php', function (error, response, body) {
    if(error) {
      res.render('contact', {title: 'Contacts', drink: 'Nothing' });
    } else {
      const data = JSON.parse(body);
      console.log('body:', data);
      res.render('contact', {title: 'Contacts', drink: data });
    }
  });
})
app.get('/aboutus', function (req, res) {
  res.redirect('/about');
})


app.use((req, res) => {
  res.render('404', {title: 'Error 404' });
});
