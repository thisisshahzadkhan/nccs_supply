var mongoose = require('mongoose');

var item = new mongoose.Schema({
    stage:String,
    currentstage:Number,
    name:String,
    carat:String,
    color:String,
    description:String,
});

module.exports = mongoose.model('item', item);