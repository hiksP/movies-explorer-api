const express = require('express');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);

movieRoutes.post('/', addMovie);

movieRoutes.delete('/:id', deleteMovie);

exports.movieRoutes = movieRoutes;
