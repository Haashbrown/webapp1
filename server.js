const express = require('express')
const morgan = require('morgan')
const request = require('request')
const mongoose = require('mongoose')
const weather = require('weather-js');
const globalTime = require('global-time');
const app = express();

app.set('view engine', 'ejs');

app.listen(3000)

app.use(morgan('dev'));

(async () => {
  const time = await globalTime('http://worldtimeapi.org/api/timezone/Asia/Manila');
  const date = new Date(time);

  console.log(time);  // 1616323147279.481
  console.log(date);  // 2021-03-21T10:39:07.279Z
})();

app.get('/', function (req, res) {
  weather.find({search: 'Gensan, PH', degreeType: 'C'}, function(
    err, 
    result
  ) {
    if(err) {
      console.log(err);

      res.render('index', {title: 'Home',  heading: 'New Heading', weather: 'Nothing' });
    }
    else{
      console.log(JSON.stringify(result, null, 2));
      res.render('index', {title: 'Home',  heading: 'New Heading', weather: result });
    }
  });

})
app.get('/other', function (req, res) {
  request('https://www.thecocktaildb.com/api/json/v1/1/random.php', function (error, response, body) {
    if(error) {
      res.render('other', {title: 'Other', drink: 'Nothing' });
    } else {
      const data = JSON.parse(body);
      console.log('body:', data);
      res.render('other', {title: 'Other', drink: data });
    }
  });
})



app.use((req, res) => {
  res.render('404', {title: 'Error 404' });
});
