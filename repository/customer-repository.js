const {CustomerModel, AccountModel} = require('../models');
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const mongoose = require('mongoose');

class CustomerRepository{

    async fetchCustomers(){
        try{

            const customers = await CustomerModel.find({});
            return customers;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to get Customers"
              );
        }
    }
    
    async createCustomer({name, email, address, phone, hashedPassword}){
        try{

            const password = hashedPassword;
            const customer = new CustomerModel({
                name,
                email,
                address,
                phone,
                password,
                refreshToken: ''
              });
              const customerResult = await customer.save();
              return customerResult;

        }catch(err){
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
              );
        }
    }

    async findCustomer({email}){
        try{

            const customerResult = await CustomerModel.findOne({email: email});
            return customerResult;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find Customer"
              );
        }   
    }

    async findCustomerViaToken({token}){
        try{

            const customerResult = await CustomerModel.findOne({refreshToken: token});
            return customerResult;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find Customer"
              );
        }   
    }

    async findCustomerViaId({customerId}){
        try{

            const customerResult = await CustomerModel.findById(customerId);
            return customerResult;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find Customer"
              );
        }   
    }

    async updateCustomer(inputs){

        const session = await mongoose.startSession();
        try{

            await session.startTransaction();
            const {customerId, ...other} = inputs;
            const customerResult = await CustomerModel.findByIdAndUpdate(customerId, other, {
                returnOriginal: false
            }).exec()
            await session.commitTransaction();
            return customerResult;

        }catch(err){
            await session.abortTransaction();
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update Customer"
              );
        }finally{
            await session.endSession();
        }   
    }

    async deleteCustomer({customerId}){

        const session = await mongoose.startSession();
        try{

            await session.startTransaction();
            const customer = await CustomerModel.findById(customerId);
            await AccountModel.findOneAndDelete({customerId: customerId});
            const result = await customer.deleteOne();
            await session.commitTransaction();
            return result;

        }catch(err){
            await session.abortTransaction();
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to delete Customer"
              );
        }finally{
            await session.endSession();
        }
    }


}

module.exports = CustomerRepository;