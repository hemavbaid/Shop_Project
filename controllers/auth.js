const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
});


exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM shopkeeper WHERE email = ?', [email], async(error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        }
        else if(password !== passwordConfirm){
                return res.render('register', {
                message: 'The passwords do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO shopkeeper SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {

            if(error){
                console.log(error);
            }
            else{
                console.log(results);
                return res.render('register', {
                 message: 'User Registered'
                });
             }
        })
    })
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).render('login', {
                message: 'Please enter an email and password'
            })
        }

        db.query('SELECT * FROM shopkeeper WHERE email = ?', [email], async(error, results) => {
            console.log(results);
            if(!(await bcrypt.compare(password, results[0].password ) ) ){
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            }
            else{
                const id = results[0].id;

                const token = jwt.sign({id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("Token is "+token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
            }
        })

    } catch (error) {
        console.log(error);
    }
}



exports.add = async (req, res) => {

    var { pid, pstock} = req.body;
    var ret = [];

    db.query('SELECT * FROM shopkart WHERE pid = ?', [pid], async(error, results) => {
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            var dbstock = results[0].pstock;
            ret = results[0];
            // console.log(typeof pstock);
            // ret = JSON.stringify(results);
            newstock = Number(pstock)+dbstock;
             console.log(ret);
            // var fres = JSON.parse(ret)
            // console.log(fres);
            db.query('UPDATE shopkart SET pstock = ? WHERE pid = ?',[newstock, pid], function(error, results) {

                if(error){
                    console.log(error);
                }
                else{
                    // console.log(results);
                    // console.log(pstock);
                    // console.log(results.affectedRows);

                    return res.render('add', {
                        message: 'Added Item'
                    });
                    }
            })
        }
    })
}


exports.remove = async (req, res) => {

    var { pid, pstock} = req.body;
    var ret = [];

    db.query('SELECT * FROM shopkart WHERE pid = ?', [pid], async(error, results) => {
        if(error){
            console.log(error);
        }
        else{
            //console.log(results[0].pstock);
            var dbstock = results[0].pstock
            // console.log(typeof pstock);
            // ret = JSON.stringify(results);
            newstock = dbstock - Number(pstock);
            // console.log(ret);
            // var fres = JSON.parse(ret)
            // console.log(fres);
            db.query('UPDATE shopkart SET pstock = ? WHERE pid = ?',[newstock, pid], function(error, results) {

                if(error){
                    console.log(error);
                }
                else{
                    // console.log(results);
                    // console.log(pstock);
                    // console.log(results.affectedRows);

                    return res.render('remove', {
                        message: 'Removed Item'
                    });
                    }
            })
        }
    })
}