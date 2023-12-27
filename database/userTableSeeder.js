const {UserModel} = require('../models')
const {UserRoles} = require('../enums/UserRole');
const { GeneratePassword, GenerateSalt } = require('../utils/index');
const mongoose = require('mongoose');


async function seedDatabase() {
try {
    
    await mongoose.connect("mongodb+srv://hurtlocker:nepal123@hurtlocker.jljfpw4.mongodb.net/banking?retryWrites=true&w=majority");
    console.log('Connected to MongoDB');
    
    const salt =  await GenerateSalt();
    const password =  await GeneratePassword('nepal123', salt);

    const seedUsers = [
        {
            username: 'staff',
            email: 'staff@mail.com',
            password: password,
            role: UserRoles.staff
        },
        {
            username: 'admin',
            email: 'admin@mail.com',
            password: password,
            role: UserRoles.admin
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