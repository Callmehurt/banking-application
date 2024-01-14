const mongoose = require('mongoose');
const CustomerService = require('../services/customer-service');
const AccountService = require('../services/account-service');
const {CustomerValidation, CustomerUpdateValidation} = require('../utils/validation-schema');
const {userVerify, verifyRoles} = require('../middleware')


module.exports = (app) => {

    const customerService = new CustomerService();
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
            const customer = await customerService.createCustomer({name, email, password, phone, address});
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
    });


    app.put('/customer/update', userVerify, verifyRoles(['staff', 'admin']), async (req, res, next) => {
        try{

            const {error} = CustomerUpdateValidation(req.body);

            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }

            const result = await customerService.updateCustomer(req.body);
            if(!result){
                return res.status(500).json({
                    message: "Customer could not be updated"
                });
            }

            return res.status(200).json({
                message: "Customer updated successfully",
                customer: result
            });
            
        }catch(err){
            next(err);
        }
    })

    app.delete('/customer/:customerId/delete', userVerify, verifyRoles(['staff', 'admin']), async (req, res, next) => {
        try{

            const customerId = req.params.customerId;
            const result = await customerService.deleteCustomer({customerId});
            if(!result){
                return res.status(500).json({
                    message: "Customer could not deleted"
                });
            }

            return res.status(200).json({
                message: "Customer deleted successfully"
            });
            
        }catch(err){
            next(err);
        }
    })
    
}