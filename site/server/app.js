// app.js

"use strict"

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const express = require( "express" );
const session = require( "express-session" );

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "./config/logger.js" );
const routes = require( "./router.js" );

//////////////////////////////////////
// Express app
//////////////////////////////////////

const app = express();

app.use( require( "./middleware/response-logger.js" ).logMiddleware );
app.use( require( "./middleware/request-logger.js" ).logMiddleware );

// Configure sessions
app.use( session( {
	"secret": process.env.SESSION_SECRET,
	"resave": false,
	"saveUninitialized": true,
	"cookie": { "secure": true }
} ) );

// Set up static files and body parser
app.use( express.static( "public" ) );
app.use( express.urlencoded( { "extended": true } ) );
app.use( express.json( { "limit": "10mb" } ) );

// Routes
app.use( "/", routes );

// Error handler
app.use( function ( err, req, res, next ) {
	logger.error( err );
	res.status( 500 ).json( { "error": "Internal Server Error" } );
} );

module.exports = app;
