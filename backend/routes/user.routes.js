const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/authUser')
const upload = require('../middlewares/upload')

router.post('/signup',
    body('email').isEmail().withMessage('Invalid email'),
    body('userName').isLength({ min: 3 }).withMessage('Name must be atleast 3 characters'),
    userController.signupUser
);

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('userName').isLength({ min: 3 }).withMessage('Name must be atleast 3 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid Otp')],
    userController.registerUser
);

router.post('/forgot-paasword-otp',
    body('email').isEmail().withMessage('Invalid email'),
    userController.forgotOtp
);

router.post('/new-paasword', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid Otp')],
    userController.newPassword
)

router.post('/username-otp', userController.sendUsernameOtp);
router.post('/update-username', userController.updateUsername);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters')],
    userController.loginUser);

router.patch('/profile-pic', authMiddleware.authUser, upload.single('profilePic'), userController.updateProfilePic)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.post('/checkUsername', authMiddleware.authUser, userController.checkUsername)

router.get('/public/:username', userController.getUser)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

module.exports = router;