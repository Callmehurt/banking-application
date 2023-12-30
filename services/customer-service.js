const {CustomerRepository} = require('../repository');
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const {GeneratePassword, GenerateSalt} = require('../utils')

class CustomerService{

    constructor(){
        this.repository = new CustomerRepository();
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
}

module.exports = CustomerService;