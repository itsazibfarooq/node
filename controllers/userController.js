const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//@desc: register a user
//@route: POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already available");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ _id: newUser.id, email: newUser.email });
  }
  catch (err) {
    res.status(400);
    throw new Error('User cannot be created');
  }


  res.status(200).json(newUser);
});

//@desc: register a user
//@route: POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const user = await User.findOne({ email });

  // compare password with hashed password
  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      // @params: [payload, secret_token, expiry time]
      const accessToken = jwt.sign({
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        }
      },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    }
  }
  catch {
    res.status(401);
    throw new Error('Invalid Credentials')
  }
});

//@desc: get current user
//@route: GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.send(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
