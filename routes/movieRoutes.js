const express = require('express');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movieController');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);

movieRoutes.post('/', addMovie);

movieRoutes.delete('/:id', deleteMovie);

exports.movieRoutes = movieRoutes;
