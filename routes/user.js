// eslint-disable-next-line new-cap
const Route = require('express').Router();

const {
  // signUp, signIn,
  // verify, forgot, retrieve,
  // modify,
  generateKey, revokeKey, deleteKey,
  listKey,
  listUsers, deleteUsers,
  upgrade, paymentsResp,
} = require('../controllers/user');
// const checkAuth = require('../middlewares/v2/check-auth');


// generate api key
Route.post('/k/g', /* checkAuth, */ generateKey);

// revoke key
Route.patch('/k/rvk', /* checkAuth, */ revokeKey);

// delete key
Route.delete('/k/dlt', /* checkAuth */ deleteKey);

Route.get('/k/list', /* checkAuth */ listKey);

// add permissions
Route.put('/k/p/add', checkAuth);

// remove permissions
Route.put('/k/p/rm', checkAuth);

// [get] user lists/details from db --> admin
Route.get('/lists', checkAuth, listUsers);

// [delete] delete users from db --> user && admin
Route.delete('/delete', checkAuth, deleteUsers);

// [upgrade] upgrade users access --> user after payment
Route.patch('/upgrade', checkAuth, upgrade);

// payments webhook
Route.post('/payments', paymentsResp);

module.exports = Route;

// // [Routes]
// // [post] add users to db --> admin
// Route.post('/signup', signUp);
//
// // [get] user signs in to get token
// Route.put('/signin', signIn);
//
// // [patch] first link to password recovery
// Route.patch('/verify/', verify);
//
// // [put] first link to password recovery
// Route.put('/forgot', forgot);
//
// // [patch] retrieve password
// Route.patch('/retrieve', retrieve);
//
// // [patch] edit user details in db --> user && admin
// Route.patch('/modify', checkAuth, modify);

// authentication gives access to each Route either admin || user
// [user keys] PATCH --> db --> edit users information
// [admin keys] PUT, DELETE, PATCH, GET --> db --> users
