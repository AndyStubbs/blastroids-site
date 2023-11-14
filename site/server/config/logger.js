// logger.js

"use strict";

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const fs = require( "fs" );
const bunyan = require( "bunyan" );
const formatOut = require( "bunyan-format" );

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const globals = require( "./globals" );

const LOG_COUNT = 5;
const LOG_DIR = "./logs";

let logger;

// Create the log directory if it does not exist
fs.mkdirSync( LOG_DIR, { "recursive": true } );

// Logger configuration
if ( process.env.LOG_LEVEL === "debug" ) {
	logger = bunyan.createLogger( {
		"name": globals.BLOG_NAME,
		"level": "debug",
		"src": true,
		"serializers": {
			"err": bunyan.stdSerializers.err
		},
		"streams": [ {
			"stream": formatOut( { "outputMode": "short" } ),
			"level": "debug"
		}, {
			"type": "rotating-file", "path": `${LOG_DIR}/debug.log`,
			"level": "debug", "period": "1d", "count": LOG_COUNT
		}, {
			"type": "rotating-file", "path": `${LOG_DIR}/error.log`,
			"level": "error", "period": "1d", "count": LOG_COUNT 
		} ]
	} );
} else if ( process.env.LOG_LEVEL === "info" ) {
	logger = bunyan.createLogger( {
		"name": "fountain-os",
		"level": "info",
		"src": true,
		"streams": [ {
			"type": "rotating-file", "path": `${LOG_DIR}/info.log`,
			"level": "info", "period": "1d", "count": LOG_COUNT
		}, {
			"type": "rotating-file", "path": `${LOG_DIR}/error.log`,
			"level": "error", "period": "1d", "count": LOG_COUNT
		} ]
	} );
} else {
	logger = bunyan.createLogger( {
		"name": "fountain-os",
		"level": "error",
		"streams": [ {
			"type": "rotating-file", "path": `${LOG_DIR}/error.log`,
			"level": "error", "period": "1d", "count": LOG_COUNT
		} ]
	} );
}

module.exports = logger;
