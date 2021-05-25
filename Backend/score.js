const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// using mongoose schema to guarantee the structure of the score
let scoreSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true
    }
});

//exporting the mongoose model og the sschema and connecting it to the scores collection in the mongodb
module.exports = mongoose.model('score', scoreSchema, 'scores')