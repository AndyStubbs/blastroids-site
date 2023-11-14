// server.js

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const https = require( "https" );
require( "dotenv" ).config();

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "./server/config/logger.js" );

//////////////////////////////////////
// Server Setup
//////////////////////////////////////

// Initialize the data store
require( "./server/data/init-data.js" );

// Import Custom Modules
const app = require( "./server/app.js" );

// Start server
const server = https.createServer( {
	"key": process.env.SERVER_KEY,
	"cert": process.env.SERVER_CERT
}, app );

try {
	server.listen( process.env.PORT, process.env.HOSTNAME, () => {
		logger.info( `Server running at https://${process.env.HOSTNAME}:${process.env.PORT}/` );
	} );
} catch( err ) {
	logger.error( err );
}
