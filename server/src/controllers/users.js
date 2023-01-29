const { Prisma } = require('@prisma/client');
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashRate = 8;

const {
  findAllUsers,
  findUserByEmail,
  findUserById,
  createUser,
  deleteUserByID,
} = require('../domain/users');

const getAllUsers = async (req, res) => {
  console.log('getting all users...');

  try {
    //
    const foundUsers = await findAllUsers();

    if (!foundUsers) {
      return res.status(404).json({
        status: `404 Not Found`,
        message: `No users were found`,
        code: `404`,
      });
    }

    if (foundUsers.length === 0) {
      return res.status(403).json({
        message: `Database is currently empty and no users were found`,
      });
    }

    return res.status(201).json({
      message: `Found ${foundUsers.length} users`,
      code: `201`,
      data: foundUsers,
    });
    //
  } catch (error) {
    //
    return res.status(500).json({
      code: `500`,
      error: error.message,
      message: `Internal server error: ${error.message}, code: 500`,
    });
  }
};

const registerNewUser = async (req, res) => {
  console.log('registering new user...');

  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    if (!lowerCaseEmail || !password) {
      return res.status(404).json({
        error: `Missing fields in body`,
        code: `404`,
      });
    }

    const foundUser = await findUserByEmail(lowerCaseEmail);

    if (foundUser) {
      return res
        .status(409)
        .json({ error: `User already exists with this email`, code: `409` });
    }

    const hashedPassword = await bcrypt.hash(password, hashRate);

    const newUser = await createUser(
      lowerCaseEmail,
      hashedPassword,
    );

    return res.status(200).json({
      message: `User ${newUser.email} created`,
      code: `200`,
      data: newUser,
    });
    //
  } catch (error) {
    //
    return res.status(500).json({
      code: `500`,
      error: error.message,
      message: `Internal server error: ${error.message}, code: 500`,
    });
  }
};

const getUserById = async (req, res) => {
  console.log('getting user by id');

  const userId = Number(req.params.id);
  console.log('user id: ' + userId);

  try {
    const foundUser = await findUserById(userId);
    console.log('found user: ' + foundUser);

    if (!foundUser) {
      res
        .status(404)
        .json({ error: `Cannot find a user with that ID`, code: `404` });
    }

    return res.status(200).json({
      message: `User Id: ${foundUser.id} found`,
      code: `200`,
      data: foundUser,
    });
    //
  } catch (error) {
    //
    return res.status(500).json({
      error: error.message,
      message: `Internal server error`,
      code: `500`,
    });
  }
};

const deleteUser = async (req, res) => {
  console.log('deleting user');

  const userId = Number(req.params.id);
  console.log('id: ' + userId);

console.log('req.user xxxxx', req.user.id);
  try {

    if (req.user.role !== 'ADMIN') {
      return res.status(409).json({
        error: `Missing Authorization to perform request`,
        code: `409`,
      });
    }

    const foundUser = await findUserById(userId)
    console.log('found user: ' + foundUser);

    if (!foundUser) {
      res
        .status(404)
        .json({ error: `Cannot find a user with that ID devil`, code: `404` });
    }

    const deletedUser = await deleteUserByID(userId)
    console.log('deletedUsaer', deletedUser);

    
    return res.status(201).json({
      message: `User Id: ${userId} deleted`,
      code: `201`,
      data: deleteUser,
    });
    //
  } catch (error) {
    //
    return res.status(500).json({
      error: error.message,
      message: `Internal server error`,
      code: `500`,
    });
  }
};

module.exports = {
  getAllUsers,
  registerNewUser,
  getUserById,
  deleteUser,
};
