const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const exercisesRouter = require('./routes/exercises')
const userRouter = require('./routes/user');
const groupRouter = require('./routes/groups')
const cors = require('cors');
// you need this to parse bodies in express - doesn't work otherwise
app.use(express.json());

const corsOptions = {origin: '*'}
app.use(cors());

app.use('/exercise', exercisesRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// THE NPM INSTALL SCRIPT FUCKED THINGS UP. DON'T USE THAT ANYMORE

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
})