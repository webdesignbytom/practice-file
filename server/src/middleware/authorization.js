const { Prisma } = require('@prisma/client');
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { findUserById } = require('../domain/users');

const authorization = async (req, res, next) => {
  console.log('hello');

  const header = req.header('authorization');
  console.log('header: ', header);

  if (!header) {
    return res
      .status(409)
      .json({ error: 'Failed to find authorization header', code: `409` });
  }

  const [type, token] = req.get('authorization').split(' ');

  if (type !== `Bearer`) {
    return res.status(409).json({
      error: `Expected Bearer for 'type' but got ${type} instead`,
      code: `409`,
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //         id: 2,
    //   email: 'deandangerous@email.com',
    //   iat: 1674694294,
    //   exp: 1674737494

    const foundUser = await findUserById(decodedToken.id);
    console.log('found user found', foundUser);

    req.user = foundUser;
    console.log('req.user', req.user);
    //
  } catch (error) {
    //
    return res.status(500).json({
      error: error.message,
      message: `Internal server error`,
      code: `500`,
    });
  }

  next()
};

module.exports = {
  authorization,
};
