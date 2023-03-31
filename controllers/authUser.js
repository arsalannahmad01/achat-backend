const User = require('../models/User')

const getSavedContact = async(req, res) => {
    const {id} = req.params

    if(!id) 
        res.send('Provide user id')

    const user = await User.findOne({_id:id}).populate('savedContacts', '-password')

    res.status(200).json({savedContacts:user.savedContacts})

}

const updateProfilePic = async(req, res) => {
    const {profilePic} = req.body
    const {id} = req.params

    const user = await User.findOne({_id:id})
    if(!user)
        res.send('Invalid Credentials')
    
    const updatedUSer = await User.findOneAndUpdate({_id:id}, {profilePic:profilePic}, { new: true, runValidators: true })
    res.status(200).json({msg:"Profile pic updated successfully!"})
}

const getUser = async (req, res) => {
    const {userId} = req.params

    if(!userId)
        res.send('Provide user id')

    const user = await User.findOne({_id:userId}, '-password -savedContacts')
    res.status(200).json({user:user})
}

const getUserByEmail = async (req, res) => {
    const {email} = req.params

    console.log("email", email);

    if(!email)
        res.send('Provide user email')

    const user = await User.findOne({email:email}, '-password -savedContacts')

    if(!user)
        res.send('User not found')

    res.status(200).json({user:user})
}   

const addContact = async(req, res) => {
    const {userId} = req.params
    const {contactId} = req.body
    const updatedUser = await User.findOneAndUpdate({_id:userId}, {$push:{savedContacts:contactId}}, {new:true, runValidators:true})

    if(!updatedUser)
        res.send("Error while adding contact")

    res.status(200).json({msg:"Contact added successfully"})

}

module.exports = {getUser, getUserByEmail, getSavedContact, updateProfilePic, addContact}