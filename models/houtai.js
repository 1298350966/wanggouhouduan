const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginSchema   = Schema({
    username: String, 
    password: String
})

module.exports = mongoose.model("login",loginSchema)