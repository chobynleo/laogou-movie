'use strict';

var mongoose = require('mongoose'),
    MovieSeeSchema = require('../../schemas/movie/movie_see'),
    MovieSee = mongoose.model('MovieSee', MovieSeeSchema);

module.exports = MovieSee;
