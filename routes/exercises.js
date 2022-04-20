const express = require('express')
const router = express.Router();
const client = require('../mongoclient');

// add the exercise to an existing user
router.post('/add', async (req, res) => {
    await client.connect();
    const collection = client.db("ExercisesDB").collection("ExercisesCollection");

    // timestamp based on current timezone
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

    // exercise document will contain things such as user (their code), date, weight (which is optional), and notes (which is also optional)
    const exerciseDocument = {timestamp: date, ...req.body};
    const code = req.body.code;

    if (code !== undefined) {

        // make sure a code is provided and exists in the UserbaseCollection
        const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: code});

        // make sure the user is not null
        if (user !== null) {

            // save the user's session
            // this can be persistent because the user is constantly going to be going back to submitting workouts
            req.session.user = user;

            await collection.insertOne(exerciseDocument).then(() => res.send("Exercise added successfully!")).catch(err => console.log(err));
        } else {
            res.send("User does not exist!");
        }

    } else {
        res.send("No code provided, cannot add user!");
    }
    await client.close();
})

// get the user's exercises based on their 4-letter code
router.post('/get', async (req, res) => {
    await client.connect();
    const code = req.body.code;

    if (code !== undefined) {

        const documents = await client.db('ExercisesDB').collection('ExercisesCollection').find({code: code}).toArray();

        // make sure the user actually has exercises, otherwise print out that no exercises were found for that user
        if (documents.length > 0) {
            res.send(documents);
        } else {
            res.send("User either does not exist or has any exercises!");
        }

    } else {
        res.send("No code provided, cannot add user!");
    }
    await client.close();

})

// you need to export the router variable to use in index.js
module.exports = router;