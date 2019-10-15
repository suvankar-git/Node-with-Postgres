const models 	    = require('../models/mysql');



module.exports.getUsers = ()=>{
        return  models.User.findAll();
}   
 
module.exports.getUserByID = (userID)=>{
    return  models.User.find({ where: {
        id: userID
      }});

}   