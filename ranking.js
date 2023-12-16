const mongoose = require("mongoose");

const rankingSchema = new mongoose.Schema({
    idSocialMedia: {
        type: String
    },
    fullName: {
        type: String
    },
    score: {
        type: Number
    }

}, {collection:"rankings"});

module.exports = mongoose.model("Ranking", rankingSchema);
