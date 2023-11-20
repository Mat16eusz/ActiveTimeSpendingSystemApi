const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const User = require("./user.js");

app.use(express.json());
let port = process.env.PORT || 3000;
let uri = process.env.MONGODB_URI;
let uriLocal = process.env.MONGODB_URI_LOCAL;


app.get("/", function(req, res) {
    res.send("NodeJS + MongoDB API ActiveTimeSpendingSystem.");
});


mongoose.connect(uri, {
    useNewUrlParser: true },
    function () {}
);

mongoose.connection.on("connected", function () {
    console.log("Connected to database.");
});
mongoose.connection.on("error", function (error) {
    console.log("No connection to the database. " + error);
});
mongoose.connection.on("disconnected", function () {
    console.log("Disconnecting from the database.");
});


app.get("/users", async function(req, res) {
    const users = await User.find().exec();
    res.status(200).json(users);
});

app.post("/users", async function(req, res) {
    const user = new User({
        idSocialMedia: req.body.idSocialMedia,
        firstName: req.body.firstName,
        surname: req.body.surname,
        name: req.body.name,
        personPhoto: req.body.personPhoto,
        token: req.body.token
    });

    try {
        await user.save();
        res.status(200).json({"success": true, "message": "User details saved."});
    } catch (error) {
        res.status(400).json({"success": false, "message": "Error in saving user details. Error: " + error});
        console.log("No user added. Error: " + error);
    }
});

app.put("/users/:id", async function(req, res) {
    let conditions = { idSocialMedia: req.params.id };

    User.findOneAndUpdate(conditions, {
        $set:{
            firstName: req.body.firstName,
            surname: req.body.surname,
            name: req.body.name,
            personPhoto: req.body.personPhoto,
            token: req.body.token
        }
    }).then(result => {
        res.status(200).json({"success": true, "message": "User details update."});
    }).catch(error => {
        res.status(500).json({"success": false, "message": "Error in updating user details. Error: " + error});
        console.log("Data not updated - token. Error: " + error);
    });
});

app.all("*", (req, res) => {
    res.send("You've tried reaching a route that doesn't exist.");
});

app.listen(port, () => {
    console.log("Server running.");
});
