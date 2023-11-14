// auth.js

"use strict";

//////////////////////////////////////
// Auth Middleware
//////////////////////////////////////

const auth = {};

auth.isAuthenticated = function isAuthenticated( req, res, next ) {
	const user = req.session.user;
	if( !user ) {
		return res.status( 401 ).json( { "error": "Unauthorized" } );
	}
	next();
};

module.exports = auth.isAuthenticated;
