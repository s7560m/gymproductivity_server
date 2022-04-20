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

    // generate new timezone based on America/Toronto timezone
    const options = {
            timeZone: 'America/Toronto',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        },
        formatter = new Intl.DateTimeFormat([], options);
    let date = formatter.format(new Date());

    const userDoc = {timeCreated: date, code: code, ...req.body};

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

// edit bio
router.post('/updateBio', async (req, res) => {
    const user = req.body;

    await client.connect();

    let newUserDoc = {timeCreated: user.timeCreated, code: user.code, name: user.name, bio: user.bio};

    // update bio in the user's session
    req.session.user.bio = user.bio;

    // replace user doc based on bio
    await client.db("ExercisesDB").collection("UserbaseCollection").replaceOne({"code": user.code}, newUserDoc);
    res.send("Updated user document");
})

// session testing
router.get('/getSession', async (req, res) => {
    if (req.session) {
        console.log(req.session);
        // return the whole session which we can then parse
        res.send(req.session);
    } else {
        res.send("No sessions exists!");
    }
})

router.get('/testSession', async (req, res) => {
    req.session.code = req.query.code;
    console.log(req.session);
    res.send("success! your new code is " + req.query.code);

})

module.exports = router;