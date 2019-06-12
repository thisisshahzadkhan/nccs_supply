var mongoose = require('mongoose');

var stage = new mongoose.Schema({
    name:({type:String,unique:true,}),
    description:String,
});

module.exports = mongoose.model('stage', stage);