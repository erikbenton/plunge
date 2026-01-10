const logger = require("./consoleLogger");

const requestLogger = (request, response, next) => {
  logger.info("Method", request.method);
  logger.info("Path", request.path);

  if (request.body) { logger.info("Body", request.body); }

  if (request.session) { logger.info(request.session); }

  logger.info("---");

  next();
}

module.exports = requestLogger;