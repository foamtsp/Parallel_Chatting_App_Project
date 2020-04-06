var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    groups:{
        type: [String],
        default: []
    },
    groupTimeStamps:{
        type: [Date],
        default: []
    }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel