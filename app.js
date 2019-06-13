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
var stages=['Mine','Planing','Laster Cutting','Polishing','Quality Check','Certification','Distribution'];
//date
var currentDate = new Date();
function myTimeStamp(){
    return currentDate.getHours()+':'+currentDate.getMinutes()+':'+currentDate.getMilliseconds()/1000+' , '+currentDate.getDate()+'-'+currentDate.getMonth()+'-'+currentDate.getFullYear();
}

//retrive items
app.get('/getitems',(req,res)=>{
    item.find({},function(err,dbres){
        if(err){res.json({'msg':err})}
        else {res.json({'msg':dbres})}
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
    //item.findOne({name:req.body.name})
    item.create(new item({
        name:req.body.name,
        currentstage:0,
        stage:stages[0],
        carat:req.body.carat,
        color:req.body.color,
        description:req.body.description,
    }),function(err,dbres){
        
        if(err){console.log(err);
        res.json({msg:err.errmsg});}
        else {
            chain.find({},function(err,dbres2){
                var hash;
                if(dbres2.length===0)
                {hash='genesis';}else{
                    hash=dbres2[dbres2.length-1]._id;
                }
                if(err) console.log(err);
               else{ 
                    chain.create(new chain({
                        pervioushash:hash,
                        data:dbres,
                        timestamp:myTimeStamp()
                    }),function(err,dbres3){
                        console.log(err);
                        console.log(dbres3);
                        res.json(dbres3);
                    });
                }
            }); 
        }
    });
});

//stage update
app.post('/stageupdate',(req,res)=>{
    item.findOne({_id:req.body.id},function(err,dbres){
        if(err){
            console.log(err);
            res.json({msg:'Diamond not Found'});
        }else{
            var cur_stage=++dbres.currentstage;
            if(cur_stage<=6){
            item.updateOne({_id:req.body.id},
                {$set:{currentstage:cur_stage,
                    stage:stages[cur_stage],
                    //carat:"2",
                    //carat:(res.body.carat!=null)?res.body.carat:dbres.carat,
                    isCute:true}},
            function(err,dbres2){
                if(err)console.log(err);
                else{
                     item.findOne({_id:req.body.id},function(err,dbres){
                         if(err)console.log(err);
                         else{
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
                     })
                }
            });}
            else{
                res.json({msg:'No more stages available!'});
            }
        } 
        
    })
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