'use strict';
const {TE, to}          = require('../../services/util.service');
const CONFIG            = require('../../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('User', {
        username     : {type:DataTypes.STRING,allowNull: false,unique: {args: true, msg: 'Username already in use!'}},
        password  : {type:DataTypes.STRING,allowNull: false},
        //email     : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: {msg: "Phone number invalid."} }},
        //phone     : {type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, isNumeric: { msg: "not a valid phone number."} }},
        email : {type:DataTypes.STRING,allowNull: true},
        phone : {type:DataTypes.STRING,allowNull: true},
        isAdmin : { type: DataTypes.BOOLEAN,allowNull: false,defaultValue: false}    
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};
