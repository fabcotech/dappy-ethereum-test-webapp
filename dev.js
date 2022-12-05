const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');

const privateKey = fs.readFileSync('./group1.key', 'utf8');
const certificate = fs.readFileSync('./group1.crt', 'utf8');

const dummyServer = (ip, port) => {
  const app = express();
  app.use('/', express.static('dist'));

  const httpsServer = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  const httpServer = http.createServer(app);
  httpServer.listen(port);
  httpsServer.listen(port + 1);
  console.log(`Dev server (http) is running on http://${ip}:${port}`);
  console.log(`Dev server (https) is running on http://${ip}:${port + 1}`);
  console.log('Serving dist/');
};

dummyServer('localhost', 3003);
