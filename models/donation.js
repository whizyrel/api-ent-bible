const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Donation = new Schema({
  date: { type: String },
  time: { type: String },
  name: { type: String, required: true },
  txRef: {type: String, required: true},
  email: {
    type: String,
    required: true,
    match: [
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
      "invalid email"
    ]
  },
  phone: { type: String, required: true },
  message: {type: String, required: false},
  amount: { type: String, required: true },
});

module.exports = mongoose.model('Donation', Donation);