const {CustomerModel} = require('../models');
const {APIError, STATUS_CODES} = require('../utils/app-errors');

class CustomerRepository{

    
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

    async updateCustomer(inputs){
        try{

            const {customerId, ...other} = inputs;
            const customerResult = await CustomerModel.findByIdAndUpdate(customerId, other, {
                returnOriginal: false
            }).exec()
            return customerResult;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update Customer"
              );
        }   
    }


}

module.exports = CustomerRepository;