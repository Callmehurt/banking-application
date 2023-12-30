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

module.exports.TransactionValidation = (body) => {
    const schema = Joi.object({
        type: Joi.string().valid(...['withdraw', 'deposit', 'transfered-in', 'transfered-to']),
        amount: Joi.string().required()
        .pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
    });

    return schema.validate(body);
}