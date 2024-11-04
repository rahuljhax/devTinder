const mongoose = require('mongoose');
const validator = require('validator');
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

module.exports = mongoose.model('User', userSchema);
