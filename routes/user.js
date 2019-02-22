const express = require('express');
// eslint-disable-next-line new-cap
const Route = express.Router();

const userController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

// [Routes]
// [post] add users to db --> admin
Route.post('/signup', userController.signUp);

// [get] user signs in to get token
Route.put('/signin', userController.signIn);

// [patch] first link to password recovery
Route.patch('/verify/', userController.verify);

// [put] first link to password recovery
Route.put('/forgot', userController.forgot);

// [patch] retrieve password
Route.patch('/retrieve', userController.retrieve);

// [patch] edit user details in db --> user && admin
Route.patch('/modify', checkAuth, userController.modify);

// [get] user lists/details from db --> admin
Route.get('/lists', checkAuth, userController.listUsers);

// [delete] delete users from db --> user && admin
Route.delete('/delete', checkAuth, userController.deleteUsers);

// [upgrade] upgrade users access --> user after payment
Route.patch('/upgrade', checkAuth, userController.upgrade);

// payments webhook
Route.post('/payments', userController.paymentsResp);

// authentication gives access to each Route either admin || user
// [user keys] PATCH --> db --> edit users information
// [admin keys] PUT, DELETE, PATCH, GET --> db --> users
module.exports = Route;
