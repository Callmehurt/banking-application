const AccountService = require('../services/account-service');
const CustomerService = require('../services/customer-service');
const {customerVerify} = require('../middleware');
const {TransactionValidation, DepositValidation, WithdrawValidation, TransferValidation} = require('../utils/validation-schema');
const {Transactions} = require('../enums')


module.exports = (app) => {

    const accountService = new AccountService();
    const customerService = new CustomerService();

    app.get('/account/:accountNumber', async (req, res, next) => {

        try{

            const accountNumber = req.params.accountNumber;
            const data = await accountService.findAccount({accountNumber});
            return res.json(data);

        }catch(err){
            next(err);
        }
    })

    //for staffs
    app.post('/account/staff/deposit/transaction', async (req, res, next) => {
        try{   
            const {error} = DepositValidation(req.body);
            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            
            const {accountNumber, amount, type} = req.body;
            if(type != Transactions.deposit){
                return res.status(500).json({
                    message: "Operation invalid"
                });  
            }
            const result = await accountService.deposit({accountNumber, amount});
            if(!result){
                return res.status(500).json({
                    message: "Something went wrong"
                });  
            }
            return res.status(200).json({
                message: "Transaction completed successfully"
            })
        }catch(err){
            next(err);
        }
    })

    app.post('/account/staff/withdraw/transaction', async (req, res, next) => {
        try{   
            const {error} = WithdrawValidation(req.body);
            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            
            const {accountNumber, amount, type} = req.body;
            if(type != Transactions.withdraw){
                return res.status(500).json({
                    message: "Operation invalid"
                });  
            }
            const result = await accountService.withdraw({accountNumber, amount});
            if(!result){
                return res.status(500).json({
                    message: "Something went wrong"
                });  
            }
            return res.status(200).json({
                message: "Transaction completed successfully"
            })
        }catch(err){
            next(err);
        }
    })

    app.post('/account/staff/transfer/transaction', async (req, res, next) => {
        try{   
            const {error} = TransferValidation(req.body);
            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            
            const {senderAccountNumber, receiverAccountNumber, amount, type} = req.body;

            if(type != Transactions.transferedTo){
                return res.status(500).json({
                    message: "Operation invalid"
                });  
            }
            const result = await accountService.transfer({initiatorAccountNumber: senderAccountNumber, receiverAccountNumber, amount});
            if(!result){
                return res.status(500).json({
                    message: "Something went wrong"
                });  
            }
            return res.status(200).json({
                message: "Transaction completed successfully"
            })
        }catch(err){
            next(err);
        }
    })

    app.get('/account/detail/:accountNumber' ,async (req, res, next) => {
        try{

            const accountNumber = req.params.accountNumber;
            const statement = await accountService.queryAccountStatement({accountNumber});

            return res.status(200).json(statement);
        }catch(err){
            console.log(err);
            next(err);
        }
    })


    //for customer self service
    app.post('/account/customer/perform/transaction', customerVerify ,async (req, res, next) => {
        try{

            const {error} = TransactionValidation(req.body);
            if(error){
                return res
                    .status(400)
                    .json({ error: true, message: error.details[0].message });   
            }
            const customerId = req.customerId;
            const customerAccount = await accountService.findAccountViaCustomer({customerId});
            const parameter = {
                initiatorAccountNumber: customerAccount.accountNumber,
                receiverAccountNumber: req.body?.receiverAccountNumber,
                type: req.body.type,
                amount: req.body.amount
            }
            const data = await accountService.addTransaction(parameter);
            if(!data){
                return res.status(500).json({
                    message: "Something went wrong"
                });  
            }
            return res.status(200).json({
                message: "Transaction completed successfully"
            })
        }catch(err){
            console.log(err);
            next(err);
        }
    })


    app.get('/account/customer/my/account', customerVerify ,async (req, res, next) => {
        try{

            const customerId = req.customerId;
            const customerAccount = await accountService.findAccountViaCustomer({customerId});
            const {transaction, ...other} = customerAccount._doc;
            const statement = await accountService.queryAccountStatement({accountNumber: customerAccount.accountNumber});

            return res.status(200).json(statement);
        }catch(err){
            console.log(err);
            next(err);
        }
    })



}