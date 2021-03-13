const http = require('http');
const fs = require('fs');
const weather = require('weather-js');
weather.find({search: 'Gensan, PH', degreeType: 'C'}, function(err, result) {
  if(err) console.log(err);
 
  console.log(JSON.stringify(result, null, 2));
});
const server = http.createServer((req, res) => {
    console.log(req.url);

    res.setHeader('Content-Type', 'text/html');
    let urll = './views/';

    if (req.url == '/') {
        urll += 'index.html';
        res.statusCode == 200;
    } else if (req.url == '/about') {
        urll += 'about.html';
        res.statusCode == 200;
    } else if (req.url == '/contact') {
        urll += 'contact.html';
        res.statusCode == 200;
    } else {
        urll += '404.html';
        res.statusCode == 404;
    }

    fs.readFile(urll, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.end(data);
        }
    })
});

server.listen(3000, 'localhost', () => {
    console.log('listening');
});