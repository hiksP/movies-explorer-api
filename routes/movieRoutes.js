const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movieController');

const movieRoutes = express.Router();

const isUrlMethod = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

movieRoutes.get('/movies', auth, celebrate({
  headers: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), getMovies);

movieRoutes.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrlMethod),
    trailerLink: Joi.string().required().custom(isUrlMethod),
    thumbnail: Joi.string().required().custom(isUrlMethod),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

movieRoutes.delete('/movies/:movieId', auth, celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }).unknown(true),
}), deleteMovie);

exports.movieRoutes = movieRoutes;
