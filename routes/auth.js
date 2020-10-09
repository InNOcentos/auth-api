"use strict";

const router = require("express").Router();
const {UserModel,RefreshTokenModel} = require("../models");
const {userReg: regShema, userLog: logShema} = require("../schemas");
const {userRegisterValidator, userExistCheck, userAuthenticator, userLoginValidator, userAuthenticatorJwtRefresh} = require("../middlewares");
const jwt = require('jsonwebtoken');
const {jwtMakeTokensHelper} = require("../helpers/jwt-makeTokens-helper");
const {refresh_token_secret} = require("../config");
const bcrypt = require("bcrypt");
const {saltRounds} = require("../constants");

router.post("/register", [userRegisterValidator(regShema), userExistCheck(UserModel)], async (req, res, next) => {
  const {name, email, password} = req.body;

  const user = new UserModel({
    name,
    email,
    password: await bcrypt.hash(password, saltRounds),
  });
  try {
    await user.save();
    res.send({
      user: user._id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", [userLoginValidator(logShema), userAuthenticator(UserModel)], async (req, res, next) => {
  try {
    const {accessToken, refreshToken} = jwtMakeTokensHelper({
      _id: res.locals.user._id,
    });

    const token = new RefreshTokenModel({
      token: refreshToken,
    });
    await token.save();

    res.set("acc_token", `${accessToken}`).set("ref_token", `${refreshToken}`).status(200).send("You are logged in!");
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      return res.sendStatus(400);
    }

    const existToken = UserModel.findOne({token});

    if (!existToken) {
      return res.sendStatus(404);
    }

    jwt.verify(token, refresh_token_secret, async (err, userData) => {
      if (err) {
        return res.sendStatus(403);
      }

      const {_id} = userData;
      const {accessToken, refreshToken} = jwtMakeTokensHelper({_id});
      console.log({accessToken, refreshToken});
      await RefreshTokenModel.updateOne({token},{refreshToken});

      return res.status(200).json({accessToken, refreshToken});
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

router.post("/logout", userAuthenticatorJwtRefresh,async (req, res, next) => {
  try {
    const token = res.locals.refToken;
    console.log({token})
    await RefreshTokenModel.deleteOne({token});

    return res.sendStatus(203);
  } catch (error) {
    console.log(error.message)
    next(error);
  }
    
});

module.exports = router;
