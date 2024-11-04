const express = require('express');
const bcrypt = require('bcrypt');
const { connectDB } = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
app.use(express.json());


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
            throw new Error('Invalid Credentials')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid Credentials')
        } else {
            res.send('Logged In Successfully..')
        }
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

//Feed API
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send('User Not Found')
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(500).send(`ERROR : ${err.message}`)
    }
})



//Get User API
app.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (user) {
            res.send(user);
        } else {
            res.status(404).send('User Not Found')
        }
    } catch (err) {
        res.status(500).send(`ERROR : ${err.message}`)
    }
})

//Update User API
app.patch('/user/:userId', async (req, res) => {
    try {
        const ALLOWED_UPDATES = ['gender', 'age', 'skills', 'about', 'photoUrl'];
        const isAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isAllowed) {
            throw new Error('Update Not allowed');
        }
        if (req.body?.skills?.length > 10) {
            throw new Error('Skills should be less than 10')
        }
        const user = await User.findByIdAndUpdate({ _id: req.params.userId }, req.body, { runValidators: true });
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send('Something went wrong :' + err.message)
    }
})


//Delete User API
app.delete('/user', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.userId);
        res.send('User Deleted Successfully')
    } catch (err) {
        res.status(500).send(`ERROR : ${err.message}`)
    }
})

connectDB().then(() => {
    console.log('Database connection established!!')
    app.listen(3000, () => {
        console.log('Server is running on PORT 3000...')
    })
}).catch((err) => {
    console.log('Something went wrong')
})