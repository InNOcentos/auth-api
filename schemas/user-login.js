'use strict';

const Joi = require('joi');

module.exports = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});
