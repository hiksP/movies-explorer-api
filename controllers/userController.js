const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { User } = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const WrongReqError = require('../errors/WrongReqError');
const WrongAuthError = require('../errors/WrongAuthError');
const CreatedUserError = require('../errors/CreatedUserError');
const NoRightsError = require('../errors/NoRightsError');

const { NODE_ENV, JWT_SECRET } = process.env;
const secret = NODE_ENV === 'production' ? JWT_SECRET : 'pass';

exports.getMe = async (req, res, next) => {
  const userToken = req.cookies.jwt;
  const decoded = jwt.verify(userToken, secret);
  try {
    const user = await User.findById(decoded.id);
    if (user == null) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.send({
        email: user.email,
        name: user.name,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { name, email }, {
      new: true,
      runValidators: true,
    });
    res.send({
      email,
      name,
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new WrongReqError('Переданы некорректные данные'));
    } else if (err.codeName === 'DuplicateKey') {
      next(new CreatedUserError('Пользователь с такими данными уже есть'));
    } else {
      next(err);
    }
  }
};

exports.userSignUp = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    res.send({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new CreatedUserError('Пользователь с такой почтой уже есть!'));
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new WrongReqError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

exports.userSignIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new WrongAuthError('Не введен логин или пароль');
  } else {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = getJwtToken(user._id);
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          })
          .send({ token });
      })
      .catch((err) => {
        next(new WrongAuthError(err.message));
      });
  }
};

exports.userSignOut = async (req, res, next) => {
  if (req.cookies.jwt) {
    res.status(202).clearCookie('jwt').send('Вы вышли');
  } else {
    next(new NoRightsError('Для того чтобы выйти надо для начала зайти....'));
  }
};
