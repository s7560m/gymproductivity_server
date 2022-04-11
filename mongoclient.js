const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://haydenhoffman:7crC75i0JosUySUU@exercises.xb1co.mongodb.net/Exercises?retryWrites=true&w=majority";
const client = new MongoClient(uri);

module.exports = client;