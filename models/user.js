/* eslint-disable max-len */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  firstname: {
    type: String,
    required: true,
    set: (val) => {
      if (typeof val !== 'string') val = '';
      return val.charAt(0).toUpperCase() + val.substring(1);
    },
  },
  lastname: {
    type: String,
    required: true,
    set: (val) => {
      if (typeof val !== 'string') val = '';
      return val.charAt(0).toUpperCase() + val.substring(1);
    },
  },
  organisation: {
    type: String,
    required: true,
    set: (val) => {
      if (typeof val !== 'string') val = '';
      return val.charAt(0).toUpperCase() + val.substring(1);
    },
  },
  address: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    toLowerCase: true,
    required: true,
    match: [
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
      'invalid email',
    ],
  },
  status: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    default: 'regular',
    enum: ['regular', 'admin'],
  },
  package: {
    type: String,
    default: 'classic',
    required: true,
    enum: ['classic', 'premium'],
  },
});

module.exports = mongoose.model('User', User);
