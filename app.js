if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ovn = require('./models/ovn');
const methodOverride = require('method-override')
const catchasync = require('./utils/catchasync');
const expresserror = require('./utils/ExpressError');
const ejsmate = require('ejs-mate');
const User = require('./models/user');
const joi = require('joi');
const session = require('express-session');
const { date } = require('joi');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const userRoutes = require('./routes/users')
const party = require('./routes/party')
const profile = require('./routes/profile')
const MongoDBStore = require('connect-mongo')(session);


const dburl = process.env.DB_URL || 'mongodb://localhost:27017/OVN';
mongoose.connect(dburl, {
    useNewUrlParser: true,

    useUnifiedTopology: true
})
    .then(() => {
        console.log("mongo started")
    })
    .catch(err => {
        console.log("mongo error!!!")
        console.log(err)
    });
app.engine('ejs', ejsmate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
const secret = process.env.SECRET || 'namanmalhotra'
const store = new MongoDBStore({
    url: dburl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("session store error", e)
})
const sessionConfig = {
    secret: 'namanmalhotra',
    resave: false,
    saveUninitialized: true,
    cokie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})
app.use('/', userRoutes)
app.use('/party', party)
app.use('/profile', profile)




app.all('*', (req, res, next) => {
    next(new expresserror('Page not found', 404))

})

app.use((err, req, res, next) => {
    const { statuscode = 500
    } = err;
    if (!err.message) err.message = 'oh no, wrong'
    res.status(statuscode).render('error', { err });

})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('3000 active')
})