const express = require('express');

const userRoutes = express.Router();

userRoutes.get('/me', getMe);

userRoutes.patch('/me', updateUser);

exports.userRoutes = userRoutes;