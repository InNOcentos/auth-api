'use string';

const jwt = require(`jsonwebtoken`);
const {access_token_secret} = require(`../config`);

module.exports = (req, res, next) => {
    
    const authorization = req.headers[`authorization`]
    if (! authorization) {
        return res.status(401);
    }
    
    const [, token] = authorization.split(` `);

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, access_token_secret, (err, userData) => {
        
        if (err) {
            return res.sendStatus(403);
        }
        
    })
    res.locals.user = {userData,token};
    next()
}