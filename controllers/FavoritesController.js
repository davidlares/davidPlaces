const buildParams = require('./helpers').buildParams;
const User = require('../models/User');

const validParams = ['_place']; // el user viene del JWT
const FavoritePlace = require('../models/FavoritePlace');

function find(req,res,next){
  FavoritePlace.findById(req.params.id)
  .then(fav => {
    req.mainObj = fav; // sirve para proteger la ruta del propietario
    req.favorite = fav;
    next();
  })
  .catch(next);
}

function index(req,res){
  //req.user
  // User.findOne({'_id': req.user.id}).then(user=>{
  if(!req.fullUser) return res.json({});
  req.fullUser.favorites.then(favorites=>{
      res.json(favorites);
    })
  .catch(err =>{
    console.log(err);
    res.json(err);
  })
}

function create(req,res){
  let params = buildParams(validParams, req.body);
  params['_user'] = req.user.id;

  FavoritePlace.create(params)
    .then(favorite => {
        res.json(favorite)
    })
    .catch(error => {
      res.status(422).json({error});
    })
}

function destroy(req,res){
  req.favorite.remove()
    .then(doc => {
      res.json({});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error})
    })
}

module.exports = { create, find, destroy, index }
