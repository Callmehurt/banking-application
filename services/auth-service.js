const {CustomerRepository, AccountRepository, UserRepository} = require('../repository');
const {APIError, STATUS_CODES} = require('../utils/app-errors');
const {ValidatePassword, GenerateSignature, GenerateSalt, VerifyToken} = require('../utils')

class AuthService{

    constructor(){
        this.customerRepository = new CustomerRepository();
        this.accountRepository = new AccountRepository();
        this.userRepository = new UserRepository();
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

    async staffSignin(inputs){
        try{

            const {username, password} = inputs;

            const existingStaff = await this.userRepository.findUserViaUsername({username});

            if(existingStaff){
            
                const salt = await GenerateSalt();
                const validPassword = await ValidatePassword(password, existingStaff.password, salt);

                if(validPassword){
                    const {accessToken, refreshToken} = await GenerateSignature({ role: existingStaff.role, _id: existingStaff._id});
                    const updateData = {
                        userId: existingStaff._id,
                        refreshToken
                    }
                    const user = await this.userRepository.updateUser(updateData);
                    return {
                        user,
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

    async staffRefreshToken(token){
        try{

            const user = await this.userRepository.findUserViaToken({token});
            if(!user){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.INTERNAL_ERROR,
                    "Invalid token"
                )       
            }

            const accessToken = await VerifyToken(token, user);
            if(!accessToken){
                throw new APIError(
                    "API Error",
                    STATUS_CODES.UN_AUTHORISED,
                    "Invalid token"
                )       
            }
            return {
                user,
                accessToken: accessToken
            };
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = AuthService;