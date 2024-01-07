const Joi = require('joi');

module.exports.CustomerValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string(),
        address: Joi.string(),
        phone: Joi.string().required()
        .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .min(10) 
        .max(10),
        email: Joi.string().email().required().label("Email"),
		password: Joi.string().alphanum().required().label("Password"),
    });

    return schema.validate(body);
}

module.exports.CustomerUpdateValidation = (body) => {
    const schema = Joi.object({
        customerId: Joi.required(),
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required()
        .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .min(10) 
        .max(10),
        email: Joi.string().email().required().label("Email"),
    });

    return schema.validate(body);
}

module.exports.TransactionValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().valid(...['withdraw', 'deposit', 'transfered-in', 'transfered-to']),
        amount: Joi.number().precision(2).required(),
        receiverAccountNumber:Joi.number().integer().allow(null)
    });

    return schema.validate(body);
}

module.exports.DepositValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        amount: Joi.number().precision(2).required(),
        accountNumber:Joi.number().integer().required(),
    });

    return schema.validate(body);
}

module.exports.WithdrawValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        amount: Joi.number().precision(2).required(),
        accountNumber:Joi.number().integer().required(),
    });

    return schema.validate(body);
}

module.exports.TransferValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        amount: Joi.number().precision(2).required(),
        senderAccountNumber:Joi.number().integer().required(),
        receiverAccountNumber:Joi.number().integer().required(),
    });

    return schema.validate(body);
}