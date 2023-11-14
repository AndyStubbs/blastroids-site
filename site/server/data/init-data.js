// init-data.js

"use strict";

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const fs = require( "fs" );
const bcrypt = require( "bcryptjs" );

//////////////////////////////////////
// Local libs
//////////////////////////////////////

const globals = require( "../config/globals" );
const logger = require( "../config/logger" );
const util = require( "../config/util" );

//////////////////////////////////////
// Initialize Data for Testing
//////////////////////////////////////

const directories = [
	globals.DATA_DIR, globals.USERS_DIR, globals.USER_INFO_DIR, globals.USER_META_DIR
];

// Create directories if they don't exist
directories.forEach( ( directory ) => {
	if( !fs.existsSync( directory ) ) {
		logger.info( `Creating directory ${directory}` );
		fs.mkdirSync( directory );
	}
} );

// Create a users file if it does not exist
if( process.env.REFRESH_FILES ) {
	logger.info( "Refreshing test data" );
	logger.info( "Removing old test data" );

	// Remove all files in the directory
	directories.forEach( ( directory ) => {
		fs.readdirSync( directory ).forEach( ( file ) => {
			if( !fs.lstatSync( `${directory}/${file}` ).isDirectory() ) {
				fs.unlinkSync( `${directory}/${file}` );
			}
		} );
	} );

	logger.info( "Creating test data" );

	if( !fs.existsSync( globals.USERS_FILE ) ) {
		fs.writeFileSync( globals.USERS_FILE, "{}" );
	}
	globals.USER_ID_MAP = JSON.parse( fs.readFileSync( globals.USERS_FILE ) );

	// Create the password hashes
	const hash1 = bcrypt.hashSync( "Password1$", bcrypt.genSaltSync( 10 ) );
	const hash2 = bcrypt.hashSync( "Password2$", bcrypt.genSaltSync( 10 ) );
	const hash3 = bcrypt.hashSync( "Password3$", bcrypt.genSaltSync( 10 ) );

	// Generate test users
	const users = [
		[ "user_1", "user1@email.com", hash1, "admin" ],
		[ "user_2", "user2@email.com", hash2, "user" ],
		[ "User_3", "user3@email.com", hash3, "user" ]
	];

	// Global map to find user ids by username or email
	const userIdMap = {};

	// Create the users
	users.forEach( ( user ) => {

		logger.info( `Creating user ${user[ 0 ]}` );

		// Create the user info object
		const userInfo = {
			"id": util.generateGuid(),
			"username": user[ 0 ],
			"email": user[ 1 ],
			"passwordHash": user[ 2 ],
			"loginAttempts": 0,
			"resetToken": null,
			"lockoutUntil": null,
			"confirmationToken": null,
			"confirmed": true,
			"createdAt": Date.now(),
			"updatedAt": Date.now()
		};

		// Create a map to the user id
		userIdMap[ userInfo.username.toLowerCase() ] = userInfo.id;
		userIdMap[ userInfo.email.toLocaleLowerCase() ] = userInfo.id;

		// Write the user info object to a file
		fs.writeFileSync(
			`${globals.USER_INFO_DIR}/${userInfo.id}.json`, JSON.stringify( userInfo )
		);

		// Create the user meta object
		const userMetaObject = {
			"userId": userInfo.id,
			"role": user[ 3 ]
		};

		// Write the user meta object to a file
		fs.writeFileSync(
			`${globals.USER_META_DIR}/${userInfo.id}.json`, JSON.stringify( userMetaObject )
		);

	} );

	// Write the user id map to a file
	fs.writeFileSync( globals.USERS_FILE, JSON.stringify( userIdMap ) );

	logger.info( "Test user data creation completed" );
}
