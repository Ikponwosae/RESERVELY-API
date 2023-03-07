const adminUser = require('../models/user')
const bcrypt = require('bcryptjs')

function createAdmin(){
  adminUser.estimatedDocumentCount((err, count) => {
    if(!err && count === 0){
      new adminUser({
        firstName: "Admin",
        lastName: "Super",
        email: "super@email.com",
        phoneNumber: "123456789",
        password: "admin123",
        address: "testing at peak lane",
        role: "admin"
      }).save(err => {
        if(err) {
          console.log("error", err)
        }
      })
      console.log("successfully created admin super user")
    }
  })

}

module.exports = createAdmin