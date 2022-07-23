const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const WrongReqErorr = require('../../react-mesto-api-full/backend/errors/wrong-req-err');

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
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user.id, { name }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new WrongReqErorr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
