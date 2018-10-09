require('newrelic');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const path = require('path');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const app = express();
  const port = 3000;
  const { routes } = require('./config.json');

  const proxy = require('http-proxy-middleware');

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
}