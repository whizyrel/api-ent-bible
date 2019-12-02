// const api = require('../models/api-collection');
const Key = require('../models/keys');
/* const {
  signUpMail, verificationMail,
  recoveryLink, deleteMail,
} = require('../resources/email-messages'); */

/* const forge = require('node-forge');
const Ravepay = require('ravepay'); */
// const CryptoJS = require('crypto-js');
/* const md5 = require("md5");;
const utf8 = require("utf8"); */
// const Encryption = require('../helpers/encryption');

exports.generateKey = (req, res, next) => {
  const {query: {user}} = req;
  // 0ktgTOtL91

  Key
      .findOne({key})
      .then((doc) => {
        if (doc) {
          return res.status(409).json({
            message: 'Key already exists!',
            key: doc,
          });
        }

        Key.create({key, user})
            .then((doc) => {
              return res.status(201).json({message: 'Success!', key: doc});
            })
            .catch((err) => {
              return res.status(404).json({
                message: 'An error occured => ' + err,
              });
            });
      })
      .catch((err) => {
        return res.status(404).json({
          message: 'An error occured => ' + err,
        });
      });
};

exports.revokeKey = (req, res, next) => {

};

exports.deleteKey = (req, res, next) => {

};

exports.addPermission = (req, res, next) => {

};

exports.removePermission = (req, res, next) => {

};

// users would be pulled from api-collection
/*
  - consider updating user information, create endpoint
    that manages user data on change in gciapp
*/
exports.listUsers = (req, res, next) => {
  User.findOne({
    _id: req.userData.id,
  })
      .then((doc) => {
      // implement doc.accountType - mandatory
        if (doc.accountType === 'admin') {
          User.find({})
              .select('-__v')
              .exec()
              .then((docs) => {
                return res.status(200).json({
                  result: docs,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message: 'An error occured => ' + err,
                });
              });
        } else {
          return res.status(409).json({
            message: 'Authentication failed',
          });
        }
      })
      .catch((err) => {
        return res.status(404).json({
          message: 'An error occured => ' + err,
        });
      });
};

exports.deleteUsers = (req, res, next) => {
  User.findOne({
    _id: req.userData.id,
  })
      .exec()
      .then((doc) => {
        if (doc._id) {
          User.deleteOne({
            _id: req.userData.id,
          })
              .exec()
              .then((result) => {
                // notify me and client of this operation
                return res.status(200).json({
                  message: 'Success!',
                });
              })
              .catch((err) => {
                return res.status(422).json({
                  message: 'Operation failed => ' + err,
                });
              });
        } else {
          return res.status(404).json({
            message: 'Account doesn\'t exist! => ' + err,
          });
        }
      })
      .catch((err) => {
        return res.status(404).json({
          message: 'Operation failed => ' + err,
        });
      });
};

exports.upgrade = (req, res, next) => {
  /*  const txRef = 'MC-' + Date.now() + 'GCI';

  // i guess in dollar equivalent
  const amount = '30000';

  const rave = new Ravepay(pubKey, secKey, true);
  */
  // This is the Encryption function that encrypts your
  // payload by passing the stringified format and your Encryption Key.
  /**
   * @function encrypt
   * @param {String} key
   * @param {String} text
   * @return {Object}
   */
  /*  function encrypt(key, text) {
    const cipher = forge.cipher.createCipher(
        '3DES-ECB',
        // @ts-ignore
        forge.util.createBuffer(key)
    );
    cipher.start({
      iv: '',
    });
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    const encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }

  User.findOne({
    _id: req.userData.id,
  })
      .then((doc) => {
        const payload = {
          cardno: req.body.no.toString(),
          cvv: req.body.cvv.toString(),
          expirymonth: req.body.expirymonth,
          expiryyear: req.body.expiryyear,
          currency: req.body.currency,
          pin: req.body.pin.toString(),
          country: 'NG',
          amount: amount,
          email: doc.email.toLowerCase(),
          phonenumber: doc.phonenumber.toString(),
          suggested_auth: 'PIN',
          firstname: doc.firstname,
          lastname: doc.lastname,
          txRef: txRef,
        };

        rave.Card.charge(encrypt(encKey, payload))
            .then((resp) => {
              res.status(200).json({
                message: resp,
              }); */
  // Get the ref of the card charge from response body.
  // This will be used to validate the transaction
  // On successful charge, validate the transaction to
  // complete the payment.
  // We create a payload with public key, and transaction
  // ref obtained from charge response. up here
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
  /* })
            .catch((err) => {
              // Handle error
              res.status(404).json({
                message: 'Operation failed => ' + err,
              });
            });
        res.status(200).json({
          message: payload,
        });
      })
      .catch((err) => {
        res.status(404).json({
          message: 'Operation failed => ' + err,
        });
      }); */
};

exports.paymentsResp = (req, res, next) => {
  /* // retrieve the signature from the header
  const hash = req.headers.HTTP_VERIF_HASH;

  if (!hash) {
    // discard the request, only a post with
    // rave signature header gets our attention
    return res.status(400).json({
      body: 'Invalid request',
    });
  }

  // Get signature stored as env variable on your server
  const secretHash = process.env.VHOOK;

  // check if signatures match
  if (hash !== secretHash) {
    // silently exit, or check that you
    // are passing the write hash on your server.
    return res.send(401).json({
      body: '',
    });
  }

  // Retrieve the request's body
  // const requestJSON = JSON.parse(req.body);

  // Give value to your customer but don't give any output
  // Remember that this is a call from rave's servers and
  // Your customer is not seeing the response here at all

  // notify me of payment and notify my client by mail

  res.send(200); */
};

// upgrade, webhook, mails, frontend
