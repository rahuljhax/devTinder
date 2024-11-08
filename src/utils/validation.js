const validator = require('validator');
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || firstName.length < 4) {
        throw new Error('Firstname is not valid')
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter a strong password');
    }
}

const validateEditData = (req) => {
    const allowedUpdateFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    const isUpdateAllowed = Object.keys(req.body).every(k => allowedUpdateFields.includes(k));
    if (!isUpdateAllowed) {
        throw new Error('Update Not Allowed For Requested Fields');
    }
}

module.exports = { validateSignUpData, validateEditData }