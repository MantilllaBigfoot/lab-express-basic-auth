const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const isAuth = require('../middleware/isAuth');

router.get('/', isAuth, (req, res, next) => {
  res.render('index');
});

// GET - /login - Displays login form
router.get('/login', (req, res) => {
  res.render('login');
});

// POST - /login - Handles login form submission
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((doc) => {
      user = doc;
      if (user === null) {
        throw new Error('No user found to that email');
      } else {
        return bcryptjs.compare(password, user.password);
      }
    })
    .then((comparisonResult) => {
      if (comparisonResult) {
        //req.session.userId = user._id;
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        throw new Error('Wrong password error');
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((password) => {
      return User.create({
        username,
        password
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/private', isAuth, (req, res, next) => {
  res.render('private', { user: req.user }); //data from middleware
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
