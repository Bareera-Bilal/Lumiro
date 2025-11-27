const e = require("express")
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { transporter } = require("../config/nodemailer")
require('dotenv').config()




// REGISTER HANDLER 

const registerHandler = async (req, res) => {

    try {

        const { email, username, password } = req.body

        if (email === "" || password === "" || username === "") {

            return res.status(400).json({ message: "ALL DETAILS ARE REQUIRED !" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "USER ALREADY EXISTS" })
        }

        const encryptPass = await bcrypt.hash(password, 10)

        await User.create({ email, username, password: encryptPass })

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Registration Successful",
            text: "Welcome to LUMIRO - Glow in Your Way", 
            html: `<h2>Welcome to LUMIRO - Glow in Your Way</h2>
                   <p>We’re excited to have you join our community!</p>`
        };


        await transporter.sendMail(mailOptions)


        return res.status(201).json({ messsage: "NEW USER CREATED SUCCESSFULLY" })



    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "SERVER ERROR" })
    }
}

// END OF REGISTER HANDLER 




// LOGIN HANDLER

const loginhandler = async (req, res) => {

    try {

        const { email, password } = req.body

        if (email === "" || password === "") {
            return res.status(400).json({ message: "EMAIL AND PASSWORD BOTH ARE REQUIRED !" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser === null) {
            return res.status(404).json({ message: "NO USER FOUND !" })
        }
        const verifyPass = await bcrypt.compare(password, existingUser.password)

        const payload = {
            userId: existingUser._id,
            username: existingUser.username
        }


        if (verifyPass) {
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: 24 * 60 * 60 * 1000
            })
            return res.json({ message: "LOGGED IN SUCCESSFULLY !", token })
        } else {
            return res.status(400).json({ message: "PASSWORD INCORRECT !" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }

}

// END OF LOGIN HANDLER




// FETCH USER HANDLER

const fetchUserhandler = async (req, res) => {
    try {


        console.log("request user", req.user)

        let { userId } = req.user

        let user = await User.findById(userId)

        if (user !== null) {
            return res.status(200).json({ message: "1 user Found !", payload: user })
        } else {
            return res.status(404).json({ message: "User Not Found !" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server Error !" })
    }

}

// END OF FETCH USER HANDLER


module.exports = { registerHandler, loginhandler, fetchUserhandler }