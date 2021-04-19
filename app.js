const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'})
const app = express();

//Connection
const db = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
});

const publicd = path.join(__dirname, './public')
app.use(express.static(publicd));

// parse urlencoded bodies as sent by html forms
app.use(express.urlencoded({extended: false}));
// parson json bodies as sent by api clients
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql Connected.');
});

//define routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));













// const exphbs = require('express-handlebars');
// const logger = require('./middleware/logger');

//  create db
// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE shop';
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log('result');
//         res.send('Database created.');
//     });
// });

// create table
// app.get('/createtable', (req, res) => {
//     let sql = 'CREATE TABLE shopkeeper (id int AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY(id))';
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Table created.');
//     });
// });


// app.use(logger);

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api/members', require('./routes/api/members'))

