const CustomerService = require('../services/customer-service');
const AccountService = require('../services/account-service');
const {CustomerValidation} = require('../utils/validation-schema');


module.exports = (app) => {
    const cutomerService = new CustomerService();
    const accountService = new AccountService();
    app.post('/customer/register', async (req, res, next) => {
        try{
            const {name, email, password, phone, address} = req.body;

            const {error} = CustomerValidation(req.body);

            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            const customer = await cutomerService.createCustomer({name, email, password, phone, address});
            const customerId = customer._id;
            const account = await accountService.createAccount({customerId});
            return res.json({
                customer: customer,
                account: account
            });
        }catch(err){
            next(err);
        }
    })
}