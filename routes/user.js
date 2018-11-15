const express = require('express');
const userController = require('../controllers/user');

const route = express.Router();

// [routes]
// [post] add users to db --> admin
route.post('/signup', userController.signUp);

// [get] user lists/details from db --> admin
route.get('/signin', userController.signIn);

// [patch] edit user details in db --> user && admin
route.patch('/modify', userController.modify);

// [get] user lists/details from db --> admin
route.get('/list', userController.listUsers);

// [delete] delete users from db --> user && admin
route.delete('/delete', userController.deleteUsers);

// authentication gives access to each route either admin || user
// [user keys] PATCH --> db --> edit users information
// [admin keys] PUT, DELETE, PATCH, GET --> db --> users
module.exports = route;