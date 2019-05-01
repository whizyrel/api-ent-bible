const {
  /* PUB_KEY: pubKey, SEC_KEY: secKey, ENC_KEY: encKey, */
  JWT_KEY: JWT_KEY, DOMAIN_NAME: DomainName, SENDGRID_API_KEY,
  MAIL,
} = process.env;

const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/user');

const sgMailer = require('../helpers/sg-mailer')(SENDGRID_API_KEY);
const jwtLinker = require('../helpers/jwt-sign-enc-link-generator');
const {
  signUpMail, verificationMail,
  recoveryLink, deleteMail,
} = require('../resources/email-messages');

/* const forge = require('node-forge');
const Ravepay = require('ravepay'); */
// const CryptoJS = require('crypto-js');
/* const md5 = require("md5");;
const utf8 = require("utf8"); */
// const Encryption = require('../helpers/encryption');

exports.signUp = (req, res, next) => {
  User.findOne({
    email: req.body.email.toLowerCase(),
  })
      .select('-_id -__v')
      .exec()
      .then((result) => {
        if (!result) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500)
                  .json({
                    message: 'An error occured',
                  });
            } else {
              const details = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                organisation: req.body.organisation,
                address: req.body.address,
                email: req.body.email.toLowerCase(),
                password: hash,
                accountType: req.body.accountType,
                package: req.body.package,
              };

              User.create(details)
                  .then((doc) => {
                    // notify user of success via mail with verification link
                    jwtLinker.form({
                      payload: {
                        email: doc.email.toLowerCase(),
                        id: doc._id,
                      },
                      // @ts-ignore
                      key: JWT_KEY,
                      options: {
                        expiresIn: 31622400,
                      },
                    }, {
                      mode: 'query',
                      name: 'enc',
                    }, DomainName + '/users/verify');
                    const encodedData = jwtLinker.token;

                    // send account creation successful and verification mail
                    const verificationLink = jwtLinker.encryptedLink();

                    sgMailer
                        .configure(
                            {
                              from: MAIL,
                              replyTo: 'Sign Up',
                              content: [
                                'plain',
                                [
                                  sgMailer
                                      .createText(
                                          signUpMail(doc, verificationLink)
                                      ),
                                ],
                              ],
                            }
                        )
                        .personalize([{
                          to: [{
                            email: doc.email,
                          }],
                          subject: 'Verification Link',
                        }])
                        .sendMail()
                        .then((res) => {
                          if (res) {
                            res
                                .status(201)
                                .json({
                                  message:
                                    `Success! Find verification link in ${
                                      doc.email
                                    }`,
                                  encData: encodedData,
                                  link: verificationLink,
                                  details: doc,
                                });
                          }
                        })
                        .catch((err) => {
                          return res.status(500).json({
                            message: err + ': An error occurred => ' + err,
                          });
                        });
                  })
                  .catch((err) => {
                    res
                        .status(500)
                        .json({
                          message: 'Couldn\'t create Account => ' + err,
                        });
                  });
            }
          });
        } else {
          res.status(409).json({
            message: 'Account already exists',
          });
        }
      }).catch((err) => {
        res.status(500).json({
          message: 'An error occurred => ' + err,
        });
      });
};

exports.verify = (req, res, next) => {
  const token = req.query.enc;
  console.log(req.query.enc);

  try {
    const decodedData = JWT.verify(token, JWT_KEY);

    User.findOne({
      email: decodedData.email,
    })
        .select('-__v')
        .exec()
        .then((doc) => {
          // check if user is verified
          if (doc.status === true) {
            return res.status(403).json({
              message: 'Already Verified!',
            });
          }
          User.updateOne({
            _id: doc._id,
          }, {
            status: true,
          })
              .exec()
              .then((result) => {
                // notify user of verification success via
                // mail containing the id as api key
                const encodedKey =
                  Buffer
                      .from(doc._id.toString())
                      .toString('base64');

                sgMailer
                    .configure(
                        {
                          from: MAIL,
                          replyTo: 'Account Verification',
                          content: [
                            'plain',
                            [
                              sgMailer
                                  .createText(
                                      verificationMail(doc, encodedKey)
                                  ),
                            ],
                          ],
                        }
                    )
                    .personalize([{
                      to: [{
                        email: doc.email,
                      }],
                      subject: 'API Key',
                    }])
                    .sendMail()
                    .then((res) => {
                      if (res) {
                        return (
                          res
                              .status(200)
                              .json({
                                message: 'Your Account is now Verified!',
                                key: encodedKey,
                              })
                        );
                      }
                    })
                    .catch((err) => {
                      return res.status(500).json({
                        message: err + ': An error occurred => ' + err,
                      });
                    });
              })
              .catch((err) => {
                return res.status(500).json({
                  message: 'Operation failed => ' + err,
                });
              });
        })
        .catch((err) => {
          return res.status(500).json({
            message: 'Operation failed => ' + err,
          });
        });
  } catch (err) {
    return res.status(401)
        .json({message: 'Authentication failed'});
  }
};

