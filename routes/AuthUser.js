const router = require('express').Router()

const {getUser, getUserByEmail, getSavedContact, updateProfilePic, addContact} = require('../controllers/authUser')

router.route('/get/user/:userId').get(getUser)
router.route('/get/user-by-email/:email').get(getUserByEmail)
router.route('/get/saved-contacts/:id').get(getSavedContact)
router.route('/update/profile-pic/:id').put(updateProfilePic)
router.route('/add/contact/:userId').put(addContact)


module.exports = router