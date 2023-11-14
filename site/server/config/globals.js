// globals.js

"use strict";

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const fs = require( "fs" );

//////////////////////////////////////
// Globals Definition
//////////////////////////////////////

const globals = {};

// Blog
globals.BLOG_NAME = "Blog Site";

// Directories
globals.DATA_DIR = "./server/data/store";
globals.USERS_DIR = `${globals.DATA_DIR}/users`;
globals.USER_INFO_DIR = `${globals.USERS_DIR}/user_info`;
globals.USER_META_DIR = `${globals.USERS_DIR}/user_meta`;

// Files
globals.USERS_FILE = `${globals.USERS_DIR}/users.json`;

// Load a mapping of email or username to userid - useful for quick lookups
// This file is around 160 bytes per users if it starts taking up too much memory then need
// to look at other ways of storing this in memory or only storing active users
globals.USER_ID_MAP = {};

module.exports = globals;
