var express = require('express'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
var app = express();
var userRoutes = express.Router();
var key;
function generateKey(){
  key = Math.random();
  return key.toString();
}
function getKey(){
  if(key)
    return key.toString();
  else
    return null;
}
// Require Item model in our routes module
var User = require('../models/user');

// Defined db route
userRoutes.route('/add').post(function (req, res) {
  var user = new User(req.body);
  bcrypt.hash(user.password, 10, function(err, hash) { 
     user.password = hash;
     user.save()
    .then(item => {
    res.status(200).json({'user': 'user added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database" + err);
    });
  }); 
});

// login
userRoutes.route('/login').post(function(req,res){
  var user = new User(req.body);
  User.findOne({email:user.email}, function(err, result) {
    if (err){
      throw err;
      res.status(400).json({error:"user not found"});
    } 
    //console.log(result);
    if(bcrypt.compareSync(user.password, result.password)){
        let thisguy = {email:result.email,messages:result.messages};
        let secret = generateKey();
        console.log('generated key is '+ secret);
        jwt.sign({thisguy},secret,(err,token) => {
          res.status(200).json({token});
        });
       // res.status(200).json(thisguy);
    }else{
      res.status(400).json({error:"incorrect password"});
    }
  });
})
//get messsages
userRoutes.route('/getMessages').post(verify, function(req, res){
  var secretKey = getKey();
  console.log("verifying key "+secretKey);
  jwt.verify(req.token, secretKey , (err, data)=>{
    if(err) {
      console.log('unauthorized');
      res.status(403).send('Authorization failed')}
    else{
      console.log("authorized");
      res.status(200).json({data});
    }
  });
});

function verify(req, res, next){
  //console.log("entering verify");
  //console.log(req.headers);
  const bearerHead = req.headers['authorization'];
  //console.log(bearerHead);
  if(bearerHead == undefined){
    res.status(403).send('Forbidden');
  }else{
    const bearer = bearerHead.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
}
// send message
 userRoutes.route('/message').post(function(req,res){
  //console.log(req.body.to); 
  User.findOne({email:req.body.to}, function(err,user){
      if(err){
        throw err;
        console.log('recepient not found');
        res.status(400).json({error:"recepient not found"});
      }
        //console.log(user);
        user.messages.push({
          from:req.body.from,
          message:req.body.message,
          time: Date.now()
        });
        console.log(user.messages);
        user.save().then(item => {
          res.status(200).json({message: 'message sent'});
          })
          .catch(err => {
          res.status(400).json({error:"unable to send message : " + err});
          });
      
   })
 })

//logout
userRoutes.route('/logout').get(function(req, res){
  key = "loggedOut";
  res.status(200).json({'message':'logged out'});
});

 // Defined get data(index or listing) route
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, users){
    if(err){
      console.log(err);
    }
    else {
      // res.send("hey there");
      res.json(users);
    }
  });
});

// Defined edit route
userRoutes.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  User.findById(id, function (err, user){
      res.json(user);
  });
});

//  Defined update route
userRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      user.email = req.body.email;
      user.password = req.body.password;
      user.save().then(user => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route('/delete/:id').get(function (req, res) {
    User.findByIdAndRemove({_id: req.params.id}, function(err, coin){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = userRoutes;