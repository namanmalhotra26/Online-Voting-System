const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ovnschema = new Schema({
    title: String,
    noofvotes: {
        type: Number,
        default: 0
    },

    description: String,
    image: String,
    year: Number,
    slogan: String
});
module.exports = mongoose.model('ovn', ovnschema);

