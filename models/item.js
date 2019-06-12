var mongoose = require('mongoose');

var item = new mongoose.Schema({
    stage:String,
    name:String,
    description:String,
});

module.exports = mongoose.model('item', item);