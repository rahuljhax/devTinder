const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    res.send(`${req.user.firstName} Sending Connection Request`)
})


module.exports = requestRouter;