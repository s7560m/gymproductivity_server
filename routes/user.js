const express = require('express')
// const app = express();
const router = express.Router();
const client = require('../mongoclient');

// add a user, return four digit code
router.get('/add', async (req, res) => {
    await client.connect();
    const user = client.db("ExercisesDB").collection("UserbaseCollection");

    // generate unique 4-letter code for user
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
    }

    const userDoc = {timeCreated: new Date(), code: code, ...req.body};
    await user.insertOne(userDoc).then(() => res.send("user added successfully!")).catch(err => console.log(err));
})

// login a user based on their code, return their stats
router.get('/login', async (req, res) => {
    await client.connect();

    const code = req.body.code;
    const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: code});
    res.send(user);
})

module.exports = router;