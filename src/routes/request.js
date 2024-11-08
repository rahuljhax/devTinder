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


requestRouter.patch('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        // Validate Status
        // Logged User === toUserId
        // status == interested
        // request Id should be valid

        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        // Validate Status 
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Status not allowed!!' });
        }

        //Checkinig request Id is valid or not
        const connectionRequestData = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if (!connectionRequestData) {
            return res.status(404).json({
                message: "Connection Not found"
            })
        }

        connectionRequestData.status = status;
        await connectionRequestData.save();
        res.json({
            message: `Connection ${status} Successfully!!`,
            data: connectionRequestData
        })

    } catch (err) {
        res.status(400).send(`ERROR : ${err.message}`)
    }
})

module.exports = requestRouter;