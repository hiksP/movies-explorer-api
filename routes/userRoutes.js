const express = require('express');
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { getMe, updateUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const isEmailMethod = (value) => {
  const result = validator.isEmail(value);
  if (result) {
    return value;
  }
  throw new Error('Email validation err');
};

const userRoutes = express.Router();

userRoutes.get('/users/me', auth, celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getMe);

userRoutes.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(isEmailMethod).min(2)
      .max(30),
  }),
}), updateUser);

exports.userRoutes = userRoutes;
