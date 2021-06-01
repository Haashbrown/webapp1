const express = require('express')
const morgan = require('morgan')
const request = require('request')
const mongoose = require('mongoose')
const weather = require('weather-js');
const globalTime = require('global-time');
const fetch = require('node-fetch');
const Person = require('./models/person');
let datetime = "";

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
})();

app.get('/', function (req, res) {
  Promise.all([
      fetch('http://worldtimeapi.org/api/timezone/Asia/Singapore'),
      fetch('http://worldtimeapi.org/api/timezone/Etc/GMT-4'),
      fetch('http://worldtimeapi.org/api/timezone/Europe/Stockholm'),
      fetch('http://worldtimeapi.org/api/timezone/Europe/Paris')
  ]).then(function (responses) {
      return Promise.all(responses.map(function (response) {
          return response.json();
      }));
  }).then(function (data) {
      datetime = data;
      res.render('index', {title: 'Home' });
  }).catch(function (error) {
      console.log(error);
  })

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
      res.render('personlist', { title: 'Person List', persons: result, dataList: datetime });
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

app.use((req, res) => {
  res.render('404', {title: 'Error 404' });
});
