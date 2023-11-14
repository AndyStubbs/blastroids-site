// userController.js

"use strict"

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const bcrypt = require( "bcryptjs" );

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const logger = require( "../config/logger" );
const userModel = require( "../data/models/userModel.js" );
const util = require( "../config/util" );

//////////////////////////////////////
// Contoller variables
//////////////////////////////////////

const userController = {};
const REMEMBER_SESSION = 30 * 24 * 60 * 60 * 1000;
const STANDARD_SESSION = 24 * 60 * 60 * 1000;

//////////////////////////////////////
// Controller API
//////////////////////////////////////

// Login user
userController.login = async function login( req, res ) {
	const { credential, "password": longPassword, remember } = req.body;
	const password = longPassword.slice( 0, 256 );
	if( !credential || !password ) {
		return res.status( 400 ).json( {
			"error": "Email and password are required."
		} );
	}

	if( !util.isValidEmail( credential ) || !util.isValidPassword( password ) ) {
		return res.status( 401 ).json( { "error": "Invalid credentials" } );
	}

	try {
		const userInfo = await userModel.get( credential );
		if( !userInfo ) {
			return res.status( 401 ).json( { "error": "Invalid credentials" } );
		}

		bcrypt.compare( password, userInfo.passwordHash, function ( errCmp, bcryptSuccess ) {
			if ( bcryptSuccess ) {
				userModel.resetLockout( userInfo, () => {} );
				updateSessionAndCookie( req, res, remember, userInfo );

				return res.status( 200 ).json( {
					"message": "Login successful",
					"userInfo": userModel.getResponse( userInfo )
				} );
			} else {
				userModel.incrementLoginAttempts( userInfo );
				return res.status( 500 ).json( { "error": "Internal server error" } );
			}
		} );
	} catch( err ) {
		logger.error( err );
		return res.status( 500 ).json( { "error": "Internal server error" } );
	}
};

// Logout user
userController.logout = function logout( req, res ) {
	req.session.user = null;
	return res.status( 200 ).json( { "message": "Logout successful" } );
};

// Register user
userController.register = async function register( req, res ) {
	const { username, email, "password": longPassword } = req.body;
	const password = longPassword.slice( 0, 256 );
	if( !username || !email || !password ) {
		return res.status( 400 ).json( {
			"error": "Username, email, and password are required."
		} );
	}

	// Validate email and password
	if(
		!util.isValidUsername( username ) ||
		!util.isValidEmail( email ) ||
		!util.isValidPassword( password )
	) {
		return res.status( 401 ).json( { "error": "Invalid credentials" } );
	}

	try {
		const checkId = userModel.getAnyId( [ username, email ] );
		if( checkId ) {
			return res.status( 409 ).json( { "error": "Username or email already exists" } );
		}
		const hash = await hashPassword( password );
		const userInfo = await userModel.create( username, email, hash );
		updateSessionAndCookie( req, res, false, userInfo );
		res.status( 201 ).json( userModel.getResponse( userInfo ) );
	} catch( err ) {
		logger.error( err );
		return res.status( 500 ).json( { "error": "Internal server error" } );
	}
};

// Check if username is available
userController.checkUsername = async function checkUsername ( req, res ) {
	const { username } = req.body;

	if( !util.isValidUsername( username ) ) {
		return res.status( 400 ).json( { "error": "Invalid username" } );
	}

	const userInfo = await userModel.get( username );

	if( userInfo ) {
		return res.status( 409 ).json( { "error": "Username already exists" } );
	}
	return res.status( 200 ).json( { "message": "Username is available" } );
};

// Check if email is available
userController.checkEmail = async function checkEmail( req, res ) {
	const { email } = req.body;

	if( !util.isValidEmail( email ) ) {
		return res.status( 400 ).json( { "error": "Invalid email" } );
	}

	const userInfo = await userModel.get( email );
	
	if( userInfo ) {
		return res.status( 409 ).json( { "error": "Email already exists" } );
	}
	return res.status( 200 ).json( { "message": "Email is available" } );
};

// Get user metadata
userController.getMetadata = function getMetadata( req, res ) {
	const userId = req.session.user.id;
	userModel.getMeta( userId ).then( ( metadata ) => {
		return res.status( 200 ).json( metadata );
	} ).catch( ( err ) => {
		logger.error( err );
		return res.status( 500 ).json( { "error": "Internal server error" } );
	} );
};

//////////////////////////////////////
// Helper functions
//////////////////////////////////////

// Update the session and cookie
function updateSessionAndCookie( req, res, remember, user ) {

	// Set the session data
	req.session.user = user;

	if( remember ) {
		req.session.cookie.maxAge = REMEMBER_SESSION;
	} else {
		req.session.cookie.maxAge = STANDARD_SESSION;
	}

	// Set the session expiration date for the user
	user.loginExpiresAt = new Date( Date.now() + req.session.cookie.maxAge ).getTime();

	// Explicitly set the cookie in the response
	res.cookie( "connect.sid", req.session.id, {
		"maxAge": req.session.cookie.maxAge,
		"expires": new Date( Date.now() + req.session.cookie.maxAge ),
		"httpOnly": true,
		"secure": true,
		"sameSite": "strict"
	} );
}

// Hash the password
function hashPassword( password ) {
	return new Promise( ( resolve, reject ) => {
		bcrypt.hash( password, 10, function( err, hash ) {
			if( err ) {
				return reject( err );
			}
			resolve( hash );
		} );
	} );
}

module.exports = userController;
