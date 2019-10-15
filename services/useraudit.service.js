const { UserAudit,User, db} = require('../models/mysql');
const elasticuserAuditModel 	    = require('../models/elasticSearch/elastic.useraudit.model');
const {TE,to} = require('./util.service');

module.exports.getUserAuditDetails = (query) => {

    console.log(query, db,"-----");
    let where = formatQuery(query);
    let order = { order: [['created_at', 'DESC']] };
    let limit = {};
    let offset = {};
    UserAudit.belongsTo(User, { foreignKey: 'user_id' })
    if (query.page) {
        offset = { offset: Number(query.page) }
    }
    if (query.limit) {
        limit = { limit: Number(query.limit) }
    }
    return UserAudit.findAll({ ...where, include: [{ model: User }], ...offset, ...limit, ...order });

}

module.exports.getUserAuditCount = (query) => {

    let whereQuery = formatQuery(query);

    return UserAudit.count({ where: whereQuery });



}

function formatQuery(query) {
    let user = {};
    let date = {};
    let type = {}
    if (query.user_id) user = { user_id: { '$in': [...query.user_id] } }
    if (query.created_from && query.created_to) {
        date = { created_at: { $between: [new Date(query.created_from), new Date(query.created_to)] } }



    }
    if (query.type) {
        type = { type: query.type };
    }
    date = { $and: { ...user, ...date, ...type } }
    return date
}


module.exports.saveUserAudit = async (data) => {
    let save,err;
    //return UserAudit.create(data);
    [err, save]= await to(elasticuserAuditModel.createUserAuditDocument(data));
    if(err) TE(err.message);
    return save;
};

