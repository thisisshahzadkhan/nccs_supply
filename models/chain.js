var mongoose = require('mongoose');

var chain = new mongoose.Schema({
    data:{
        stage:String,
        name:String,
        carat:String,
        color:String,
        description:String,
    },
    pervioushash:String,
    timestamp:String,
});

module.exports = mongoose.model('chain', chain);