//set up the server
const express = require( "express" );
const logger = require( "morgan" );
//const { process_params } = require("express/lib/router");
const app = express();
const port = 8080; //80 used for official websites, can be range 1024 to about 64000
// all event handlers go from top to bottom

// defining middleware that logs all requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

// define a route for the stuff inventory page
app.get( "/stuff", ( req, res ) => {
    res.sendFile( __dirname + "/views/stuff.html" );
} );

// define a route for the item detail page
app.get( "/stuff/item", ( req, res ) => {
    res.sendFile( __dirname + "/views/item.html" );
} );

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );
// run by typing into terminal: node app.js