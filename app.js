require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const ROLES = {
  ADMIN: "admin", 
  SHOPOWNER: "shop-owner", 
  STAFF: "staff", 
  USER: "user"
}


//connectDB
const connectDB = require('./db/connect')

//launchAdmin
const createAdmin = require('./db/addSuper')

//auth middleware
const {auth, authoRize} = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const ownerRouter = require('./routes/shopOwner')
const businessRouter = require('./routes/business')
const staffRouter = require('./routes/staff')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

//create admin
createAdmin();

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/admin', auth, authoRize(ROLES.ADMIN), adminRouter)
app.use('/api/v1/owner', auth, authoRize(ROLES.SHOPOWNER), ownerRouter)
app.use('/api/v1/business', businessRouter)
app.use('/api/v1/staff', staffRouter)
// app.use('/api/v1/jobs', auth, jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
