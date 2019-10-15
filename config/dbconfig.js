'user strict';
const CONFIG = require('./config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var sequelize = {};
switch (process.env.NODE_ENV) {
  case 'production':
    sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
      multipleStatements: true,
      port: CONFIG.db_port,
      host: CONFIG.db_host,
      dialect: CONFIG.db_dialect,
      define: {
        underscored: true
      },
      pool: {
        max: CONFIG.DB_CONFIG_MAX,
        min: CONFIG.DB_CONFIG_MIN,
        acquire:CONFIG.DB_CONFIG_ACQUIRE,
        idle: CONFIG.DB_CONFIG_IDLE
      },
    });
    break;
  case 'testing':
    sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
      multipleStatements: true,
      port: CONFIG.db_port,
      host: CONFIG.db_host,
      dialect: CONFIG.db_dialect,
      define: {
        underscored: true
      },
      pool: {
        max: CONFIG.DB_CONFIG_MAX,
        min: CONFIG.DB_CONFIG_MIN,
        acquire:CONFIG.DB_CONFIG_ACQUIRE,
        idle: CONFIG.DB_CONFIG_IDLE
      },
    });
    break;
  default:
    sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
      multipleStatements: true,
      port: CONFIG.db_port,
      host: CONFIG.db_host,
      dialect: CONFIG.db_dialect,
      define: {
        underscored: true
      },
      pool: {
        max: CONFIG.DB_CONFIG_MAX,
        min: CONFIG.DB_CONFIG_MIN,
        acquire:CONFIG.DB_CONFIG_ACQUIRE,
        idle: CONFIG.DB_CONFIG_IDLE
      },
    });
}
sequelize
  .authenticate()
  .then(() => {
    console.log("MySql Database is connected on the port : ", CONFIG.db_port);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
let db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
//db.user = require('../models/login/user.model.js')(sequelize, Sequelize);
module.exports = db;