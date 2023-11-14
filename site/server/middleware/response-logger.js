// response-logger.js

"use strict";

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "../config/logger" );

//////////////////////////////////////
// Response Logger Middleware
//////////////////////////////////////

const responseLogger = {};

responseLogger.logMiddleware = function logMiddleware( req, res, next ) {

	// Colors for terminal output
	const colorReset = "\x1b[0m";

	// Light cyan for URL
	const colorUrl = "\x1b[90m";

	function colorStatus( statusCode ) {
		if( statusCode >= 200 && statusCode < 300 ) {
			// Green for 2xx status codes
			return "\x1b[32m";
		} else if( statusCode >= 300 && statusCode < 400 ) {
			// Light blue for 3xx status codes
			return "\x1b[94m";
		} else if( statusCode >= 400 && statusCode < 500 ) {
			// Yellow for 4xx status codes
			return "\x1b[33m";
		} else if( statusCode >= 500 ) {
			// Red for 5xx
			return "\x1b[31m";
		} else {
			// Default color (reset)
			return "\x1b[0m";
		}
	}

	const originalWrite = res.write;
	const originalEnd = res.end;
	const chunks = [];

	res.write = function ( chunk ) {
		chunks.push( chunk );
		originalWrite.apply( res, arguments );
	};

	res.end = function ( chunk ) {
		if ( chunk ) {
			chunks.push( chunk );
		}

		//const responseBody = Buffer.concat( chunks ).toString( "utf8" );
		const responseStatusColor = colorStatus( res.statusCode );

		// eslint-disable-next-line no-console
		logger.info(
			`\tOutgoing response with ${responseStatusColor}[${res.statusCode}]${colorReset} ` +
			`status for ${colorUrl}${req.url}${colorReset}`
		);

		// Restore original methods and send the response
		res.write = originalWrite;
		res.end = originalEnd;
		res.end( chunk );
	};

	next();
};

module.exports = responseLogger;
