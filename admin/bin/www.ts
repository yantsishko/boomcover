#!/usr/bin/env node
'use strict';

// module dependencies.
import config from '@config';
import * as http from 'http';
import app from '../app';

import log from '../components/logger';

// get port from environment and store in Express.
const port = normalizePort(config.admin.port);
app.set('port', port);

// create http server
const server = http.createServer(app);

// listen on provided ports
server.listen(port);

// add error handler
server.on('error', onError);

// start listening on port
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const portToNormalize = parseInt(val, 10);

  if (isNaN(portToNormalize)) {
    // named pipe
    return val;
  }

  if (portToNormalize >= 0) {
    // port number
    return portToNormalize;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  log.info('Listening on ' + bind);
}
