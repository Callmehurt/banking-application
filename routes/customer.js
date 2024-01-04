const mongoose = require('mongoose');
const CustomerService = require('../services/customer-service');
const AccountService = require('../services/account-service');
const {CustomerValidation} = require('../utils/validation-schema');
const {userVerify, verifyRoles} = require('../middleware')


module.exports = (app) => {

    const cutomerService = new CustomerService();
    const accountService = new AccountService();


    app.post('/customer/register', userVerify, verifyRoles(['staff', 'admin']),async (req, res, next) => {

        const session = await mongoose.startSession();

        try{

            const {name, email, password, phone, address} = req.body;

            await session.startTransaction();

            const {error} = CustomerValidation(req.body);

            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            const customer = await cutomerService.createCustomer({name, email, password, phone, address});
            const customerId = customer._id;
            const account = await accountService.createAccount({customerId});

            await session.commitTransaction();

            return res.json({
                customer: customer,
                account: account
            });

        }catch(err){
            await session.abortTransaction();
            next(err);
        }finally{
            await session.endSession();
        }
    })
}