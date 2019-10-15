const express = require('express');
const router = express.Router();
const path = require('path');

//Use Controller Object
const UserController = require('../controllers/user.controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({
    status: "Success",
    message: "Please enter Proper API Url ...",
    data: {
      "version_number": "v1.0.0"
    }
  });
});

//********* User Route for CRUD opearation *********
router.post('/users', UserController.create); // C                                                      
//router.get('/users', passport.authenticate('jwt', {session: false}), UserController.getAlluser); // R
//router.get('/users/:username', passport.authenticate('jwt', {session: false}), UserController.getByUserName); // R
//router.put('/users', passport.authenticate('jwt', {session: false}), UserController.update); // U
//router.delete('/users', passport.authenticate('jwt', {session: false}), UserController.remove); // D
//router.post('/users/login', UserController.login);

//********* OpenApi(Swagger) routes **********
router.use('/api-docs/swagger_json', express.static(path.join(__dirname, '/../swagger/swagger.json')));
router.use('/api-docs', express.static(path.join(__dirname, '/../swagger')));

module.exports = router;