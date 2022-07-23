const express = require('express');
const { getMe, updateUser } = require('../controllers/userController');

const userRoutes = express.Router();

userRoutes.get('/me', getMe);

userRoutes.patch('/me', updateUser);

exports.userRoutes = userRoutes;
