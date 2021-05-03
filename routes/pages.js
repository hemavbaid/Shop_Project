const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.render('index.hbs'));

router.get('/register', (req, res) => res.render('register'));

router.get('/login', (req, res) => res.render('login'));

router.get('/add', (req, res) => res.render('add'));

router.get('/remove', (req, res) => res.render('remove'));



module.exports = router;
