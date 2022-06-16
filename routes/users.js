const express = require('express');
const passport = require('passport')
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchAsync = require('../utils/catchasync')
const { isloggedin } = require('../middleware');
router.get('/', (req, res) => {
    res.render('users/home')
})
router.get('/signup', (req, res) => {
    res.render('users/signup')
})
router.post('/signup', catchAsync(async (req, res) => {
    try {
        const { vote, address, number, otp, adhaar, city, state, zip, image, username, password } = req.body;
        const user = new User({ vote, address, number, otp, adhaar, city, state, zip, image, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);

            }
            req.flash('success', 'Welcome to Online Voting System');
            res.redirect('/party/main');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('signup')
    }

}))

router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), (req, res) => {
    req.flash('success', 'welcome back')
    const redirectUrl = req.session.returnTo || '/party/main'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/');
})
module.exports = router;