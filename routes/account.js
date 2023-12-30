const AccountService = require('../services/account-service');

module.exports = (app) => {

    const accountService = new AccountService();

    app.get('/account/:accountNumber', async (req, res, next) => {

        try{

            const accountNumber = req.params.accountNumber;
            const data = await accountService.findAccount({accountNumber});
            return res.json(data);

        }catch(err){
            next(err);
        }
    })

    app.put('/account/add/transaction', async (req, res, next) => {
        try{

            const {fromAccountNumber, toAccountNumber, type, amount} = req.body;
            const data = await accountService.addTransaction({fromAccountNumber, toAccountNumber, type, amount});
            return res.json(data);

        }catch(err){
            next(err);
        }
    })
}