const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { routes } = require('./routes/routes');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { signRoutes } = require('./routes/signRoutes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const cors = require('./middlewares/cors');

const PORT = 3000;
const DBadress = process.env.DB || 'mongodb://127.0.0.1/bitfilmsdb';

const app = express();

app.use(cookieParser());

app.use(requestLogger);
app.use(cors);
app.use(express.json());
app.use(signRoutes);
app.use(auth);
app.use(routes);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect(DBadress);

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

main();
