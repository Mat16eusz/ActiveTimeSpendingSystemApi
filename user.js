const mongoose = require("mongoose");

const userRole = {
    admin: "admin",
    user: "user"
}
const userRoles = [userRole.admin, userRole.user];

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
    role: {
        type: String, enum: userRoles, default: userRole.user, required: false
    },
    personPhoto: {
        type: String,
    },
    token: {
        type: String,
    }

}, { collection: "users" });

module.exports = mongoose.model("User", userSchema);
