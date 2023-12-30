const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt(Number(process.env.SALT));
}

module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
  };
  
module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
) => {
  return await bcrypt.compare(
    enteredPassword,
    savedPassword
);
};


module.exports.GenerateSignature = async (payload) => {
  try {

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_SECRET,
        {
            expiresIn : '12h'
        }
    )

    const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_SECRET,
        {
            expiresIn:'30d'
        }
    )

    return Promise.resolve({accessToken, refreshToken});

  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

module.exports.VerifyToken = async (refreshToken, foundUser) => {
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    (err, decoded) => {
        if(err || foundUser._id != decoded._id){
            return null;
        }else {
            const accessToken = jwt.sign(
                {
                    _id: decoded._id,
                    userType: decoded.userType
                },
                process.env.ACCESS_SECRET,
                {expiresIn: '12h'}
            )

            // const {password, refreshToken, ...others} = foundUser._doc;
            return accessToken;
        }
    }
)
}