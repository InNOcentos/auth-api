'use strict';

module.exports = (schema) => (
    async (req, res, next) => {
        const {email,password} = req.body;
        try {
           await schema.validateAsync({email,password}, { abortEarly: false });
        } catch(err) {
            const { details } = err;
            return res.status(400).send(details.map((e)=> ({
                errName: e.path[0],
                error: e.message
            })));
        }
        next();
    }
);