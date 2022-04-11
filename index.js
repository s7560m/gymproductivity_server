const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const exercisesRouter = require('./routes/exercises')
const userRouter = require('./routes/user');
// you need this to parse bodies in express - doesn't work otherwise
app.use(express.json());

app.use('/exercise', exercisesRouter);
app.use('/user', userRouter)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// THE NPM INSTALL SCRIPT FUCKED THINGS UP. DON'T USE THAT ANYMORE

app.listen(process.env.port || port, () => {
    console.log(`Example app listening on port ${port}`)
})