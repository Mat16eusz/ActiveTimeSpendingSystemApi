const mongoose = require("mongoose");

const coordinateSchema = new mongoose.Schema({
    idSocialMedia: {
        type: String
    },
    firstName: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }

}, { collection: "coordinates" });

module.exports = mongoose.model("Coordinate", coordinateSchema);
