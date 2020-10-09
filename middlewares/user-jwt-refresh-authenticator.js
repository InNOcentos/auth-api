'use string';

module.exports = (req, res, next) => {
    
    const token = req.headers[`token`]
    if (! token) {
        return res.status(401);
    }

    res.locals.refToken = token;
    next();

}