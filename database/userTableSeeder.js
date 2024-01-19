const {UserModel} = require('../models')
const {UserRoles} = require('../enums/UserRole');
const { GeneratePassword, GenerateSalt } = require('../utils/index');
const mongoose = require('mongoose');


async function seedDatabase() {
try {
    
    await mongoose.connect("mongodb+srv://hurtlocker:nepal123@hurtlocker.jljfpw4.mongodb.net/banking?retryWrites=true&w=majority");
    console.log('Connected to MongoDB');
    
    const salt =  await GenerateSalt();
    const password =  await GeneratePassword('london123', salt);

    const seedUsers = [
        {
            username: 'Random Staff',
            email: 'randomstaff@mail.com',
            password: password,
            role: UserRoles.staff,
            refreshToken: ''
        },
        {
            username: 'Random Admin',
            email: 'randomadmin@mail.com',
            password: password,
            role: UserRoles.admin,
            refreshToken: ''
        },
    ]

    // await newUser.save();
    await UserModel.insertMany(seedUsers);
    console.log('Seed data inserted successfully');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        // Disconnect from MongoDB (optional)
        await mongoose.disconnect();
    }
}
  
  // Call the async function
  seedDatabase();