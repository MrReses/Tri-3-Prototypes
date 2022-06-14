//set up the server
const express = require( "express" );
const res = require("express/lib/response");
const logger = require( "morgan" );
//const { process_params } = require("express/lib/router");
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT; //80 used for official websites, can be range 1024 to about

const db = require('./db/db_pool');

//Configure express to use ejs
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//Auth0
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '7yxwjLAnGlyAkcF_sR5lpdnPokeCeNFS-LLOVv5XKmUp9Uazk-P5vkheHqKFrh9R',
  baseURL: 'http://localhost:80',
  clientID: 'xa9pNicuOwgroUhGiGyGDj8t8vrWKNR4',
  issuerBaseURL: 'https://dev-f3ayu9wz.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use( express.urlencoded({extended : false}));

// all event handlers go from top to bottom

// defining middleware that logs all requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// req.isAuthenticated is provided from the auth router
app.get('/testLogin', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

  const { requiresAuth } = require('express-openid-connect');

  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });  
  
// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

const read_stuff_all_sql = `
    SELECT
        id, item, amount, price
    FROM
        purchases
`

// define a route for the stuff inventory page
app.get( "/stuff", ( req, res ) => {
    //res.sendFile( __dirname + "/views/stuff.html" );
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.render("stuff", { inventory : results});
        // inventory's shape:
        // {
        //  {id: ___, item: ____, quantity: ____, price: ____},
        //  {id: ___, item: ____, quantity: ____, price: ____},
        // }
    });
});

const read_stuff_item_sql = `
    SELECT
        id, item, amount, price, reason_for_buying
    FROM
        purchases
    WHERE
        id = ?
`

// define a route for the item detail page
app.get( "/stuff/item/:id", ( req, res ) => {
    //res.sendFile( __dirname + "/views/item.html" );
    db.execute(read_stuff_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server 
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            //res.send(results[0]); // results is still an array
            let data = results[0];
            //{ item: ___,  quantity: ___, description: ___ }
            res.render('item', data)
        }
    });
});

const delete_stuff_sql = `
    DELETE
    FROM 
        purchases
    WHERE
        id = ?
`

app.get("/stuff/item/:id/delete", ( req, res) => {
    db.execute(delete_stuff_sql, [req.params.id], ( error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server
        else {
            res.redirect("/stuff");
        }
    })
})

const create_item_sql = `
    INSERT INTO purchases
        (item, amount, price, reason_for_buying)
    VALUES
        (?, ?, ?, ?)
`

app.post("/stuff", ( req, res ) => {
    // to get form input values
    // req.body.name
    // req.body.quantity
    // quantity, description
    db.execute(create_item_sql, [req.body.name, req.body.quantity1, req.body.quantity2, req.body.description], (error, results) => {
        if(error)
            res.status(500).send(error);
        else {
            res.redirect(`/stuff/item/${results.insertId}`);
        }
    })
})

const update_item_sql = `
    UPDATE
        purchases
    SET
        item = ?,
        amount = ?,
        price = ?,
        reason_for_buying = ?
    WHERE
        id = ?
`

app.post("/stuff/item/:id", ( req,res ) => {
    db.execute(update_item_sql,[req.body.name, req.body.quantity1, req.body.quantity2, req.body.description, req.params.id], (error, results) => {
        if(error)
            res.status(500).send(error);
        else {
            res.redirect(`/stuff/item/${req.params.id}`);
        }
    })

})
// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );
// run by typing into terminal: node app.js
// reset table with: node db/db.init.js