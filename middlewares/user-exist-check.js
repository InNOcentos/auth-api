'use strict';

module.exports = (model) => (
    async (req, res, next) => {
        const {email} = req.body;
        try {
           const match = await model.findOne({email});
           if (match) {
               return res.status(400).send('User already exists');
           }
        } catch(err) {
            return console.log(err.message);
        }
        next();
    }
);