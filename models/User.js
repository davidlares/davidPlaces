const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const Place = require('./Place');
const FavoritePlace = require('./FavoritePlace');

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // agrega un index al schema para buscar usuarios via email (agilizar la busqueda)
  },
  name: String,
  admin: {
    type: Boolean,
    default: false
  }
});

// hook post save user
userSchema.post('save', function(user,next){
  User.count({}).then(count => {
    if(count == 1){
      // user.admin = true;
      // user.save().then(next)
      User.update({'_id': user._id},{admin:true})
      .then(result => {
        next();
      });
    } else {
      next();
    }
  })
})

// virtual para retribuir la cantidad de place por un usuario
// userSchema.virtual('places').get(function(){
//   return Place.find({'_user': this._id})
// })

userSchema.virtual('favorites').get(function(){
  return FavoritePlace.find({'_user': this._id}, {'_place': true})
    .then(favs => {
      // array de los ids de la primera collection
      let placeIds = favs.map(fav => fav._place);
      return Place.find({'_id': {$in: placeIds }})

    })
})

userSchema.plugin(mongooseBcrypt);
// genera por defecto un campo encryptado password + metodos para los docs del usuarios


const User = mongoose.model('User',userSchema);
module.exports = User;
