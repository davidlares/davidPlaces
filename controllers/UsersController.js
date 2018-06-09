const buildParams = require('./helpers').buildParams;
const User = require('../models/User');

const validParams = ['email','name','password'];

function create(req,res,next){
  let params = buildParams(validParams, req.body)
  User.create(params)
    .then(user => {
      // res.json(user)
      req.user = user;
      // en vez de retornar el valor, convertimos el create en un middleware donde se almacena el objeto completo user al request
      next();
    })
    .catch(error => {
      console.log(error);
      res.status(422),json({error});
    })
}

// function destroyAll(req,res){
//   User.remove({}).then(r => res.json({}));
// }

function myPlaces(req,res){
  User.findOne({'_id': req.user.id}).then(user=>{
    console.log(user.places);
    user.places.then(places=>{
      res.json(places);
    })
  }).catch(err=>{
    console.log(err);
    res.json(err);
  })
}


module.exports = { create, myPlaces }
