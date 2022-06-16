const express = require('express');
const passport = require('passport')
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchasync = require('../utils/catchasync')
const { isloggedin } = require('../middleware');
router.get('/:id', isloggedin, catchasync(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        req.flash('error', 'cannot find that campground');
        return res.redirect('/main')
    }

    res.render('profiles/show', { user });
}))
router.get('/:id/edit', isloggedin, catchasync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (!user) {
        req.flash('error', 'cannot find that user');
        return res.redirect('ovns/main')
    }

    res.render('profiles/edit', { user });
}))
router.put('/:id', isloggedin, catchasync(async (req, res) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    req.flash('success', 'Updated!!')
    res.redirect(`/profile/${user._id}`)
}))
router.delete('/:id', isloggedin, catchasync(async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    req.flash('success', 'Deleted user!')
    res.redirect('/logout');
}))
module.exports = router;