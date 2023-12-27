
const {CustomerRepository} = require('../repository');
const {APIError, STATUS_CODES} = require('../utils/app-errors');

class CustomerService{

    constructor(){
        this.repository = new CustomerRepository();
    }


    async createCustomer(inputs){

        const {name, email, address, phone, password} = inputs;

        try{

            const existingCustomer = await this.repository.findCustomer({email});

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            ) 
        }
    }
}