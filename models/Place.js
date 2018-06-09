const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uploader = require('../models/Uploader');
const slugify = require('../plugins/slugify')
const Visit = require('./Visit');
// genera schema -> informacion del objeto a guardar (attrs, metodos, etc)
let placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
    // unique: true
  },
  address: String,
  description: String,
  acceptsCreditCard: {
    type: Boolean,
    default: false
  },
  coverImage: String,
  avatarImage: String,
  openHour: Number,
  closeHour: Number,
  _user: {
    type: mongoose.Schema.Types.ObjectId,   // los ids asignados automaticamente son ObjectIds
    ref: 'User',
    required: true
  }
});

placeSchema.methods.updateImage = function(path,imageType){
  //upload image
  return uploader(path)
    .then(secure_url => this.saveImageUrl(secure_url,imageType))
  // save image
}

placeSchema.methods.saveImageUrl = function(secureUrl,imageType){
  return this[imageType+'Image'] = secureUrl;
  return this.save()
}

// hooks, son funciones a enlazar con el ciclo de un documento
placeSchema.pre('save', function(next){
  if(this.slug) return next();
  generateSlugAndContinue.call(this,0,next)
})

placeSchema.statics.validateSlugCount = function(slug){
  return Place.count({slug: slug}).then(count => {
      if(count > 0) return false;
      return true;
  });
}
// generar paginadores
placeSchema.plugin(mongoosePaginate);
// definir offset -> la cant de numeros a evitar

// virtual
placeSchema.virtual('visits').get(function(){
    return Visit.find({'_place': this._id}).sort('-id');
});

function generateSlugAndContinue(count, next) {
  this.slug = slugify(this.title);
  if(count != 0)
    this.slug = this.slug + '-' + count;

  Place.validateSlugCount(this.slug).then(isValid => {
    if(!isValid)
      return generateSlugAndContinue.call(this, count+1, next);
    next();
  })
}

// generar el modelo
let Place = mongoose.model('Place',placeSchema);
module.exports = Place;
