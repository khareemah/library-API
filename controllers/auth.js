const User = require("../models/User");
const OTP = require("../models/Otp");
const bcrypt = require("bcrypt");
const loginValidation = require("../validation/loginValidation");
const regValidation = require('../validation/registrationValidation');
const sendEMail = require('../utils/sendEmail');
const generateOTP = require('../utils/generateOTP')



const registerUser = async (req, res) => {
    const { error } = regValidation(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
        return res.send("Email already exists");
    }
   
    try {
        let otpCode = generateOTP();

        const info = await sendEMail(req.body.email, otpCode);
        if (!info) {
            throw new Error(`Error sending email`);
        }
      
        await new OTP({
            email: req.body.email,
            code: otpCode,
        }).save();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }).save();
        
        res.status(200).send("An OTP was sent to your account, please verify");

    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

const verifyEmail = async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid token");

        const otp = await OTP.findOne({
            email: req.body.email,
            code: req.body.code,
        });
      
        if (!otp) return res.status(400).send("Invalid token");

        await User.updateOne({ email: user.email, isVerified: true });
        await OTP.findByIdAndRemove(otp._id);

        res.status(200).send("email verified sucessfully");
    } catch (error) {
        res.status(400).send("Error Verifying your email");
    }
};

const regenerateOTP = async (req, res) => {
console.log(req.body)
    try {
        let otpCode = generateOTP();

        const info = await sendEMail(req.body.email, otpCode);
        if (!info) {
            throw new Error(`Error sending email`);
        }

        await new OTP({
            email: req.body.email,
            code: otpCode,
        }).save();

        res.status(200).send("otp resent succesfully");

    } catch (err) {
        res.status(500).send({ message: `${err}` });
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    const { error, value } = loginValidation(req.body);
    if (error) {
        return res.status(401).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).send({ message: "invalid credentials" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).send({ message: "invalid credentials" });
    }
    const token = user.createJWT();
    res.status(200).send({ message: 'Authentication successful', token: token });
};

module.exports = { registerUser, login, verifyEmail, regenerateOTP };