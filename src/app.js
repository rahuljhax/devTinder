const express = require('express')
const { connectDB } = require('./config/database');
const app = express();
const User = require('./models/user');
app.post('/signup', async (req, res) => {
    const userData = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        emailId: req.query.emailId,
        password: req.query.password,
        age: req.query.age,
        gender: req.query.gender
    }

    const user = new User(userData);
    await user.save();
    res.send('User Added Successfully')
})

connectDB().then(() => {
    console.log('Database connection established!!')
    app.listen(3000, () => {
        console.log('Server is running on PORT 3000...')
    })
}).catch((err) => {
    console.log('Something went wrong')
})