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

// log the user out and destroy the session
router.get('/logout', async (req, res) => {
    if (req.session){
        req.session.destroy();
        res.send("Successfully logged out user!");
    } else {
        res.send("No session exists!");
    }
})



// session testing
router.get('/getSession', async (req, res) => {
    if (req.session) {

        // return the whole session which we can then parse
        res.send(req.session);
    } else {
        res.send("No sessions exists!");
    }
})

router.get('/testSession', async (req, res) => {
    req.session.code = req.query.code;
    res.send("success! your new code is " + req.query.code);
})g

module.exports = router;