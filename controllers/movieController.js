const { Movie } = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const WrongReqError = require('../errors/WrongReqError');
const NoRightsError = require('../errors/NoRightsError');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    if (movies.length < 1) {
      throw new NotFoundError('Фильмы не найдены');
    } else {
      res.send(movies);
    }
  } catch (err) {
    next(err);
  }
};

exports.addMovie = async (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user.id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongReqError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

exports.deleteMovie = async (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner.toString() === req.user.id) {
        movie.remove();
        res.send({ data: movie });
      } else {
        throw new NoRightsError('Недостаточно прав');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new WrongReqError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
