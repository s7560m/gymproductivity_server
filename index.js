const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://haydenhoffman:7crC75i0JosUySUU@exercises.xb1co.mongodb.net/Exercises?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// you need this to parse bodies in express - doesn't work otherwise
app.use(express.json());

app.get('/addExerciseByUser', async (req, res) => {
    await client.connect();
    const collection = client.db("ExercisesDB").collection("ExercisesCollection");
    const exerciseDocument = {timestamp: new Date(), ...req.body};

    // exercise document will contain things such as user, date, weight (which is optional), and notes (which is also optional)
    await collection.insertOne(exerciseDocument).then(() => res.send("document added successfully!")).catch(err => console.log(err));
    await client.close();
})

app.get('/getExerciseByUser', async (req, res) => {
    await client.connect();
    const documents = await client.db('ExercisesDB').collection('ExercisesCollection').find({participant: 'hayden'}).toArray();
    res.send(documents);
    await client.close();

})



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})