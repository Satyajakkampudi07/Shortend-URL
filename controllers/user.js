const User = require("../models/user.js")
const {generateToken} = require('../services/authUtility.js')
const {sendEmail} = require('../services/emailUtility')

class UserController{

    // SignUp, Login, Logout
    async userSingup(req,res) {
        const {fullName, emailId, password} = req.body;
        const existingUser = await User.findOne({emailId});
        if (existingUser) {
            return res.json({ msg: "User already exists with this email" });
        }
        const person = await User.create({
            fullName,
            emailId,
            password
        });
        return res.status(201).json({_id: person._id, username: person.fullName , msg:`User created successfully`});
    }
    
    async userLogin(req,res) {
        const {emailId, password} = req.body;
        const person = await User.findOne({emailId});
        if(!person){
            return res.json({msg: "Invalid emailId"})
        }
        const IsPwdMatched = await person.matchPassword(password);
        if(IsPwdMatched){
            const token = generateToken(person);
            res.cookie('uid',token);
            return res
            .status(200)
            .json({msg: "Login successfull", user:{id:person._id, fullName: person.fullName, emailId: person.emailId, redirect:`http://localhost:8080/user/${person._id}`, updateUser:`http://localhost:8080/updateUser/`}});
        }else{
            return res.json({msg: "Wrong Password, try again"})
        }
    }

    async userLogout(req,res){
        res.clearCookie('uid');
        return res.status(200).json({msg:"user has successfully loggedout"});
    }


    ///////////////

    async getUsers(req,res){
        const users = await User.find({},('-password'));
        if(!users) return res.status(400).json({msg:"Users not found"})
        return res.status(200).json({msg: "Users found", users })
    }

    async getUserById(req,res){
        const id = req.params.id;
        const person = await User.findById(id);
        if(!person) return res.status(400).json({msg:`User not found with the id ${id}`});
        return res.status(200).json({msg:`User found`, person})

    }

    async deleteUserById(req,res){
        const id = req.params.id;
        const person = await User.findByIdAndDelete(id);
        if(!person) return res.json({msg:"person not found to deleted"});
        return res.status(200).json({msg:"user deleted successfully", userId:person._id});
    }

    async updateUser(req, res) {
        const { fullName, emailId, oldPassword, newPassword } = req.body;
    
        const person = await User.findById(req.user._id);
        if (!person) return res.status(404).json({ msg: "User not found" });
    
        const isMatch = await person.matchPassword(oldPassword);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect old Password" });
    
        let msg = "";
    
        if (fullName) {
            person.fullName = fullName;
            msg += "Name, ";
        }
    
        if (emailId) {
            person.emailId = emailId;
            msg += "EmailId, ";
        }
    
        if (newPassword) {
            person.password = newPassword;
            msg += "Password ";
        }
    
        await person.save();
        msg = msg.trim() + " Updated Successfully!";
    
        return res.json({msg, user: {id: person._id,fullName: person.fullName,emailId: person.emailId}});
    }

    ///Password
    async forgotPassword(req,res){
        const {emailId} = req.body;
        const person = await User.findOne({emailId});
        if(!person) return res.json({msg: "User not found with that emailId"});

        const otp  = Math.floor(100000 + Math.random() * 900000);
        const expiry = Date.now() + 10*60*1000;

        person.otp = otp;
        person.otpExpiry = expiry;
        await person.save();

        await sendEmail(emailId,`Your OTP to reset your password ${person.otp}`);
        return res.json({msg:"OTP sent to your email", redirect:`http://localhost:8080/resetPassword`})
    }
    
    async resetPassword(req,res){
        const {emailId, otp, newpassword} = req.body;
        const person = await User.findOne({emailId});
        if(!person) return res.json({msg: "User not found with that emailId"});
        if (!newpassword || newpassword.trim() === '') {
            return res.status(400).json({ msg: "New password is required" });
        }
        if(person.otp!=otp || person.otpExpiry<Date.now()){
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        person.password = newpassword;
        person.otp = null;
        person.otpExpiry = null;

        await person.save()
        return res.json({msg:"Passwrod has changed successfully", user:{emailId: person.emailId}})

    }


}

module.exports = new UserController();