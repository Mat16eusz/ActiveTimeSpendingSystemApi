const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const User = require("./user.js");
const Coordinate = require("./coordinate.js");
const Ranking = require("./ranking.js");
const Cors = require("cors");

app.use(express.json());
let port = process.env.PORT || 3000;
let uri = process.env.MONGODB_URI;
let uriLocal = process.env.MONGODB_URI_LOCAL;


app.get("/", function (req, res) {
    res.send("NodeJS + MongoDB API ActiveTimeSpendingSystem.");
});

app.use(Cors());

mongoose.connect(uri, {
    useNewUrlParser: true
},
    function () { }
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


app.get("/users", async function (req, res) {
    const users = await User.find().exec();
    res.status(200).json(users);
});

app.get("/user/:id", async function (req, res) {
    const user = await User.findOne({ "idSocialMedia": req.params.id }).exec();
    if (!user) {
        return res.status(404).json({ "success": false, "message": "User not found." });
    }
    res.status(200).json(user);
});

app.post("/user", async function (req, res) {
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
        res.status(200).json({ "success": true, "message": "User details saved." });
    } catch (error) {
        res.status(400).json({ "success": false, "message": "Error in saving user details. Error: " + error });
        console.log("No user added. Error: " + error);
    }
});

app.put("/user/:id", async function (req, res) {
    let conditions = { idSocialMedia: req.params.id };

    User.findOneAndUpdate(conditions, {
        $set: {
            firstName: req.body.firstName,
            surname: req.body.surname,
            name: req.body.name,
            personPhoto: req.body.personPhoto,
            token: req.body.token
        }
    }).then(result => {
        res.status(200).json({ "success": true, "message": "User details update." });
    }).catch(error => {
        res.status(500).json({ "success": false, "message": "Error in updating user details. Error: " + error });
        console.log("Data not updated. Error: " + error);
    });
});

app.delete("/user/:id", async function (req, res) {
    try {
        await User.findOneAndDelete({ "idSocialMedia": req.params.id });
        res.send("The user has been removed.");
    } catch (error) {
        res.status(400).json({ "success": false, "message": "Error removing a user coordinate. Error: " + error });
        console.log("Error removing a user coordinate. Error: " + error);
    }
});

app.get("/coordinates", async function (req, res) {
    const coordinates = await Coordinate.find().exec();
    res.status(200).json(coordinates);
});

app.put("/coordinate/:id", async function (req, res) {
    let conditions = { idSocialMedia: req.params.id };
    const coordinate = await Coordinate.findOneAndUpdate(conditions, {
        $set: {
            firstName: req.body.firstName,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }
    });

    if (!coordinate) {
        req.method = 'POST';
        req.url = '/coordinate';

        const coordinate = new Coordinate({
            idSocialMedia: req.body.idSocialMedia,
            firstName: req.body.firstName,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        try {
            await coordinate.save();
            res.status(200).json({ "success": true, "message": "Coordinate details saved." });
        } catch (error) {
            res.status(400).json({ "success": false, "message": "Error in saving coordinate details. Error: " + error });
            console.log("No coordinate added. Error: " + error);
        }
    } else {
        Coordinate.findOneAndUpdate(conditions, {
            $set: {
                firstName: req.body.firstName,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
        }).then(result => {
            res.status(200).json({ "success": true, "message": "Coordinate details update." });
        }).catch(error => {
            res.status(500).json({ "success": false, "message": "Error in updating coordinate details. Error: " + error });
            console.log("Data not updated. Error: " + error);
        });
    }
});

app.delete("/coordinate/:id", async function (req, res) {
    try {
        await Coordinate.findOneAndDelete({ "idSocialMedia": req.params.id });
        res.send("The user coordinate has been removed.");
    } catch (error) {
        res.status(400).json({ "success": false, "message": "Error removing a user coordinate. Error: " + error });
        console.log("Error removing a user coordinate. Error: " + error);
    }
});

app.get("/rankings", async function (req, res) {
    const rankings = await Ranking.find().exec();
    res.status(200).json(rankings);
});

app.get("/ranking/:id", async function (req, res) {
    const ranking = await Ranking.findOne({ "idSocialMedia": req.params.id }).exec();
    if (!ranking) {
        return res.status(404).json({ "success": false, "message": "Ranking not found." });
    }
    res.status(200).json(ranking);
});

app.post("/ranking", async function (req, res) {
    const ranking = new Ranking({
        idSocialMedia: req.body.idSocialMedia,
        fullName: req.body.fullName,
        score: req.body.score
    });

    try {
        await ranking.save();
        res.status(200).json({ "success": true, "message": "Ranking details saved." });
    } catch (error) {
        res.status(400).json({ "success": false, "message": "Error in saving ranking details. Error: " + error });
        console.log("No ranking added. Error: " + error);
    }
});

app.put("/ranking/:id", async function (req, res) {
    let conditions = { idSocialMedia: req.params.id };

    Ranking.findOneAndUpdate(conditions, {
        $inc: {
            score: req.body.score
        }
    }).then(result => {
        res.status(200).json({ "success": true, "message": "Ranking details update." });
    }).catch(error => {
        res.status(500).json({ "success": false, "message": "Error in updating ranking details. Error: " + error });
        console.log("Data not updated. Error: " + error);
    });
});

app.post("/ranking/reset", async function (req, res) {
    return Ranking.updateMany({}, { score: 0 }).then(result => {
        res.status(200).json({ "success": true, "message": "Ranking details update." });
    }).catch(error => {
        res.status(500).json({ "success": false, "message": "Error in updating ranking details. Error: " + error });
        console.log("Data not updated. Error: " + error);
    });
});

app.delete("/ranking/:id", async function (req, res) {
    try {
        await Ranking.findOneAndDelete({ "idSocialMedia": req.params.id });
        res.send("The ranking has been removed.");
    } catch (error) {
        res.status(400).json({ "success": false, "message": "Error removing a ranking. Error: " + error });
        console.log("Error removing a ranking. Error: " + error);
    }
});

app.all("*", (req, res) => {
    res.send("You've tried reaching a route that doesn't exist.");
});

app.listen(port, () => {
    console.log("Server running.");
});
