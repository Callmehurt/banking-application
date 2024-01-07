const {UserModel} = require('../models');
const {APIError, STATUS_CODES} = require('../utils/app-errors');


class UserRepository{

    async findUserViaEmail({email}){
        try{

            const user = await UserModel.findOne({email: email});
            return user;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create User"
              );
        }
    }

    async findUserViaToken({token}){
        try{

            const result = await UserModel.findOne({refreshToken: token});
            return result;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find User"
              );
        }   
    }

    async updateUser(inputs){
        try{

            const {userId, ...other} = inputs;
            const result = await UserModel.findByIdAndUpdate(userId, other, {
                returnOriginal: false
            }).exec()
            return result;

        }catch(err){
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update user"
              );
        }   
    }

}

module.exports = UserRepository;