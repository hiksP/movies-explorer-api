const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getMe, updateUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.get('/me', auth, celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getMe);

userRoutes.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

exports.userRoutes = userRoutes;
