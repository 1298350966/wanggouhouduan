const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dataSchema   = Schema({
    category: String, 
    name: String
})
module.exports = mongoose.model("data",dataSchema)