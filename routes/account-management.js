const AccountManagementService = require('../services/account-management-service');
const {userVerify} = require('../middleware')

module.exports = (app) => {

    const accountManagementService = new AccountManagementService();


    app.get('/fetch/all/customers', userVerify, async (req, res, next) => {
        try{

            const customers = await accountManagementService.fetchAllCustomer();
            return res.status(200).json(customers);

        }catch(err){
            next(err);
        }
    });

}