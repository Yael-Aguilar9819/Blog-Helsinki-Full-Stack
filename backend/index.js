const app = require('./app') // the actual Express application
const http = require('http');
const express = require('express');
const config = require('./utils/config')

//this creates a server for the app
const server = http.createServer(app)

server.listen(config.PORT, () => {
    // logger.info(`Server running on port ${config.PORT}`)
})