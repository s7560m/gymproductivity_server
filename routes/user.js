const express = require('express')
const router = express.Router();
const client = require('../mongoclient');

// add a user, return four digit code
router.post('/add', async (req, res) => {
    await client.connect();
    const user = client.db("ExercisesDB").collection("UserbaseCollection");

    // generate unique 4-letter code for user
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
    }

    const userDoc = {timeCreated: new Date(), code: code, ...req.body};

    // make sure user's name exists (we only test for what's required)
    if (req.body.name !== undefined) {
        user.insertOne(userDoc)
            .then(() => res.send(code))
            .catch(err => console.log(err));
    } else {
        res.send("Please add a name for the user you want to add!");
    }
})

// login a user based on their code, return their stats
router.post('/login', async (req, res) => {
    await client.connect();

    const code = req.body.code;
    const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: code});
    res.send(user);
})

module.exports = router;