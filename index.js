'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const {PORT} = require('./constants');

const authRoute = require('./routes/auth');

mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_password}@cluster0.rugaj.mongodb.net/${config.db_name}?retryWrites=true&w=majority`, {useUnifiedTopology: true, useNewUrlParser: true}, ()=> {
    console.log('Connected to DB');
});

app.use(express.json());

app.use('/api/user/',authRoute);

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Listening on ${PORT}`)
});