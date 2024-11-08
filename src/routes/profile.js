const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditData } = require('../utils/validation');
const validator = require('validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateEditData(req);
        const loggedUser = req.user;
        Object.keys(req.body).every(k => loggedUser[k] = req.body[k]);
        await loggedUser.save();
        res.json({
            message: "User Updated successfully!!",
            data: loggedUser
        });
    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

profileRouter.patch('/profile/forgetPassword', async (req, res) => {
    try {
        const { emailId, newPassword } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error('Email Id is not valid!!');
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("No Account Found with this email Id");
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send('Password Updated Successfully!')
    } catch (err) {
        res.status(400).send(`Error : ${err.message}`)
    }
})
module.exports = profileRouter;