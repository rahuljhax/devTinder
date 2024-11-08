const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const SAFE_PUBLIC_DATA = "firstName lastName gender age about skills";
userRouter.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        const connectionRequestData = await connectionRequest.find({
            toUserId: loggedInuser._id,
            status: 'interested'
        }).populate("fromUserId", SAFE_PUBLIC_DATA)

        await res.send(connectionRequestData);

    } catch (err) {
        res.status(400).json({
            message: `Error : ${err.message}`
        })
    }

})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionsData = await connectionRequest.find({
            $and: [
                {
                    $or: [
                        { fromUserId: loggedInUser._id },
                        { toUserId: loggedInUser._id }
                    ]
                },
                {
                    status: 'accepted'
                }
            ]
        })
            .populate("fromUserId", SAFE_PUBLIC_DATA)
            .populate("toUserId", SAFE_PUBLIC_DATA);


        const data = connectionsData.map((obj) => {
            if (obj.fromUserId.equals(loggedInUser._id)) {
                return obj.toUserId;
            }
            obj.fromUserId;
        })

        res.send(data);
    } catch (err) {
        res.status(400).json({
            message: `ERROR : ${err.message}`
        })
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        console.log(limit)
        const skip = (page - 1) * limit;

        // Find Existd Connection 
        const existedConnectionData = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select('fromUserId toUserId');

        // Hide User from Feed 
        const hideUserFromFeed = new Set();
        existedConnectionData.forEach(element => {
            hideUserFromFeed.add(element.fromUserId.toString());
            hideUserFromFeed.add(element.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select(SAFE_PUBLIC_DATA).skip(skip).limit(limit);

        res.send(users)

    } catch (err) {
        res.status(400).json({
            message: `ERROR : ${err.message}`
        })
    }
})

module.exports = { userRouter };