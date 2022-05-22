const db = require("./db_connection");

// for purchases table

// delete any table that already exists
const drop_purchases_table_sql = "DROP TABLE IF EXISTS `purchases`;"

db.execute(drop_purchases_table_sql);
// create the table with suitable columns and such

const create_purchases_table_sql = `

CREATE TABLE purchases (
    id INT NOT NULL AUTO_INCREMENT,
    item VARCHAR(45) NOT NULL,
    amount INT NOT NULL,
    price FLOAT NOT NULL,
    reason_for_buying VARCHAR(150) NULL,
    PRIMARY KEY (id));
`
db.execute(create_purchases_table_sql);

// add some sample data to the table

const insert_purchases_table_sql = `
    INSERT INTO purchases
        (item, amount, price, reason_for_buying)
    VALUES
        (?, ?, ?, ?)
`

db.execute(insert_purchases_table_sql, ["Maraschino Cherries", "50", "26.00", "Trust me, I'm not addicted..."]);

db.execute(insert_purchases_table_sql, ["Plane Ticket to DisneyLand", "1", '200.0', null]);

/**** Read the sample items inserted ****/

const read_purchases_table_sql = "SELECT * FROM purchases";

db.execute(read_purchases_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'purchases' initialized with:")
        console.log(results);
    }
);

// now for budget table, might do this later

/*
// delete any table that already exists
const drop_budget_table_sql = "DROP TABLE IF EXISTS `budget`;"

db.execute(drop_budget_table_sql);
// create the table with suitable columns and such

const create_budget_table_sql = `

CREATE TABLE budget (
    id INT NOT NULL AUTO_INCREMENT,
    budget FLOAT NOT NULL,
    PRIMARY KEY (id));
`
db.execute(create_budget_table_sql);

// add some sample data to the table

const insert_budget_table_sql = `
    INSERT INTO budget
        (budget)
    VALUES
        (?)
`

db.execute(insert_budget_table_sql, ["2000.00"]);

*/

/**** Read the sample items inserted ****/

/*

const read_budget_table_sql = "SELECT * FROM budget";

db.execute(read_budget_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'budget' initialized with:")
        console.log(results);
    }
);

*/

db.end();

// test with: node db/db_init.js