const User = require('../models/User')
const jwt = require('jsonwebtoken')


const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        res.send('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:payload._id}, '-password')
        req.user = user
        next()
    } catch (error) {
        res.send('Authentication Invalid')
    }
}

module.exports = authMiddleware