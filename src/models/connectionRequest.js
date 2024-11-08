const mongoose = require('mongoose');

const connectionRequstSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: `{VALUE} is invalid status`
        },
        required: true
    }
}, { timestamps: true })

connectionRequstSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequstSchema.pre('save', function (next) {
    const connectionRequest = this;
    console.log(connectionRequest.fromUserId.equals(connectionRequest.toUserId));
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('You cannot send request to yourself!!')
    }
    next();
})

module.exports = new mongoose.model('ConnectionRequest', connectionRequstSchema);