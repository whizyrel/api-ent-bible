const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* const md5 = require("md5");
const cryptoJs = require("crypto-js");
const utf8 = require("utf8"); */
const forge = require("node-forge");
// @ts-ignore
const ravepay = require("ravepay");
const sendgrid = require('sendgrid');

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .select("-_id -__v")
    .exec()
    .then(result => {
      if (result < 1) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: err
            });
          } else {
            User.create({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              organisation: req.body.organisation,
              address: req.body.address,
              email: req.body.email,
              password: hash,
              accountType: req.body.accountType,
              package: req.body.package
            })
              .then(doc => {
                // notify user of success
                res
                  .status(201)
                  .json({
                    message:
                      "Sign up Successful",
                    details: {
                      name: doc.name,
                      email: doc.email
                    },
                    all: doc
                  });
              })
              .catch(err => {
                res.status(500).json({
                  message: err + " :Couldn't create user"
                });
              });
          }
        });
      } else {
        res.status(409).json({
          message: "User exists"
        });
      }
    });
};

exports.signIn = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .select("-__v")
    .exec()
    .then(doc => {
      if (doc) {
        bcrypt.compare(req.body.password, doc.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Authentication failed!"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: doc.email,
                id: doc._id
              },
              // @ts-ignore
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            // req.setHeader("Authorization", "Bearer " + token);
            // console.log(req.headers);
            return res.status(200).json({
              message: "Authentication Successful",
              details: { token: token }
            });
            // mail user the id as api key
          }
          res.status(401).json({
            message: "Authentication failed"
          });
        });
      } else {
        res.status(401).json({
          message: "Authentication failed"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err + " : Operation failed"
      });
    });
};

exports.modify = (req, res, next) => {
  const ops = {};
  for (let op of req.body) {
    ops[op.prop] = op.val;
  }
  User.updateOne({ _id: req.userData.id }, { $set: ops })
    .exec()
    .then(result => {
      res.status(200).json({ message: "Operation Successful" });
      // notify user of success
    })
    .catch(err => {
      res.status(500).json({
        message: err + " : Operation failed"
      });
    });
};

// forgot password route
exports.retrieve = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: err
      });
    } else {
      // check if email exists first, then update password with new password
      User.findOne({ email: req.body.email })
        .exec()
        .then(result => {
          if (result.email) {
            User.update({ email: req.body.email }, { $set: { password: hash } })
              .exec()
              .then(result => {
                res.status(200).json({
                  message: "Operation Successful",
                  result: result.pasword
                });
                // notify user of success
              })
              .catch(err => {
                res.status(500).json({
                  message: err + " : Operation failed"
                });
              });
          } else {
            return res.status(404).json({
              message: "Authentication failed!"
            });
          }
        })
        .catch(err => {
          res.status(500).json({ error: err + " : Operation failed" });
        });
    }
  });
};

exports.listUsers = (req, res, next) => {
  User.findOne({ _id: req.userData.id })
    .then(doc => {
      // implement doc.accountType - mandatory
      if (doc.accountType !== "regular") {
        User.find({})
          .select("-__v")
          .exec()
          .then(docs => {
            res.status(200).json({ results: docs });
          })
          .catch(err => {
            res.status(500).json({ message: err });
          });
      } else {
        res.status(409).json({
          message: "Authentication failed"
        });
      }
    })
    .catch(err => {
      res.status(404).json({ error: err });
    });
};

exports.deleteUsers = (req, res, next) => {
  User.findOne({ _id: req.userData.id })
    .exec()
    .then(doc => {
      if (doc._id) {
        User.findOneAndDelete({ _id: req.userData.id })
          .exec()
          .then(result => {
            res.status(200).json({ message: "Account successfully deleted" });
          })
          .catch(err => {
            res.status(422).json({ error: err });
          });
        // notify me and clint of operation
      } else {
        res.status(404).json({ message: "Account doesn't exist!" });
      }
    })
    .catch(err => {
      res.status(404).json({
        message: err
      });
    });
};

exports.upgrade = (req, res, next) => {
  let pubKey = process.env.PUB_KEY;
  let secKey = process.env.SEC_KEY;
  let encKey = process.env.ENC_KEY;
  const txRef = "MC-" + Date.now() + "GCI";

  // i guess in dollar equivalent
  const amount = "30000";

  let rave = new ravepay(pubKey, secKey, true);

  // This is the encryption function that encrypts your payload by passing the stringified format and your encryption Key.
  function encrypt(key, text) {
    var cipher = forge.cipher.createCipher(
      "3DES-ECB",
      // @ts-ignore
      forge.util.createBuffer(key)
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    var encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }

  User.findOne({ _id: req.userData.id })
    .then(doc => {
      const payload = {
        cardno: req.body.no.toString(),
        cvv: req.body.cvv.toString(),
        expirymonth: req.body.expirymonth,
        expiryyear: req.body.expiryyear,
        currency: req.body.currency,
        pin: req.body.pin.toString(),
        country: "NG",
        amount: amount,
        email: doc.email,
        phonenumber: doc.phonenumber.toString(),
        suggested_auth: "PIN",
        firstname: doc.firstname,
        lastname: doc.lastname,
        txRef: txRef
      };

      rave.Card.charge(encrypt(encKey, payload))
        .then(resp => {
          res.status(200).json({
            message: resp
          });
          //Get the ref of the card charge from response body. This will be used to validate the transaction

          //On successful charge, validate the transaction to complete the payment.
          // We create a payload with public key, and transaction ref obtained from charge response. up here
          /* var payloadresp = {
            PBFPubKey: pubKey,
            transaction_reference: resp.body,
            otp: ""
          };

          rave.Card.validate(payloadresp)
            .then(resp => {
              res
                .status(200)
                .json({
                  result: resp,
                  message: "you've reached upgrade route"
                });
            })
            .catch(err => {
              // Handle error
              res.status(404).json({ message: err });
            }); */
          // change accountType to premium, notify me and client
        })
        .catch(err => {
          // Handle error
          res.status(404).json({ message: err });
        });
      res.status(200).json({
        message: payload
      });
    })
    .catch(err => {
      res.status(404).json({ message: err });
    });
};

exports.paymentsResp = (req, res, next) => {
  // retrieve the signature from the header
  var hash = req.headers["HTTP_VERIF_HASH"];

  if (!hash) {
    // discard the request, only a post with rave signature header gets our attention
    return res.status(400).json({ body: "Invalid request" });
  }

  // Get signature stored as env variable on your server
  const secret_hash = process.env.VHOOK;

  // check if signatures match
  if (hash !== secret_hash) {
    // silently exit, or check that you are passing the write hash on your server.
    return res.send(401).json({ body: "" });
  }

  // Retrieve the request's body
  var request_json = JSON.parse(req.body);

  // Give value to your customer but don't give any output
  // Remember that this is a call from rave's servers and
  // Your customer is not seeing the response here at all

  // notify me of payment and notify my client by mail

  res.send(200);
};

// upgrade, webhook, mails, frontend