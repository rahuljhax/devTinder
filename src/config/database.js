const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://namastedev:apgmtqGopDLRWafJ@namastenode.d4zp1.mongodb.net/devTinder');
}

module.exports = { connectDB }