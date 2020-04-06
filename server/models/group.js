var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var groupSchema = Schema({
    groupName:String,
    members:[String], // rel to user Object
    messages:[String], // rel to message Object
},{require:true})

const groupModel = mongoose.model('Group',groupSchema)

module.exports = groupModel