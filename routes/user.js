const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user")
const {restricted_loggedInUserOnly} = require("../middleware/logger")

router.post('/signup', UserController.userSingup )
router.post('/login', UserController.userLogin )
router.post('/forgotpassword',UserController.forgotPassword);
router.post('/resetpassword',UserController.resetPassword)
router.get('/users', UserController.getUsers)
router.get('/logout',restricted_loggedInUserOnly, UserController.userLogout);
router.put('/updateUser',restricted_loggedInUserOnly, UserController.updateUser);


router.route('/user/:id')
.get(UserController.getUserById)
.delete(UserController.deleteUserById)


module.exports = router;