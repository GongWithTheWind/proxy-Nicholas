require('newrelic');

const express = require('express');
// const morgan = require('morgan');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const proxy = require('http-proxy-middleware');
const { routes } = require('./config.json');

// app.use(morgan('dev'));
app.use('/homes/:homeId', express.static(path.join(__dirname, 'public')));

for (route of routes) {
  app.use(route.route,
      proxy({
          target: route.address

      })
  );
}


app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
