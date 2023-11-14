// userModel.js

"use strict";

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const util = require( "../../config/util.js" );
const repo = require( "../repos/repo.js" );

//////////////////////////////////////
// User Model
//////////////////////////////////////

// Constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_INTERVAL = 24 * 60 * 60 * 1000;

// User Model
const userModel = {};

userModel.create = async ( username, email, passwordHash ) => {

	// Create the user info object
	const userInfo = {
		"id": util.generateGuid(),
		"username": username,
		"email": email,
		"passwordHash": passwordHash,
		"loginAttempts": 0,
		"resetToken": null,
		"lockoutUntil": null,
		"confirmationToken": null,
		"confirmed": true,
		"createdAt": Date.now(),
		"updatedAt": Date.now()
	};
	await repo.insert( "user_info", userInfo );

	// Create the user meta object
	const userMeta = {
		"userId": userInfo.id,
		"role": "user"
	};
	await repo.insert( "user_meta", userMeta );

	return userInfo;
};

userModel.get = function( usernameOrEmail ) {
	return repo.get( "user_info", usernameOrEmail );
};

userModel.getAnyId = ( queries ) => {
	return repo.getAnyId( "user_info", queries );
};

userModel.getMeta = function( userId ) {
	return repo.get( "user_meta", userId );
};

userModel.getResponse = ( userInfo ) => {
	return {
		"username": userInfo.username,
		"email": userInfo.email,
		"createdAt": userInfo.createdAt,
		"updatedAt": userInfo.updatedAt,
		"loginExpiresAt": userInfo.loginExpiresAt
	};
};

userModel.incrementLoginAttempts = function( userInfo ) {
	userInfo.loginAttempts += 1;
	if( userInfo.loginAttempts >= MAX_LOGIN_ATTEMPTS ) {
		userInfo.lockoutUntil = Date.now() + LOCKOUT_INTERVAL;
		userInfo.loginAttempts = 0;
	}
	repo.update( "user_info", userInfo );
};

userModel.resetLockout = function( userInfo ) {
	userInfo.loginAttempts = 0;
	userInfo.lockoutUntil = null;
	repo.update( "user_info", userInfo );
};

userModel.update = function( userInfo ) {
	return repo.update( "user_info", userInfo );
};

userModel.updateMeta = function( userMeta ) {
	return repo.update( "user_meta", userMeta );
};

module.exports = userModel;
