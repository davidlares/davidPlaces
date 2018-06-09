const mongoose = require('mongoose');

const dbName = "places";

module.exports = {
  connect: () => mongoose.connect('mongodb://localhost/' + dbName),
  dbName, // shorthand properties (variable = properties)
  connection: () => {
    if(mongoose.connection){
      console.log('si');
      return mongoose.connection  // si existe la conexion, la retomamos
    }
    return this.connect() // sino generamos la conexion nueva
  }
}
