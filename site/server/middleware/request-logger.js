// requst-logger.js

"use strict";

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "../config/logger" );

//////////////////////////////////////
// Request Logger Middleware
//////////////////////////////////////

const requestLogger = {};

// Custom logging middleware with different colors for request types
requestLogger.logMiddleware = function logMiddleware( req, res, next ) {
	const colorReset = "\x1b[0m";
	const colorURL = "\x1b[90m";

	let colorMethod;
	switch ( req.method ) {
		case "GET":
			colorMethod = "\x1b[32m";
			break;
		case "POST":
			colorMethod = "\x1b[33m";
			break;
		case "PUT":
			colorMethod = "\x1b[36m";
			break;
		case "DELETE":
			colorMethod = "\x1b[31m";
			break;
		default:
			colorMethod = "\x1b[0m";
	}

	// eslint-disable-next-line no-console
	
	logger.info(
		`Received ${colorMethod}[${req.method}]${colorReset} request for ` +
		`${colorURL}${req.url}${colorReset}`
	);
	next();
};

module.exports = requestLogger;
