const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const exercisesRouter = require('./routes/exercises')
const userRouter = require('./routes/user');
const groupRouter = require('./routes/groups')
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

// you need this to parse bodies in express - doesn't work otherwise
app.use(express.json());

const corsOptions = {credentials: true}
app.use(cors(corsOptions));


// store session data
const oneWeek = 7 * 24 * 3600 * 1000;
const secure = false;
app.use(session({
    secret: "thisismys3cretl0l",
    saveUninitialized:true,
    cookie: {
        secure: secure,
        httpOnly: !secure,
        sameSite: 'none', // allow cross-site cookies
        expires: new Date(253402300000000) // never expires until the user logs out
    },
    resave: false,
    store: MongoStore.create({mongoUrl: "mongodb+srv://haydenhoffman:7crC75i0JosUySUU@exercises.xb1co.mongodb.net/Sessions?retryWrites=true&w=majority"})
}));

// parse cookies to auth sessions
app.use(cookieParser());

app.use('/exercise', exercisesRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`)
})