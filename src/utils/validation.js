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

module.exports = { validateSignUpData }