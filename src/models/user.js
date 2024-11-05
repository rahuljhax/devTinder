const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address')
            }

        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password is week')
            }

        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: (value) => {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error('Gender is not valid');
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://tamilnaducouncil.ac.in/wp-content/uploads/2020/04/dummy-avatar.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid Photo URL')
            }

        }
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: '1d' });
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}


module.exports = mongoose.model('User', userSchema);
