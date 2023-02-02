const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

class UserService {
    constructor(userModel){
        this.userModel = userModel;
    }
    
    queryUsers = async (filter, options) => {
        const users = await this.userModel.paginate(filter, options);
        return users;
    }

    getUserById = async (id) => {
        return this.userModel.findById(id);
    }

    getUserByEmail = async (emailAddress) => {
        return this.userModel.findOne({ emailAddress });
    };

    getUserByUserName = async (userName) => {
        return this.userModel.findOne({ userName });
    };

    getUserByAccountNumber = async (accountNumber) => {
        return this.userModel.findOne({ accountNumber });
    };

    getUserByIdentityNumber = async (identityNumber) => {
        return this.userModel.findOne({ identityNumber });
    };

    createUser = async (userBody) => {
        if (await this.getUserByEmail(userBody.emailAddress)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'emailAddress already taken');
        }
        if (await this.getUserByUserName(userBody.userName)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'userName already taken');
        }
        if (await this.getUserByAccountNumber(userBody.accountNumber)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'accountNumber already taken');
        }
        if (await this.getUserByIdentityNumber(userBody.identityNumber)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'identityNumber already taken');
        }
        return this.userModel.create(userBody);
    };

    updateUserById = async (userId, updateBody) => {
        const user = await this.getUserById(userId);
        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        //check if emailAddress used by another user
        if(updateBody.userName && updateBody.userName != user.userName){
            const checkUser = await this.getUserByUserName(updateBody.userName);
            if(checkUser){
                if(checkUser._id !== user._id){
                    throw new ApiError(httpStatus.BAD_REQUEST, 'userName already taken');
                }
            }
        }
        //check if emailAddress used by another user
        if(updateBody.emailAddress && updateBody.emailAddress != user.emailAddress){
            const checkUser = await this.getUserByEmail(updateBody.emailAddress);
            if(checkUser){
                if(checkUser._id !== user._id){
                    throw new ApiError(httpStatus.BAD_REQUEST, 'emailAddress already taken');
                }
            }
        }
        //check if accountNumber used by another user
        if(updateBody.accountNumber && updateBody.accountNumber != user.accountNumber){
            const checkUser = await this.getUserByAccountNumber(updateBody.accountNumber);
            if(checkUser){
                if(checkUser._id !== user._id){
                    throw new ApiError(httpStatus.BAD_REQUEST, 'accountNumber already taken');
                }
            }
        }
        //check if identityNumber used by another user
        if(updateBody.identityNumber && updateBody.identityNumber != user.identityNumber){
            const checkUser = await this.getUserByIdentityNumber(updateBody.identityNumber);
            if(checkUser){
                if(checkUser._id !== user._id){
                    throw new ApiError(httpStatus.BAD_REQUEST, 'identityNumber already taken');
                }
            }
        }
        Object.assign(user, updateBody);
        await user.save();
        return user;
    }

    deleteUserById = async (userId) => {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await user.remove();
        return user;
    };
}

module.exports = UserService;