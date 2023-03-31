const router = require('express').Router()

const {createUser, userLogin} = require('../controllers/User')

router.route('/signup').post(createUser)
router.route('/login').post(userLogin)

module.exports = router