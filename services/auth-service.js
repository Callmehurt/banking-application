const {CustomerRepository, AccountRepository} = require('../repository');
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const {ValidatePassword, GenerateSignature, GenerateSalt, VerifyToken} = require('../utils')

class AuthService{

    constructor(){
        this.customerRepository = new CustomerRepository();
        this.accountRepository = new AccountRepository();
    }

    async customerSignin(inputs){
        try{

            const {email, password} = inputs;

            const existingCustomer = await this.customerRepository.findCustomer({email});

            if(existingCustomer){
            
                const salt = await GenerateSalt();
                const validPassword = await ValidatePassword(password, existingCustomer.password, salt);

                if(validPassword){
                    const {accessToken, refreshToken} = await GenerateSignature({ role: 'customer', _id: existingCustomer._id});
                    const customer = await this.accountRepository.findAccountViaCustomerId({customerId: existingCustomer._id});
                    const {customerId, ...other} = customer._doc;
                    const updateData = {
                        customerId,
                        refreshToken
                    }
                    await this.customerRepository.updateCustomer(updateData);
                    return {
                        customer: {
                            detail:existingCustomer,
                            account: other
                        }, 
                        accessToken,
                        refreshToken,
                    };
                } 
            }
    
            return null;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                err
            )         
        }
    }


    async customerRefreshToken(token){
        try{

            const foundCustomer = await this.customerRepository.findCustomerViaToken({token});
            if(!foundCustomer){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Invalid token"
                )       
            }

            const accessToken = await VerifyToken(token, foundCustomer);
            if(!accessToken){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.UN_AUTHORISED,
                    "Invalid token"
                )       
            }
            const customer = await this.accountRepository.findAccountViaCustomerId({customerId: foundCustomer._id});
            const {customerId, ...other} = customer._doc;

            return {
                customer: {
                    detail: foundCustomer,
                    account: other
                },
                accessToken: accessToken
            };
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = AuthService;