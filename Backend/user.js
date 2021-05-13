const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Using moognuse schema to guarantee that the user have a uniq username, and always username and password
let userSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
 //exporting the mongoose model of the schema and connetcting to the users collection in the db
module.exports = mongoose.model('user', userSchema, 'users')