const Feedback = require("../models/feedback");

exports.submitFeedback = (req, res, next) => {
  let imgPaths = [];

  if (req.files.imagePaths) {
    for (const img of req.files.imagePaths) {
      imgPaths.push(img.path);
    }
  }

  Feedback.create({
    date: new Date().toDateString(),
    time: new Date().toTimeString(),
    name: req.body.name,
    email: req.body.email,
    imagePaths: imgPaths,
    body: req.body.body
  })
    .then(doc => {
      res
        .status(201)
        .json({
          request: {
            name: doc.name,
            email: doc.email,
            imagePaths: doc.imagePaths,
            title: doc.title,
            body: doc.body
          }
        });
      // notify the sender
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    }); 
};

// must list feedbacks with all their properties
exports.listFeedbacks = (req, res, next) => {
  Feedback.find({})
    .select('-__v')
    .exec()
    .then(docs => {
      res.status(200).json({
        results: docs
      })
    })
    .catch(err => {
      res.status(422).json({ message: err });
    });
};

exports.editFeedbacks = (req, res, next) => {
  Feedback.updateOne({ _id: req.params.id }, { $set: {status: 'stale'} })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Operation Successful'
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err + ' : Operation failed'
      });
    });
};