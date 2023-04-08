const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
jest.useRealTimers()

beforeEach( async () => {
    await User.deleteMany()})

test('Should signup a new user', async () => {
    const response = await request(app).post('/api/v1/auth/register')
    .send({
    firstName: 'Dhriti',
    lastName: 'Tstiy',
    email:"Dhriti@test.com",
    phoneNumber: "98638829352",
    address: "test case street 55",
    password:"1234567890",
    role: "user"
    })
.expect(201);

//Assert that the database was changed correctly
const user = User.findById(response.body.user._id)
    expect(response.body).toMatchObject({
    user:{
    FirstName: 'Dhriti',
    Email: "Dhriti@test.com",
    LastName: "Tstiy",
    },
    })
    expect(user.password).not.toBe('1234567890');
})