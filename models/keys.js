const mongoose = require('mongoose');

module.exports = mongoose
    .model('key',
        new mongoose.Schema({
          key: {
            type: String,
            required: true,
          },
          status: {
            type: Boolean,
            required: true,
            enum: [true, false],
            default: true,
          },
          user: {
            type: String,
            required: true,
          },
        }));
