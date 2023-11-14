// repo-user_info.js

"use strict";

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const fs = require( "fs" );

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const util = require( "../../config/util.js" );
const globals = require( "../../config/globals.js" );

//////////////////////////////////////
// User Info Repository
//////////////////////////////////////

let userIdTimeout = null;

module.exports = {
	"insert": async ( userInfo ) => {
		userInfo.createdAt = Date.now();
		userInfo.updatedAt = Date.now();
		const userFilePath = `${globals.USER_INFO_DIR}/${userInfo.id}.json`;
		await util.writeFile( userFilePath, JSON.stringify( userInfo ) );
			
		// Update user id map
		globals.USER_ID_MAP[ userInfo.username ] = userInfo.id;
		globals.USER_ID_MAP[ userInfo.email ] = userInfo.id;

		// Write user id map to file
		if ( userIdTimeout ) {
			clearTimeout( userIdTimeout );
		}

		// Delay writing to file to avoid too many writes
		userIdTimeout = setTimeout( () => {
			fs.writeFileSync( globals.USERS_FILE, JSON.stringify( globals.USER_ID_MAP ) );
		}, 1000 );

		return userInfo;
	},
	"get": async ( userLookup ) => {
		const userId = globals.USER_ID_MAP[ userLookup.toLowerCase() ];
		if ( userId ) {
			const userFilePath = `${globals.USER_INFO_DIR}/${userId}.json`;
			const userInfoData = await util.readFile( userFilePath );
			return JSON.parse( userInfoData );
		}
	},
	"getAnyId": ( userLookups ) => {
		for( let i = 0; i < userLookups.length; i++ ) {
			const userInfo = globals.USER_ID_MAP[ userLookups[ i ].toLowerCase() ];
			if ( userInfo ) {
				return userInfo;
			}
		}
	},
	"update": async ( userInfo ) => {
		userInfo.updatedAt = Date.now();
		const userFilePath = `${globals.USER_INFO_DIR}/${userInfo.id}.json`;
		await util.writeFile( userFilePath, JSON.stringify( userInfo ) );
	}
};
