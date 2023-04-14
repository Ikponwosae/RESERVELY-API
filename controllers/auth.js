const { User, Business } = require("../models/index");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const { verifyAccount, staffOnboard } = require("../email");
const jwt = require("jsonwebtoken");

// @desc Register a user....works for all user types
// @route POST /api/v1/auth/register
// @access All
const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  const url = `${process.env.CLIENT_URL}/complete-registration/${String(
    token
  )}`;

  await verifyAccount(String(req.body.email), String(req.body.firstName), url);

  res.status(StatusCodes.CREATED).json({
    user: {
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
    },
    token,
  });
};

// @desc complete a users registration(active)....works for all user types
// @route POST /api/v1/auth/verification/:token
// @access All
const completeRegistration = async (req, res) => {
  const { userId } = jwt.verify(req.params.token, process.env.JWT_SECRET);
  await User.updateOne({ _id: userId }, { $set: { status: "active" } });
  const user = await User.findById({ _id: userId });
  
  res.status(StatusCodes.OK).json({ user: { id: user._id, role: user.role } });
};

// @desc Register a business
// @route POST /api/v1/auth/register/business/:userId
// @access Shop Owner
const registerBusiness = async (req, res) => {
  const { userId } = req.params;
  let busOwner = await User.findById({ _id: userId });
  //REGISTER BUSINESS
  const {
    name,
    description,
    website,
    country,
    openHour,
    closeHour,
    category,
    hasPhysicalAddress,
    regNumber,
    teamSize,
  } = req.body;

  const business = {
    name,
    hasPhysicalAddress,
    regNumber,
    owner: userId,
    address: busOwner.address,
    description,
    website,
    country,
    openHour,
    closeHour,
    category,
    teamSize,
  };
  const newBusiness = await Business.create({ ...business });

  busOwner = await User.updateOne(
    { _id: userId },
    { $set: { business: newBusiness._id } }
  );
  
  res.status(StatusCodes.CREATED).json({
    business: {
      id: newBusiness._id,
      name: newBusiness.name,
      hasPhysicalAddress: newBusiness.hasPhysicalAddress,
      address: newBusiness.address,
      ownerId: newBusiness.owner,
      regNumber: newBusiness.regNumber,
    },
  });
};

// @desc shop owner staff invite
// @route POST /api/v1/owner/invite
// @access Shop Owner
const inviteStaff = async (req, res) => {
  const owner = await User.findById({ _id: req.user.userId });
  const { staffEmail, name } = req.body;
  if (!staffEmail || !name) throw new BadRequestError("values cannot be empty");
  const token = jwt.sign(
    {
      ownerId: owner._id,
      staffEmail: staffEmail,
      role: "staff",
      business: owner.business,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  const url = `${process.env.CLIENT_URL}/staff-verify/${String(token)}`;
  await staffOnboard(
    staffEmail,
    name,
    url,
    owner.firstName + " " + owner.lastName,
    owner.email
  );
  res.status(StatusCodes.OK).send("invited");
};

// @desc shop owner staff signUp
// @route POST /api/v1/auth/staff-verify/:token
// @access Staff
const staffRegister = async (req, res) => {
  const { staffEmail, role, business } = jwt.verify(
    req.params.token,
    process.env.JWT_SECRET
  );
  const { firstName, lastName, phoneNumber, address, password } = req.body;

  const user = {
    firstName,
    lastName,
    email: staffEmail,
    phoneNumber,
    address,
    business,
    role,
    password,
    status: "active",
  };
  const staff = await User.create({ ...user });
  const token = staff.createJWT();
  res.status(StatusCodes.CREATED).json({
    staff: {
      FirstName: staff.firstName,
      LastName: staff.lastName,
      staff: user.email,
      business: staff.business,
    },
    token,
  });
};

// @desc User Login
// @route POST /api/v1/auth/login
// @access All
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid credentials");

  if (user.status == "pending")
    throw new UnauthenticatedError("You need to verify your account");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Invalid credentials, wrong password");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      business: user.business,
    },
    token,
  });
};

//@desc Get user by ID
//@route GET api/v1/auth/user/:id
const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) throw new UnauthenticatedError("Invalid credentials");

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
};

module.exports = {
  registerUser,
  registerBusiness,
  inviteStaff,
  staffRegister,
  login,
  completeRegistration,
  getUser,
};
