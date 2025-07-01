const { validationResult } = require('express-validator')
const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const otpModel = require('../models/otp.model')
const blacklistTokenModel = require('../models/blacklistToken')




module.exports.signupUser = async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ error: err.array() });
    }

    const { email, userName } = req.body;


    const isUser = await userModel.findOne({ email })

    if (isUser) {
        return res.status(400).json({ message: 'Email already exists' })
    }

    const taken = await userModel.findOne({ userName });

    if (taken) {
        return res.status(400).json({ message: "User Name already taken" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await otpModel.findOneAndUpdate(
        { email },
        { otp, expiresAt },
        { upsert: true, new: true }
    );

    await userService.sendOtpEmail(email, otp);
    res.status(200).json("otp sent succesfully")


}

// module.exports.verifyOtp = async (req, res, next) => {
//     const err = validationResult(req);
//     if (!err.isEmpty()) {
//         return res.status(400).json({ erros: err.array() })
//     }

//     const { email, otp } = req.body;




//     res.status(200).json("email verified")

// }

module.exports.registerUser = async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ erros: err.array() })
    }

    const { email, userName, password, otp } = req.body;

    const record = await otpModel.findOne({ email });

    if (!record) return res.status(400).json({ message: 'No OTP found' });
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

    await otpModel.deleteOne({ email });

    const isUser = await userModel.findOne({ email })

    if (isUser) {
        return res.status(400).json({ message: 'Email already exists' })
    }

    const taken = await userModel.findOne({ userName });

    if (taken) {
        return res.status(400).json({ message: "User Name already taken" });
    }

    const hashedpassword = await userModel.hashPassword(password)

    const user = await userService.createUser({ userName, email, password: hashedpassword });
    const token = user.generateAuthToken();

    res.status(200).json({ token, user })

}

module.exports.loginUser = async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ error: err.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password')

    if (!user) {
        return res.status(400).json({ message: 'Incorrect Email or Password' })
    }

    const isMatch = await user.comparePassword(password);

    console.log(isMatch);


    if (!isMatch) {
        return res.status(401).json('eeeeeeeeeeeeeEmail or password incorrect');
    }

    const token = user.generateAuthToken()

    res.cookie('token', token)

    res.status(200).json({ token, user })
}


module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.aplit(' ')[1];
    res.clearCookie('token');


    await blacklistTokenModel.create({ token });

    res.status(200).json('user logged out')
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.updateProfilePic = async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ error: err.array() });
    }

    const id = req.user._id;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const updated = await userModel.findByIdAndUpdate(
        id,
        { profilePic: req.file.filename },
        { new: true }
    )

    if (!updated) {
        return res.status(404).json({error: 'user not found'})
    }

    res.status(200).json({message: 'Profile pic update'})
}