const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    idSocialMedia: {
        type: String
    },
    firstName: {
        type: String
    },
    surname: {
        type: String
    },
    name: {
        type: String
    },
    personPhoto: {
        type: String,
    },
    token: {
        type: String,
    }

}, {collection:"users"});

module.exports = mongoose.model("User", userSchema);
