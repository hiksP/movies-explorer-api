const express = require('express');
const { userRoutes } = require('./userRoutes');
const { movieRoutes } = require('./movieRoutes');

const routes = express.Router();

routes.use('/users', userRoutes);
// routes.use('/movies', movieRoutes);

exports.routes = routes;
