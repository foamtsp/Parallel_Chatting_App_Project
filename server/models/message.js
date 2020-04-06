var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
    username: String,
    groupName:String,
    text:String
},{timestamps:true,require:true})

const messageModel = mongoose.model('Message', messageSchema)

module.exports = messageModel