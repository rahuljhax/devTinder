const adminAuth = (req, res, next) => {
    const token = 'xyz';
    const isAuth = token === 'xyz';
    if (!isAuth) {
        res.status(401).send("Unauthorized User")
    } else {
        next();
    }
}

module.exports = { adminAuth }