const mongoose = require('mongoose')

const AppointmentSchema = mongoose.Schema({
    startTime: {
        type: String,
        required : [true, "Select a valid time"]
    },
    endTime: {
        type: String,
        required : [true, "Select a valid time"]
    },
    bookDate: {
        type: String
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],
    status: {
        type: String,
        required: true,
        enum: ["waiting", "approved", "ongoing", "closed", "cancelled"],
        default: 'waiting'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessInstance"
    }
},
{ timestamp: true})

AppointmentSchema.pre('save', async function() {
    this.bookDate = new Date()
    this.status = 'waiting'
})


module.exports = mongoose.model("Appointment", AppointmentSchema)