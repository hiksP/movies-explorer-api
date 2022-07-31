const express = require('express');
const { userRoutes } = require('./userRoutes');
const { movieRoutes } = require('./movieRoutes');

const routes = express.Router();

routes.use(userRoutes);
routes.use(movieRoutes);

exports.routes = routes;
