const { body } = require('express-validator')

const serviceAdd = async () => {
    return [
        body('name').notEmpty().withMessage('Name of service is required').isLength({max: 20}),
        body('duration').notEmpty().withMessage('service must have duration'),
        body('price').notEmpty().withMessage('Enter the price per unit')
    ]
}

module.exports = {
    serviceAdd
}