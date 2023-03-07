const { User, Business } =  require('../models/index')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } =  require('../errors/index')

// @desc All shop owners
// @route GET /api/v1/admin/dashboard
// @access Admin
const getShops = async (req, res) => {
    const shops = await User.find({role: "shop-owner"}).sort('createdAt')
    res.status(StatusCodes.OK).json({owners: shops, count: shops.length})
}

module.exports = {
    getShops
}