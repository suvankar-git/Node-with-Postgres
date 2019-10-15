const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');
const logger = require("../logger.js");

const create = async (req, res)=>{
    logger.info('Enter into create User method');
    const body = req.body;

    //if(!body.unique_key && !body.email && !body.phone){
       // return ReE(res, 'Please enter an email or phone number to register.');
       if(!body.unique_key  && !body.username && !body.password){
           console.log(body.username);
        return ReE(res, 'Please enter an username or password to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, user;
        [err, user] = await to(authService.createUser(body));
        if(err) return ReE(res, err, 422);
        //return ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
        return ReS(res, {message:'Successfully created new user.', username : body.username}, 201);
    }
}
module.exports.create = create;









