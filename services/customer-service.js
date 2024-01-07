const {CustomerRepository, AccountRepository} = require('../repository');
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const {GeneratePassword, GenerateSalt} = require('../utils')

class CustomerService{

    constructor(){
        this.repository = new CustomerRepository();
        this.accountRepository = new AccountRepository();
    }


    async createCustomer(inputs){

        const {name, email, address, phone, password} = inputs;

        try{

            const existingCustomer = await this.repository.findCustomer({email});
            if(existingCustomer){
                throw new APIError('Customer already exist', STATUS_CODES.INTERNAL_ERROR);
            }
            const salt =  await GenerateSalt();
            const hashedPassword = await GeneratePassword(password, salt);
            return await this.repository.createCustomer({name, email, address, phone, hashedPassword});
            

        }catch(err){
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                err
            ) 
        }
    }


    async findCustomerViaId({customerId}){
        try{

            const customer = await this.repository.findCustomerViaId({customerId});
            const account = await this.accountRepository.findAccountViaCustomerId({customerId});
            return {
                customer: customer,
                account: account
            };
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                'Record not found'
            ) 
        }
    }

    async updateCustomer(data){
        try{

            const result = this.repository.updateCustomer(data);
            return result;
            
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                'Customer update failed'
            ) 
        }
    }

    async deleteCustomer({customerId}){
        try{

            const result = this.repository.deleteCustomer({customerId});
            return result;
            
        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                'Record not found'
            ) 
        }
    }
}

module.exports = CustomerService;