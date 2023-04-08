const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is a required field'],
        minlength: 3,
        maxlength: 10
    },
    lastName: {
        type: String,
        required: [true, 'Last name is a required field'],
        minlength: 3,
        maxlength: 10
    },
    email: {
        type: String,
        required: [true, 'Email is a required field'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Please provide a valid email address'
        ],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is a required field']
    },
    password: {
        type: String,
        required: [true, 'Password is a required field'],
        minlength: 6,
    },
    address: {
        type: String,
        required: [true, 'Addess is a required field']
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessInstance"
    },
    role: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "active", "suspended"],
        default: 'pending'
    }
},
{timestamps: true})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign(
        {
            userId: this._id,
            username: this.email,
            role: this.role,
            business: this.business
        }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
     })
}

UserSchema.methods.comparePassword =  async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)