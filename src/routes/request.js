const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Check Allowed Status 
        const allowedStatus = ['interested', 'ignored'];
        if (!allowedStatus.includes(status)) {
            throw new Error('Invalid Status');
        }


        // Check toUser is valid or not 
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            throw new Error('User not found');
        }

        // Check Connection Exist or not
        const isRequestExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (isRequestExist) {
            throw new Error('Connection Already Exists');
        }




        const connectionRequestData = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await connectionRequestData.save();
        res.json({
            message: `You ${status} Successfully to ${toUser.firstName}`,
            data: connectionRequestData
        })
    } catch (err) {
        res.status(400).send(`ERROR: ${err.message}`)
    }
})


module.exports = requestRouter;