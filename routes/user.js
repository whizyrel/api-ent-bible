const express = require("express");

const userController = require("../controllers/user");
const checkAuth = require("../middlewares/check-auth");

const route = express.Router();

// [routes]
// [post] add users to db --> admin
route.post("/signup", userController.signUp);

// [get] user signs in to get token
route.put("/signin", userController.signIn);

// [patch] first link to password recovery
route.patch("/verify/:enc", userController.verify);

// [put] first link to password recovery
route.put("/forgot", userController.forgot);

// [patch] retrieve password
route.patch("/retrieve", userController.retrieve);

// [patch] edit user details in db --> user && admin
route.patch("/modify", checkAuth, userController.modify);

// [get] user lists/details from db --> admin
route.get("/lists", checkAuth, userController.listUsers);

// [delete] delete users from db --> user && admin
route.delete("/delete", checkAuth, userController.deleteUsers);

// [upgrade] upgrade users access --> user after payment
route.patch("/upgrade", checkAuth, userController.upgrade);

// payments webhook
route.post("/payments", userController.paymentsResp);

// authentication gives access to each route either admin || user
// [user keys] PATCH --> db --> edit users information
// [admin keys] PUT, DELETE, PATCH, GET --> db --> users
module.exports = route;