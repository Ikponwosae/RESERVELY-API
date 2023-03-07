const mongoose = require('mongoose')

const ServiceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        default: 30
    },
    price: {
        type: String,
        required: [true, "Service must has a price line"]
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessInstance"
    }
},
{ timestamps: true})

module.exports = mongoose.model("Service", ServiceSchema)