const http = require('http');
const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
});

app.use(cors());
app.use(express.json());

// This middleware prints every incoming request, no matter the method  
app.use(middleware.requestLogger); 

//Being a router means that every endpoint + the post URL will be redirected here
app.use('/api/blogs', blogRouter);

const PORT = 3003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
