const express = require('express')
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
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

module.exports = authRouter;