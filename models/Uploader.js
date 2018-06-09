const cloudinary = require('cloudinary')
const secrets = require('../config/secrets')

cloudinary.config(secrets.cloudinary)

module.exports = function(pathImage){
  return new Promise((resolve,reject) => {
    cloudinary.uploader.upload(pathImage, function(result){
      if(result.secure_url){
        console.log(result);
        return resolve(result.secure_url);
      }
      reject(new Error('error with cloudinary'));
    })
  })
}
