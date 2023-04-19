const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the user name"]
  },
  email: {
    type: String,
    required: [true, "Please add your email"],
    unique: [true, "Email address already taken"]
  },
  password: {
    type: String,
    required: [true, "Enter Password"]
  }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('user', userSchema);