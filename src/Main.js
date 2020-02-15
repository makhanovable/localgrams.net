let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const https = require('https');
const fs = require('fs');
let apiRoutes = require("./ApiRoutes");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let port = 80;
app.get('/', function (request, response) {
  response.sendFile('html/index.html', {root: __dirname});
});
app.use('/api', apiRoutes);

try {
  const path = require("path");
  const key = fs.readFileSync(path.resolve(__dirname, 'ssl/localgrams.key'));
  const cert = fs.readFileSync(path.resolve(__dirname, 'ssl/localgrams.crt'));
  https.createServer({
    cert: cert,
    key: key,
  }, app).listen(port, function () {
    console.log("Running https GramCore on port " + port);
  });
} catch (e) {
  app.listen(port, function () {
    console.log("Running http GramCore on port " + port);
  });
}