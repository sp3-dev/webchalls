const sqlite3 = require('sqlite3').verbose();
const crypto = require("crypto");
const bcrypt = require('bcrypt');

dbPath = "./dbSchema.sqlite";

let rand = crypto.randomBytes(8).toString('hex');

const saltRounds = 10;

let userTable = new sqlite3.Database(dbPath, (err) => {
    if(err){
        console.log(err.message);
        throw err;
    }else{
        console.log("Connected to the db");
        userTable.run(`
        CREATE TABLE user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text
        )
        `,
        (err) => {
            if(err) return;
            const insertUser = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';

            bcrypt.genSalt(saltRounds, function(err, salt) {
                if(err) return;
        
                bcrypt.hash(rand, salt, function(err, hash) {
                    if (err) return;
                    userTable.run(insertUser, ["admin","admin@admin.com", hash]);
                    userTable.run(insertUser, ["user","user@user.com", hash]);
                });
            });
        });
    }
});

let flagTable = new sqlite3.Database(dbPath, (err) => {
    if(err){
        console.log(err.message);
        throw err;
    }else{
        console.log("Connected to the db");
        flagTable.run(`
        CREATE TABLE what(
            what text
        )
        `,
        (err) => {
            if(err) return;
            const insertFlag = `INSERT INTO what (what) VALUES (?)`;

            flagTable.run(insertFlag, ["The flag used to be here lol"]);
        });
    }
});

module.exports = {
    userTable,
    flagTable
};

