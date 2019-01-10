const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  organisation: { type: String, required: false },
  address: { type: String, required: true },/* 
  phonenumber: {type: String, required: true}, */
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
      "invalid email"
    ]
  },
  status: {type: Boolean, default: false},
  password: { type: String, required: true },
  accountType: { type: String , default: 'regular', required: true  },
  package: { type: String , default: 'classic', required: true  }
});

module.exports = mongoose.model("User", User);