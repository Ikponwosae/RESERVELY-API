const mongoose = require('mongoose')

const BusinessSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Business name is a required field"],
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    hasPhysicalAddress: {
        type: Boolean,
        required: true,
        default: false
    },
    address: {
        type: String
    },
    regNumber: {
        type: String
    },
    website: {
        type: String
    },
    country: {
        type: String
    },
    openHour: {
        type: String
    },
    closeHour: {
        type: String
    },
    category: [
        {
            type: String,
            required : true,
        }
    ],
    teamSize: {
        type: Number
    },
    // rating: {
    //     type: Number,
    //     default: 3
    // }
},
{ timestamps: true})


module.exports = mongoose.model("Business", BusinessSchema)