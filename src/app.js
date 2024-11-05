const express = require('express');
const bcrypt = require('bcrypt');
const { connectDB } = require('./config/database');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const { validateSignUpData } = require('./utils/validation');
const { userAuth } = require('./middlewares/auth');
app.use(express.json());
app.use(cookieParser());

//Sign Up API
app.post('/signup', async (req, res) => {
    try {
        // Validate Signup Data 
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        });
        await user.save();
        res.send('User Added Successfully')
    } catch (err) {
        res.status(400).send('Error saving the user:' + err.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid Credentials');
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid Credentials')
        } else {
            const token = await user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.send('Logged In Successfully..')
        }
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})


app.post('/sendConnectionRequest', userAuth, (req, res) => {
    res.send(`${req.user.firstName} Sending Connection Request`)
})


connectDB().then(() => {
    console.log('Database connection established!!')
    app.listen(3000, () => {
        console.log('Server is running on PORT 3000...')
    })
}).catch((err) => {
    console.log('Something went wrong')
})