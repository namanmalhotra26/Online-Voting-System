const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose');

const UserSchema = new Schema({

    address: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    opt: {
        type: Number
    },
    adhaar: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    vote: {
        type: Boolean,
        default: false
    }


});

UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User', UserSchema);