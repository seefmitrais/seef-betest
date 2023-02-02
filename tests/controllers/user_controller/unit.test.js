const assert = require("assert");
const UserController = require("../../../src/controllers/user.controller");
const UserService = require("../../../src/services/user.service");
const {response, request} = require('express');
const sinon = require("sinon");
const httpStatus = require("http-status");

describe('UserController', () =>{
    let userService, queryUsersStub, userController, mockRes, mockReq, mockNext, userServiceStub;
    beforeEach(async ()=>{
        mockReq = {
            body: {},
            query: {},
            params: {}
        };
        mockRes = {
            send: sinon.spy(),
            status: sinon.stub()
        }
        mockRes.status.returns(mockRes);
        mockNext = sinon.spy();
        userService = new UserService();
        userServiceStub = sinon.stub(userService);
        userController = new UserController(userServiceStub);
    })
    describe('getUsers', ()=> {
        it('should return multiple user data', async () => {
            mockReq.query = { emailAddress: 'seef@gmail.com' };
            userServiceStub.queryUsers.returns({
                docs: [
                    {
                        "_id": "63da3f6914b52b53b40d0d20",
                        "emailAddress": "seef@gmail.com",
                        "userName": "seef",
                        "accountNumber": "1234567890",
                        "identityNumber": "000000000"
                    }
                ]
            });

            await userController.getUsers(mockReq, mockRes, mockNext);

            sinon.assert.calledWith(userServiceStub.queryUsers, { emailAddress: 'seef@gmail.com' }, {});
            sinon.assert.calledWith(mockRes.send, {
                docs: [
                    {
                        "_id": "63da3f6914b52b53b40d0d20",
                        "emailAddress": "seef@gmail.com",
                        "userName": "seef",
                        "accountNumber": "1234567890",
                        "identityNumber": "000000000"
                    }
                ]
            });
        });
    });
    describe('getUser', () => {
        it('should return a user data', async () => {
            mockReq.params = {
                userId: '63da3f6914b52b53b40d0d20'
            };
            userServiceStub.getUserById.returns({
                    "_id": "63da3f6914b52b53b40d0d20",
                    "emailAddress": "seef@gmail.com",
                    "userName": "seef",
                    "accountNumber": "1234567890",
                    "identityNumber": "000000000"
            });

            await userController.getUser(mockReq, mockRes, mockNext);

            sinon.assert.calledWith(userServiceStub.getUserById, '63da3f6914b52b53b40d0d20');
            sinon.assert.calledWith(mockRes.send, {
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
        });
    });

    // updateUser = async (req, res, next) => {
    //     try {
    //         const user = await this.userService.updateUserById(req.params.userId, req.body);
    //         Promise.resolve(res.send(user));
    //     } catch (error) {
    //         next(error);   
    //     }
    // };

    // deleteUser = async (req, res, next) => {
    //     try {
    //         await this.userService.deleteUserById(req.params.userId);
    //         Promise.resolve(res.status(httpStatus.NO_CONTENT).send());    
    //     } catch (error) {
    //         next(error);
    //     }
    // };
    describe('createUser', () => {
        it('successfully create user', async () => {
            mockReq.body = {
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            }
            userServiceStub.createUser.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            await userController.createUser(mockReq, mockRes, mockNext);
            sinon.assert.calledWith(userServiceStub.createUser, mockReq.body);
            sinon.assert.calledWith(mockRes.status, httpStatus.CREATED);
        });
    });

    describe('updateUser', () => {
        it('should successfully update user data', async () => {
            mockReq = {
                body: {
                    "_id": "63da3f6914b52b53b40d0d20",
                    "emailAddress": "seef@gmail.com",
                    "userName": "seefnew",
                    "accountNumber": "1234567890",
                    "identityNumber": "000000000"
                },
                params: { 
                    userId: '63da3f6914b52b53b40d0d20'
                }
            };
            userServiceStub.updateUserById.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seefnew",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });

            await userController.updateUser(mockReq, mockRes, mockNext);

            sinon.assert.calledWith(userServiceStub.updateUserById, '63da3f6914b52b53b40d0d20', mockReq.body)
            sinon.assert.calledWith(mockRes.send, {
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seefnew",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
        });
    });

    describe('deleteUser', () => {
        it('should successfully delete user', async () => {
            mockReq = {
                params: { userId: '63da3f6914b52b53b40d0d20' }
            };
        
            await userController.deleteUser(mockReq, mockRes, mockNext);
            
            sinon.assert.calledWith(userServiceStub.deleteUserById, '63da3f6914b52b53b40d0d20');
            sinon.assert.calledWith(mockRes.status, httpStatus.NO_CONTENT);
        });
    });
});