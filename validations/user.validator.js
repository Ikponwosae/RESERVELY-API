const {body } = require('express-validator')

const userRegister = () => {
    return [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().normalizeEmail().notEmpty().withMessage('Email is a required field'),
        body('phoneNumber').isString().notEmpty().withMessage('Phone number cannot be empty'),
        body('password').notEmpty().isStrongPassword().withMessage('Please input password'),
        body('address').notEmpty().withMessage('Address is a required field')
    ]
}


module.exports = {
    userRegister,
}