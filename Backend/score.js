const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('score', scoreSchema, 'scores')