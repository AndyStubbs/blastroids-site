// repo-user_meta.js

"use strict";

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const globals = require( "../../config/globals.js" );
const util = require( "../../config/util.js" );

//////////////////////////////////////
// User Meta Repository
//////////////////////////////////////

module.exports = {
	"insert": async ( userMeta ) => {
			userMeta.createdAt = Date.now();
			userMeta.updatedAt = Date.now();
			const metaFilePath = `${globals.USER_META_DIR}/${userMeta.userId}.json`;
			await util.writeFile( metaFilePath, JSON.stringify( userMeta ) );
	},
	"get": async ( userId ) => {
		const metaFilePath = `${globals.USER_META_DIR}/${userId}.json`;
		const data = await util.readFile( metaFilePath );
		return JSON.parse( data );
	},
	"update": async ( userMeta ) => {
		userMeta.updatedAt = Date.now();
		const metaFilePath = `${globals.USER_META_DIR}/${userMeta.userId}.json`;
		await util.writeFile( metaFilePath, JSON.stringify( userMeta ) );
		return true;
	}
};
