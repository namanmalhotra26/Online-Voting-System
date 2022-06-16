const express = require('express');
const router = express.Router();
const catchasync = require('../utils/catchasync');
const expresserror = require('../utils/ExpressError');
const ovn = require('../models/ovn');
const User = require('../models/user');
var a = 0;
const { isloggedin } = require('../middleware');
const { append } = require('express/lib/response');
const user = require('../models/user');

router.post('/result', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.find({});



    res.render('ovns/result', { ovns })
}))
router.put('/enable', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.find({});

    a = 1;
    res.redirect('/party/main');
}))
router.put('/disable', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.find({});

    a = 0;
    res.redirect('/party/main');
}))

router.put('/b/:id', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.find({});

    const userss = await User.findByIdAndUpdate(req.user._id, { vote: true })
    const ovnss = await ovn.findById(req.params.id);
    ovnss.noofvotes += 1;
    await ovnss.save();
    res.redirect('/party/main');
}))

router.get('/main', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.find({});


    res.render('ovns/main', { ovns, a })
}))

router.get('/new', isloggedin, (req, res) => {
    res.render('ovns/new')
})
router.post('/', isloggedin, catchasync(async (req, res) => {
    // if (!req.body.Campground) throw new expresserror('invalid', 400)

    const ovns = new ovn(req.body.ovns);
    await ovns.save();
    req.flash('success', 'New party made');
    res.redirect(`/party/${ovns._id}`)
}))
router.get('/:id/edit', isloggedin, catchasync(async (req, res) => {
    const { id } = req.params;
    const ovns = await ovn.findById(id)
    if (!ovns) {
        req.flash('error', 'cannot find that campground');
        return res.redirect('/party/main')
    }

    res.render('ovns/edit', { ovns });
}))
router.get('/:id', isloggedin, catchasync(async (req, res) => {
    const ovns = await ovn.findById(req.params.id)

    res.render('ovns/show', { ovns });
}))

router.put('/:id', isloggedin, catchasync(async (req, res) => {

    const { id } = req.params;

    const ovns = await ovn.findByIdAndUpdate(id, { ...req.body.ovns });
    req.flash('success', 'Updated!!')
    res.redirect(`/party/${ovns._id}`)
}))

router.delete('/:id', isloggedin, catchasync(async (req, res) => {
    const { id } = req.params;

    await ovn.findByIdAndDelete(id);
    req.flash('success', 'Deleted campground!')
    res.redirect('/party/main');
}))


module.exports = router;