exports.signIn = (req, res, next) => {
  User.findOne({
    email: req.body.email.toLowerCase(),
  })
      .select('-__v')
      .exec()
      .then((doc) => {
        if (doc) {
          bcrypt.compare(
              req.body.password, doc.password,
              (err, result) => {
                if (err) {
                  return res
                      .status(401)
                      .json({
                        message: 'Authentication failed!',
                      });
                }
                if (result) {
                  const token = jwtLinker.create({
                    payload: {
                      email: doc.email.toLowerCase(),
                      id: doc._id,
                    },
                    options: {
                      expiresIn: '2h',
                    },
                    // @ts-ignore
                    key: JWT_KEY,
                  }).token;

                  // const token = jwtLinker.token;
                  if (doc.status) {
                    return res
                        .status(200)
                        .json({
                          message: 'Authentication Successful',
                          token: token,
                          details: doc,
                        });
                  } else {
                    return res
                        .status(403)
                        .json({
                          message: 'Unverified! Check your mail for link',
                        });
                    // probably consider didnt get verification link
                  }
                } else {
                  return res.status(401).json({
                    message: 'Authentication failed',
                  });
                }
              });
        } else {
          return res.status(404).json({
            message: 'Acount doesn\'t exist',
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: 'Operation failed => ' + err,
        });
      });
};

exports.modify = (req, res, next) => {
  const ops = {};
  const opts = req.body;
  for (const opt of opts) {
    ops[opt.key] = opt.value;
  }

  User.updateOne({
    _id: req.userData.id,
  }, {
    $set: ops,
  })
      .exec()
      .then((result) => {
        return res.status(200).json({
          message: 'Operation Successful',
        });
      // notify user of success
      })
      .catch((err) => {
        return res.status(500).json({
          message: 'Operation failed => ' + err,
        });
      });
};

// forgot password route from sign in view
exports.forgot = (req, res, next) => {
  // search for email
  User.findOne({
    email: req.body.email.toLowerCase(),
  })
      .exec()
      .then((doc) => {
        // encrypt user email
        const verificationLink =
          jwtLinker.form({
            payload: {
              email: doc.email.toLowerCase(),
              id: doc._id,
            },
            // @ts-ignore
            key: JWT_KEY,
            options: {
              expiresIn: 1800,
            },
          }, {
            mode: 'query',
            name: 'enc',
          }, DomainName + '/users/retrieve')
              .encryptedLink();

        const encodedData = jwtLinker.token;

        // send a password recovery link to user's mail with authorization check
        if (doc) {
          // send recovery link to email
          sgMailer
              .configure(
                  {
                    from: MAIL,
                    replyTo: 'Forgot Credentials',
                    content: [
                      'plain',
                      [
                        sgMailer
                            .createText(
                                recoveryLink(doc, verificationLink)
                            ),
                      ],
                    ],
                  }
              )
              .personalize([{
                to: [{
                  email: doc.email,
                }],
                subject: 'Recovery Link',
              }])
              .sendMail()
              .then((res) => {
                if (res) {
                  return (
                    res.status(200)
                        .json({
                          message:
                        'Link to recover password has been sent to your Mail',
                          enc: encodedData,
                          link: verificationLink,
                        })
                  );
                }
              })
              .catch((err) => {
                return res.status(500).json({
                  message: err + ': An error occurred => ' + err,
                });
              });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: 'Operation failed => ' + err,
        });
      });
};

// forgot password route sent to mail
exports.retrieve = (req, res, next) => {
  const data = req.query.enc;

  try {
    const decodedData = JWT.verify(data, JWT_KEY);

    User.findOne({
      email: decodedData.email,
    })
        .select('-__v')
        .exec()
        .then((doc) => {
          if (doc) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  message: err,
                });
              }
              if (hash) {
                User.update({
                  email: decodedData.email.toLowerCase(),
                }, {
                  $set: {
                    password: hash,
                  },
                })
                    .exec()
                    .then((result) => {
                      return res
                          .status(200)
                          .json({
                            message: 'Operation Successful',
                            result: result.password,
                          });
                    })
                    .catch((err) => {
                      res
                          .status(500)
                          .json({
                            message: 'Operation failed => ' + err,
                          });
                    });
              }
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            message: 'Operation failed '+ err,
          });
        });
  } catch (err) {
    return res.status(401).json({message: 'Authentication failed'});
  }
};

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
                sgMailer
                    .configure(
                        {
                          from: MAIL,
                          replyTo: 'Account Cancelation',
                          content: [
                            'plain',
                            [
                              sgMailer
                                  .createText(
                                      deleteMail(doc)
                                  ),
                            ],
                          ],
                        }
                    )
                    .personalize([{
                      to: [{
                        email: doc.email,
                      }],
                      subject: 'Deleted Account',
                    }])
                    .sendMail()
                    .then((res) => {
                      if (res) {
                        return (
                          res.status(200).json({
                            message: 'Success!',
                          })
                        );
                      }
                    })
                    .catch((err) => {
                      return res.status(500).json({
                        message: err + ': An error occurred => ' + err,
                      });
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
