const http = require('http');
const express = require('express');
const app = require('./app'); // The actual Express application
const config = require('./utils/config');

// This creates a server for the app
const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
