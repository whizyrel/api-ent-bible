const Donation = require('../models/donation');

exports.give = (req, res, next) => {
  // redirect to Donation Page
  // collect donation details and save to DB
  Donation.create({
    date: new Date().toDateString(),
    time: new Date().toTimeString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    amount: parseInt(req.body.amount),
    message: req.body.message,
  })
      .then((doc) => {
      // rediect to donation Page
        res
            .status(201)
            .json({
              message: 'Donation received',
              details: {
                name: doc.name,
                email: doc.email,
                phone: doc.phone,
                amount: parseInt(doc.amount),
                message: doc.message,
              },
            });
      // notify, appreciating such person
      })
      .catch((err) => {
        res.status(500).json({message: err});
      });
};

exports.list = (req, res, next) => {
  // list donations from database
  Donation.find({})
      .select('-__v')
      .exec()
      .then((docs) => {
        res.status(200).json({
          results: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({message: err});
      });
};
