"use strict";

// Local libs
const user_info = require( "./repo-user_info.js" );
const user_meta = require( "./repo-user_meta.js" );

// Define actions for tables
const repos = {
	"user_info": user_info,
	"user_meta": user_meta
};

const repo = {};

repo.get = ( repoName, query ) => {
	return repos[ repoName ].get( query );
};

repo.getAnyId = ( repoName, queries ) => {
	return repos[ repoName ].getAnyId( queries );
};

repo.insert = ( repoName, data ) => {
	return repos[ repoName ].insert( data );
};

repo.insertMany = ( repoName, data ) => {
	return repos[ repoName ].insertMany( data );
};

repo.update = ( repoName, fields, userInfo ) => {
	return repos[ repoName ].update( fields, userInfo );
};

module.exports = repo;
