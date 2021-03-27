const express = require('express')
const morgan = require('morgan')
const request = require('request')
const mongoose = require('mongoose')
const weather = require('weather-js');
const globalTime = require('global-time');
const Person = require('./models/person');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://netninja:test1234@cluster0.jxp4h.mongodb.net/nodedb?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

(async () => {
  const time = await globalTime('http://worldtimeapi.org/api/timezone/Asia/Manila');
  const date = new Date(time);

  // console.log(time);  // 1616323147279.481
  // console.log(date);  // 2021-03-21T10:39:07.279Z
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
      //console.log(JSON.stringify(result, null, 2));
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

app.get('/personlist', function (req, res) {
  Person.find().sort({ createdAt: 1 })
    .then((result) => {
      res.render('personlist', { title: 'Person List', persons: result });
    })
    .catch((err) => {
      console.log(err);
    })
})

app.post('/personlist', (req, res) => {
  const person = new Person(req.body);

  person.save()
    .then((result) => {
      res.redirect('/personlist');
    })
    .catch((err) => {
      console.log(err);
    })
})

app.get('/personlist/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => {
      res.render('personview', { person: result, title: 'Person View' });
    })
    .catch((err) => {
      console.log(err);
    })
})

app.get('/personnew', (req, res) => {
  res.render('personnew', { title: 'Person New' });
})

app.post('/personlistjoin', (req, res) => {
  //console.log(req.body);
  var urlTime = '';
  var countryImg = '';
  var nationality = '';
  if (req.body.timezone == 'Singapore') {
    urlTime = 'http://worldtimeapi.org/api/timezone/Asia/Singapore';
    countryImg = '../assets/singapore.png'
    nationality = 'Singaporean';
  } else if (req.body.timezone == 'Canada') {
    urlTime = 'http://worldtimeapi.org/api/timezone/Etc/GMT-4';
    countryImg = '../assets/canada.png'
    nationality = 'Canadian';
  } else if (req.body.timezone == 'Sweden') {
    urlTime = 'http://worldtimeapi.org/api/timezone/Europe/Stockholm';
    countryImg = '../assets/sweden.png'
    nationality = 'Swedish';
  } else if (req.body.timezone == 'France') {
    urlTime = 'http://worldtimeapi.org/api/timezone/Europe/Paris';
    countryImg = '../assets/france.png'
    nationality = 'French';
  }
  console.log(urlTime, countryImg, nationality);
  // var fullYear = '';
  // var month = '';
  // var day = '';
  // var hours = '';
  // var minutes = '';
  // var seconds = '';
  // (async () => {
  //   const time = await globalTime(urlTime);
  //   const date = new Date(time);

  //   fullYear = date.getFullYear();
  //   month = date.getMonth();
  //   day = date.getDate();
  //   hours = date.getHours();
  //   minutes = date.getMinutes();
  //   seconds = date.getSeconds();
  // })()
  // console.log(fullYear, month, day, hours, minutes, seconds);
  request(urlTime, function (error, response, body) {
    if(error) {
      console.log(error);
    } else {
      const data = JSON.parse(body);
      console.log('body:', data);
      //res.render('other', {title: 'Other', drink: data });
      Person.find().sort({ createdAt: 1 })
        .then((result) => {
          res.render('personlist', { title: 'Person List', persons: result, nationality: nationality, countryImg: countryImg, time: data });
        })
        .catch((err) => {
          console.log(err);
        })
    }
  });

  // Person.find().sort({ createdAt: 1 })
  //   .then((result) => {
  //     res.render('personlist', { title: 'Person List', persons: result, nationality: nationality, countryImg: countryImg, time: data });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   })
})

app.use((req, res) => {
  res.render('404', {title: 'Error 404' });
});
