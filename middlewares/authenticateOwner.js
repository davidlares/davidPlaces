module.exports = function(req,res,next){
  if(reb.mainObj && (req.mainObj._user == req.user.id)) return next();
  next(new Error('you have not permissions to be here'))
}
