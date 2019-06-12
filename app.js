var express = require('express'),
    item = require('./models/item'),
    stage = require('./models/stages'),
    chain = require('./models/chain'),
    mongoose = require('mongoose'),
    bodyparser = require('body-parser');
var app=express();

mongoose.connect('mongodb://localhost:27017/nccsdiamond');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({extended:true}));

//stages
var stages=['procurement','cutting','polishing','distribution'];
var currentDate = new Date();
function myTimeStamp(){
    return currentDate.getHours()+':'+currentDate.getMinutes()+':'+currentDate.getMilliseconds()/1000+' , '+currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear();
}

//retrive items
app.get('/getitems',(req,res)=>{
    item.find({},function(err,dbres){
        if(err){res.json({'msg':err})}
        else {res.json({'msg':dbres})}
        console.log(myTimeStamp());
        
        //console.log(currentDate.getHours()+':'+currentDate.getMinutes()+':'+currentDate.getMilliseconds()/1000+' , '+currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear());
    });
});

app.post('/getchain',(req,res)=>{
    console.log(req.body.name);
    chain.find({'data.name':req.body.name},function(err,dbres){
        if(err){res.json({'msg':err})}
        else {res.json({'msg':dbres})}
    });
});

//item addition
app.post('/additem',(req,res)=>{
   console.log(req.body.name);
    item.create(new item({
        name:req.body.name,
        stage:stages[0],
        description:req.body.description,
    }),function(err,dbres){
        if(err){console.log(err);}
        else {
            chain.find({},function(err,res){
               if(err) console.log(err);
               else{ 
                    chain.create(new chain({
                        pervioushash:res[res.length-1]._id,
                        data:dbres,
                        timestamp:myTimeStamp()
                    }),function(err,dbres){
                        console.log(err);
                        console.log(dbres);
                    });
                }
            }); 
        }
    });
});

//stage update
app.post('/stageupdate',(req,res)=>{
    console.log(req.body.id);
    item.find({_id:req.body.id}),function(err,dbres){
        console.log(err);
        console.log(dbres);
    }
 });
 

//stage addition
app.post('/stageadd',(req,res)=>{
    console.log(req.body.index); 
    stage.create(new stage({
         name:req.body.name,
         description:req.body.description,
     }),function(err,dbres){
         console.log(err);
         console.log(dbres);
     });
 });

 //listen
app.listen(3000,()=>{
    console.log('node is up');
});