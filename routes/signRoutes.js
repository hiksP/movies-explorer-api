const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { userSignUp, userSignIn, userSignOut } = require('../controllers/userController');

const signRoutes = express.Router();

signRoutes.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userSignUp);

signRoutes.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userSignIn);

signRoutes.post('/signout', auth, celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), userSignOut);

exports.signRoutes = signRoutes;
