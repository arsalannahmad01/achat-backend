const Message = require('../models/Message')

const sendMessage = async (req, res) => {
    const message = await Message.create(req.body)
    res.status(200).json({msg:"Sent successfully"})
}

const getMessages = async(req, res) => {
    const {user, contact} = req.params
    const messages = await Message.find({$or:[{$and:[{senderId:user}, {recipientId:contact}]}, {$and:[{senderId:contact}, {recipientId:user}]}]})
    res.status(200).json(messages)
}


module.exports = {sendMessage, getMessages}