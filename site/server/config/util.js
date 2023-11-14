/* global Buffer */

"use strict";

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const crypto = require( "crypto" );
const fs = require( "fs" );

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "./logger" );

//////////////////////////////////////
// Util
//////////////////////////////////////

const util = {};

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{4,36}$/;
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,255}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{10,}$/;

// GUID regex from https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// File path regex from https://stackoverflow.com/questions/35013884/regex-to-validate-file-path
const FILE_PATH_REGEX = /^\/(?:[a-zA-Z0-9_@.\- ]+\/)*(?:[a-zA-Z0-9_@.\- ]+)$/;

util.convertIdToBinary = function ( id ) {
	return Buffer.from( id.replace( /-/g, "" ) );
};

util.generateGuid = function () {
	const array = new Uint8Array( 16 );
	crypto.getRandomValues( array );

	// eslint-disable-next-line no-bitwise
	array[ 6 ] = ( array[ 6 ] & 0x0f ) | 0x40;

	// eslint-disable-next-line no-bitwise
	array[ 8 ] = ( array[ 8 ] & 0x3f ) | 0x80;

	let guid = "";
	for ( let i = 0; i < array.length; i++ ) {
		let value = array[ i ].toString( 16 );
		if ( value.length === 1 ) {
			value = "0" + value;
		}
		guid += value;
		if ( i === 3 || i === 5 || i === 7 || i === 9 ) {
			guid += "-";
		}
	}
	return guid;
};

util.isValidUsername = function( username ) {
	if( !username || typeof username !== "string" ) {
		return false;
	}
	return USERNAME_REGEX.test( username );
};

util.isValidEmail = function( email ) {
	if( !email || typeof email !== "string" ) {
		return false;
	}
	return EMAIL_REGEX.test( email );
};

util.isValidFileContent = function( content ) {
	if( typeof content !== "string" ) {
		return false;
	}
	return true;
};

util.isValidPassword = function( password ) {
	if( !password || typeof password !== "string" ) {
		return false;
	}
	return PASSWORD_REGEX.test( password );
};

util.isValidGuid = function( guid ) {
	if( !guid || typeof guid !== "string" ) {
		return false;
	}
	return GUID_REGEX.test( guid );
};

util.isValidFileType = function( type ) {
	if( !type || typeof type !== "string" ) {
		return false;
	}
	return true;
};

util.isValidFilePath = function( path ) {
	if( !path || typeof path !== "string" ) {
		return false;
	}
	return FILE_PATH_REGEX.test( path );
};

util.readFile = function( path ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( path, ( err, data ) => {
			if( err ) {
				reject( err );
			} else {
				resolve( data );
			}
		} );
	} );
};

util.writeFile = function( path, data ) {
	return new Promise( ( resolve, reject ) => {
		fs.writeFile( path, data, ( err ) => {
			if( err ) {
				reject( err );
			} else {
				resolve();
			}
		} );
	} );
};

module.exports = util;
