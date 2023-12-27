const mongoose = require('mongoose');
const {CustomerModel} = require('../models');
const {APIError, STATUS_CODES} = require('../utils/app-errors');

class CustomerRepository{

    
    async createCustomer({name, email, address, phone, password}){
        try{

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
}

module.exports = CustomerRepository;