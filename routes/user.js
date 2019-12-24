// eslint-disable-next-line new-cap
const route = require('express').Router();

const {
  // signUp, signIn,
  // verify, forgot, retrieve,
  // modify,
  generateKey, keyMgmt, deleteKey,
  listKey,
  listUsers, deleteUsers,
  upgrade, paymentsResp,
} = require('../controllers/user');
const checkAuth = require('../middlewares/v2/check-auth');


// generate api key
route.post('/k/g', /* checkAuth, */ generateKey);

// revoke key
route.patch('/k/mgmt/:ac', /* checkAuth, */ keyMgmt);

// delete key
route.delete('/k/dlt', /* checkAuth */ deleteKey);

route.get('/k/l', /* checkAuth */ listKey);

// add permissions
route.put('/k/p/a', checkAuth);

// remove permissions
route.put('/k/p/rm', checkAuth);

// [get] user lists/details from db --> admin
route.get('/lists', checkAuth, listUsers);

// [delete] delete users from db --> user && admin
route.delete('/delete', checkAuth, deleteUsers);

// [upgrade] upgrade users access --> user after payment
route.patch('/upgrade', checkAuth, upgrade);

// payments webhook
route.post('/payments', paymentsResp);

module.exports = route;

// // [routes]
// // [post] add users to db --> admin
// route.post('/signup', signUp);
//
// // [get] user signs in to get token
// route.put('/signin', signIn);
//
// // [patch] first link to password recovery
// route.patch('/verify/', verify);
//
// // [put] first link to password recovery
// route.put('/forgot', forgot);
//
// // [patch] retrieve password
// route.patch('/retrieve', retrieve);
//
// // [patch] edit user details in db --> user && admin
// route.patch('/modify', checkAuth, modify);

// authentication gives access to each route either admin || user
// [user keys] PATCH --> db --> edit users information
// [admin keys] PUT, DELETE, PATCH, GET --> db --> users
