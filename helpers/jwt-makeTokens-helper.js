'use strict';

const jwt = require(`jsonwebtoken`);
const {access_token_secret, refresh_token_secret} = require(`../config`);

module.exports.jwtMakeTokensHelper = (tokenData) => {
    const accessToken = jwt.sign(tokenData, access_token_secret,  { expiresIn: `15m`});
    const refreshToken = jwt.sign(tokenData, refresh_token_secret);
    return {accessToken, refreshToken};
};
