const bcrypt = require('bcrypt');
const jtw = require('jsonwebtoken');


module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt(Number(process.env.SALT));
}

module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  };
  
  module.exports.ValidatePassword = async (
    enteredPassword,
    savedPassword,
    salt
  ) => {
    return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
  };