const mongoose = require('mongoose');

module.exports = mongoose.model('api-collection', new Schema({
  key: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  permissions: {
    type: Object,
    required: true,
    default: {},
  },
  access: {
    type: Boolean,
    reqired: true,
    default: true,
    enum: [true, false],
  },
}));

// oList - opera | Opera | intldella@gmail.com
