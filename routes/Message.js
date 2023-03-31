const router = require('express').Router()

const {sendMessage, getMessages} = require('../controllers/Message')

router.route('/send').post(sendMessage)
router.route('/get/:user/:contact').get(getMessages)


module.exports = router