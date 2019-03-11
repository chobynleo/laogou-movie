'use strict';

var mongoose = require('mongoose'),
    MovieTopicSchema = require('../../schemas/movie/movie_topic'),
    MovieTopic = mongoose.model('MovieTopic', MovieTopicSchema);

module.exports = MovieTopic;
