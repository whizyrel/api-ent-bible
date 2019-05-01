/* eslint-disable new-cap */
const express = require('express');
const multer = require('multer');

const {
  submitFeedback, listFeedbacks,
  editFeedbacks,
} = require('../controllers/feedback');
const checkAuth = require('../middlewares/check-auth');

const route = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toDateString() + '-' + file.originalname);
  },
});

const fileFilter = function(req, file, cb) {
  const condition =
    'file.mimeType == \'image/jpeg\' || file.mimeType == \'image/png\' ||' +
  'file.mimeType == \'image/jpg\' || file.mimeType == \'image/bmp\'';
  if (condition) {
    cb(null, true);
  } else {
    cb({error: new Error('invalid file type')}, false);
  }
};

const uploads = multer({
  storage: storage,
  fileFilter: fileFilter,
  // @ts-ignore
  limit: {
    fileSize: 1024 * 1024 * 5,
  },
});

route.post('/submit',
    uploads.fields([{name: 'imagePaths'}]),
    submitFeedback
);

route.get('/list', checkAuth, listFeedbacks);

route.patch('/archive/:id', checkAuth, editFeedbacks);

module.exports = route;
