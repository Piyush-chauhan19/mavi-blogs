const userModel = require('../models/user.model')
const nodemailer = require('nodemailer')


module.exports.createUser = async ({
    userName, email, password
}) => {
    if (!userName || !email || !password) {
        console.log({ userName, email, password });

        throw new Error("All fields are required to create user");
    }

    const user = userModel.create({
        userName, email, password
    })

    return user
}

module.exports.updatePassword = async ({email, password}) => {
    if (!email || !password) {
        throw new Error("All fields are required to update password");
    }

    await userModel.findOneAndUpdate(
        { email },
        { password: password},
    );
}   

module.exports.sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`
    };

    await transporter.sendMail(mailOptions);
}
