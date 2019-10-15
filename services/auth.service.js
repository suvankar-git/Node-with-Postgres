const {User} 	    = require('../models/postgres');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');


const createUser = async (userInfo) => {
    let err;
        [err, user] = await to(User.create(userInfo));
        if(err) TE('username already exists');
        return user;
}
module.exports.createUser = createUser;
