const Place = require('../models/Place');
const upload = require('../config/upload');
const helpers = require('./helpers');

const validParams = ['title','description','address','acceptsCreditCard','openHour','closeHour'];

function find(req,res,next){
  // Place.findById(req.params.id)
  Place.findOne({slug: req.params.id})
  .then(place => {
    req.place = place;
    req.mainObj = place;
    next();
  })
  .catch(err=> {
    next(err); // el arg en next es un error
  })
}

function index(req,res){
  // Place.find({}) - devuelve todos
  Place.paginate({},{page: req.query.page || 1, limit:8, sort: {'_id': -1} }) // el querystring de un URI -> objeto request
  .then(docs => {
    res.json(docs);
  })
  .catch(err => {
    console.log(err);
    res.json(err);
  })
}

function create(req,res,next){
  // Place.create({
  //   title: req.body.title,
  //   description: req.body.description,
  //   acceptsCreditCard: req.body.acceptsCreditCard,
  //   openHour: req.body.openHour,
  //   closeHour: req.body.closeHour
  // })
  const params = helpers.buildParams(validParams,req.body);
  console.log(req.user);
  params['_user'] = req.user.id;  // objeto llenado por el JWT
  Place.create(params)
  .then( doc => {
    // res.json(doc);
    req.place = doc;
    next()
  })
  .catch( err => {
    console.log(err);
    next(err);
    // res.json('test');
  });
}

function show(req,res){
  // Place.findById(req.params.id)
  // .then(doc => {
  //   res.json(doc);
  // })
  // .catch(err => {
  //     console.log(err);
  //     res.json(err)
  // });

  // con middleware find
  res.json(req.place);
}

function update(req,res){
  const params = helpers.buildParams(validParams,req.body);
  console.log(params);
  req.place = Object.assign(req.place,params);
  req.place.save()
    .then(doc => {
      res.json(doc);
    }).catch(err => {
      res.json(err);
    });
}

function destroy(req,res) {
  // sin middleware
  // Place.findByIdAndRemove(req.params.id)
  // con middleware
  req.place.remove()
  .then(doc=>{
    res.json({});
  })
  .catch(err=>{
    res.json(err);
  })

}

function multerMiddleware(){
  // single para un solo archivo -> colleccion -> fields
  return upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'cover', maxCount: 1},
  ]);
}

function saveImage(req,res){
   if(req.place) {

      const files = ['avatar', 'cover'];
      const promises = [];

     files.forEach(imageType => {
       if(req.files && req.files[imageType]) {
         const path = req.files.avatar[0].path;
         promises.push(req.place.updateImage(path,imageType));
       }
     })

     Promise.all(promises)
       .then(results => {
        console.log(results);
          res.json(req.place);
        })
       .catch(err=>{
         console.log(err)
         res.json(err)
       });

     } else {
     res.status(422).json({
       error: req.error || 'Could not save place'
     });
    }
   }


module.exports = {
  index,
  create,
  show,
  update,
  destroy,
  find,
  multerMiddleware,
  saveImage
}
