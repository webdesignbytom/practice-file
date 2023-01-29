const { Prisma } = require('@prisma/client');
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { findUserByEmail } = require('../domain/users');

const login = async (req, res) => {
  console.log('logging in...');
  const { email, password } = req.body;
  console.log('req.body', req.body);

  const lowerCaseEmail = email.toLowerCase();
  console.log('lower case email', lowerCaseEmail);

  if (!email || !password) {
    return res.status(400).json({
      message: `Missing fields Dave`,
    });
  }

  try {
    const existingUser = await findUserByEmail(lowerCaseEmail);
    console.log('existing user', existingUser);

    if (!existingUser) {
      return res.status(400).json({
        message: `User with email ${lowerCaseEmail} not found Dave`,
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch)
      return res
        .status(409)
        .json({ error: { message: 'Incorrect login information Dave' } });

    console.log('passwordMatch', passwordMatch);

    const token = createAccessToken(existingUser.id, existingUser.email);
    console.log('token', token);

    return res
      .status(200)
      .json({ message: `Login succesful Dave`, data: token, user: existingUser });
      //
  } catch (error) {
    //
    return res.status(500).json({
      error: error.message,
    });
  }
};

const createAccessToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = {
  login,
};
