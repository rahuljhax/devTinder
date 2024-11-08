const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const { userRouter } = require('./routes/user');

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)

connectDB().then(() => {
    console.log('Database connection established!!')
    app.listen(3000, () => {
        console.log('Server is running on PORT 3000...')
    })
}).catch((err) => {
    console.log('Something went wrong')
})