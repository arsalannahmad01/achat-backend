const User = require('../models/User')

const createUser = async (req, res) => {
    
    const user = await (await User.create(req.body))

    user.password = null
    
    const token = user.createJwt()
    res.status(200).json({user:user, token:token  })
}


const userLogin = async (req, res) => {

    console.log("WE ARE HERE");
    
    const {email, password} = req.body

    if(!email || !password)
        res.send('Please provide email and password')

    const user = await User.findOne({email:email})
    if(!user)
        res.send('Invalid Credentials')

    const isPassMatch = await user.comparePassword(password)
    if(!isPassMatch)
        res.send('Wrong Password')


    user.password = null
    const token = await user.createJwt()
    res.status(200).json({user:user, token:token})
}

module.exports = {createUser, userLogin}