const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { routes } = require('./routes/routes');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { userSignUp, userSignIn, userSignOut } = require('./controllers/userController');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;

const app = express();

app.use(cookieParser());

app.use(requestLogger);
app.use(express.json());
app.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userSignUp);
app.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), userSignIn);
app.post('/signout', auth, celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), userSignOut);
app.use(auth);
app.use(routes);
app.use(errorLogger);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1/bitfilmsdb');

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

main();
