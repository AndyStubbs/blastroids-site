// routes.js

"use strict"

//////////////////////////////////////
// Node Modules
//////////////////////////////////////

const express = require( "express" );
const router = express.Router();

//////////////////////////////////////
// Local Libs
//////////////////////////////////////

const authMiddleware = require( "./middleware/auth.js" );
const userController = require( "./controllers/userController.js" );

//////////////////////////////////////
// User Routes
//////////////////////////////////////

router.post( "/users/login", userController.login );
router.post( "/users/logout", userController.logout );
router.post( "/users/register", userController.register );
router.post( "/users/checkUsername", userController.checkUsername );
router.post( "/users/checkEmail", userController.checkEmail );
router.get( "/users/metadata", authMiddleware, userController.getMetadata );

module.exports = router;
