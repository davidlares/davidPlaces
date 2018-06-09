const express = require('express');
let router = express.Router();
let placesController = require('../controllers/PlacesController');

const authenticateOwner = require('../middlewares/authenticateOwner');

// se pueden designar distintos verbos al mismo path
router.route('/')
  .get(placesController.index)
  .post(placesController.multerMiddleware(),placesController.create,placesController.saveImage)

 router.route('/:id')
  .get(placesController.find,placesController.show)
  .put(placesController.find,authenticateOwner,placesController.update)
  .delete(placesController.find,authenticateOwner,placesController.destroy);

  // enviamos la funcion, no la ejecutamos

module.exports = router;
