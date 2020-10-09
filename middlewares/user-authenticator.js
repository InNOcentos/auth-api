'use strict';

const bcrypt = require('bcrypt');

module.exports = (model) => (
    async (req, res, next) => {
        const {email,password} = req.body;
        try {
            const user = await model.findOne({email});
            if (!user) {
                return res.status(400).send('There is no user with such data');
            }
            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                return res.status(400).send('There is no user with such data');
            }
            res.locals.user = user;
        } catch(err) {
            return console.log(err.message);
        }
        next();
    }
);