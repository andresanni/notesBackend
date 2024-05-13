const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
  logger.error(error.name);

  if (error.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
  } else if(error.name ==='MongoServerError'){
    res.status(400).json({error: 'expected `username` to be unique'});
  }else if(error.name === 'JsonWebTokenError'){
    res.status(401).json({error: 'invalid token'});
  }else if(error.name ==='TokenExpiredError'){
    res.status(401).json({error: 'token expired'})
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpint' });
};

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body); 
  logger.info('Authorization Header:', req.headers['authorization']); 
  logger.info('---');

  next();
};

module.exports = { errorHandler, unknownEndpoint, requestLogger };
