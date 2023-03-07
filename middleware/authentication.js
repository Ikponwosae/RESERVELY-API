const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the routes
    req.user = { userId: payload.userId, email: payload.username, role: payload.role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

function authoRize(role) {
  return async (req, res, next) =>  {
    if(req.user.role != role){
      throw new UnauthenticatedError('Unauthorized access')
    }

    next()
  }
}

module.exports = {
  auth,
  authoRize
};
