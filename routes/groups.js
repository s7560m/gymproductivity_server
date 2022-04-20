const express = require('express')
const router = express.Router();
const client = require('../mongoclient');

// create a group
router.post('/create', async (req, res) => {
    // set up variables
    const userCode = req.body.userCode;
    const groupName = req.body.groupName;
    const description = (req.body.description !== undefined) ? req.body.description : "No description provided."; // optional

    // make sure the user code and group name are entered
    if (userCode !== undefined && groupName !== undefined) {
        await client.connect();

        // generate unique group code
        let groupCode = "G-";
        for (let i = 0; i < 4; i++) {
            groupCode += String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
        }

        const groupDocument = {
            userCode: [userCode],
            groupName: groupName,
            description: description,
            groupCode: groupCode,
        }

        // check if user code is valid
        const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: userCode});
        if (user !== null) {
            await client.db('ExercisesDB').collection('GroupsCollection').insertOne(groupDocument);

            // return the group code
            res.send(groupCode);
        } else {
            res.send("User code is invalid!");
        }

    } else if (userCode === undefined) {
        res.send("User code is required!");
    } else if (groupName === undefined) {
        res.send("Group name is required!");
    }
})

router.post('/join', async (req, res) => {
    const userCode = req.body.userCode;
    const groupCode = req.body.groupCode;

    await client.connect();
    let group = await client.db('ExercisesDB').collection('GroupsCollection').findOne({groupCode: groupCode});

    // make sure user code and group exist
    if (userCode !== undefined && group !== null) {

        // make sure group isn't null
        // group will be json object, let's check to see if user code is in the array
        // if they are, then we'll return a response saying they are. If not, we'll push them to the doc
        console.log(group.userCode.indexOf(userCode));
        if (group.userCode.indexOf(userCode) !== -1) {

            res.send("User is already a part of this group!");

        } else {

            // check if user code is valid
            const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: userCode});
            if (user !== null) {

                // update userCode field in group with new user
                group.userCode.push(userCode);

                // update with new group document
                await client.db('ExercisesDB').collection('GroupsCollection').replaceOne({groupCode: groupCode}, group);
                res.send("User successfully added to group!")

            } else {
                res.send("User code is invalid!")
            }
        }

    } else if (userCode === undefined) {
        res.send("User code is required!");

    } else if (group === null) {
        res.send("Group code is invalid!");
    }
})

router.post('/getLeaderboard', async (req, res) => {
    // get the names of all users in a group
    // do NOT set req.session.group in here -> you want to achieve this with /getSession
    const groupCode = req.body.groupCode;

    await client.connect();
    let group = await client.db('ExercisesDB').collection('GroupsCollection').findOne({groupCode: groupCode});

    let leaderboard = [];
    if (group !== null) {

        // set session's groupcode
        // this can be persistent because the user will constantly go back to checking stats
        req.session.group = group;
        // iterate over group and push to the leaderboard array
        for (const userCode of group.userCode) {
            const user = await client.db("ExercisesDB").collection("UserbaseCollection").findOne({code: userCode});
            const exercisesOfUser = await client.db('ExercisesDB').collection('ExercisesCollection').find({code: userCode}).toArray();
            leaderboard.push({user: user, exercises: exercisesOfUser});
        }

        res.send(leaderboard);

    } else {
        res.send("Group code is invalid!");
    }
})

// you need to export the router variable to use in index.js
module.exports = router;