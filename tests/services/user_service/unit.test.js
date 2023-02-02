const { default: mongoose } = require("mongoose");
const User = require("../../../src/models/user.model");
const UserService = require("../../../src/services/user.service");
const assert = require("assert");
const sinon = require("sinon");
const httpStatus = require("http-status");
const { afterEach } = require("mocha");

describe('UserService', () => {
    let userModelStub, userService;
    beforeEach(async()=>{
        userModelStub = sinon.stub();
        userModelStub.paginate = sinon.stub();
        userModelStub.findById = sinon.stub();
        userModelStub.findOne = sinon.stub();
        userModelStub.create = sinon.stub();
        userModelStub.save = sinon.stub();
        userService = new UserService(userModelStub);
    });

    afterEach(()=>{
        sinon.restore();
    })

    describe('queryUsers', () => {
        it('should return multiple user data', async () => {
            userModelStub.paginate.returns({
                "docs": [
                    {
                        "_id": "63da3f6914b52b53b40d0d20",
                        "emailAddress": "seef@gmail.com",
                        "userName": "seef",
                        "accountNumber": "1234567890",
                        "identityNumber": "000000000"
                    }
                ],
                "total": 1,
                "limit": 10,
                "offset": 0,
                "page": 1,
                "pages": 1
            });

            const res = await userService.queryUsers({emailAddress: "seef@gmail.com"}, {});
            
            sinon.assert.calledWith(userModelStub.paginate, {emailAddress: "seef@gmail.com"}, {});
            assert.equal(res.docs[0].emailAddress, "seef@gmail.com")
        });
    })

    describe('getUserById', () => {
        it('should return a user data', async () => {
            userModelStub.findById.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            
            const res =  await userService.getUserById('63da3f6914b52b53b40d0d20');

            assert.equal(res.emailAddress, "seef@gmail.com");
            sinon.assert.calledWith(userModelStub.findById, "63da3f6914b52b53b40d0d20");
        });
    });

    describe('getUserByEmail', () => {
        it('should return user data', async () => {
            userModelStub.findOne.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            
            const res =  await userService.getUserByEmail('seef@gmail.com');

            assert.equal(res.emailAddress, 'seef@gmail.com');
            sinon.assert.calledWith(userModelStub.findOne, { emailAddress: 'seef@gmail.com' });
        });
    });

    describe('createUser', () => {
        it('should create user', async () => {
            userModelStub.findOne.returns(undefined);
            userModelStub.create.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            
            const res =  await userService.createUser({
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });

            assert.equal(res.emailAddress, 'seef@gmail.com');
            sinon.assert.calledWith(userModelStub.create, {
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
        });
        it('should throw error due to email already used', async () => {
            userModelStub.findOne.returns({
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            
            try {
                const res =  await userService.createUser({
                    "emailAddress": "seef@gmail.com",
                    "userName": "seef",
                    "accountNumber": "1234567890",
                    "identityNumber": "000000000"
                });  
            } catch (error) {
                assert.equal(error.statusCode, httpStatus.BAD_REQUEST)
            }
        });
    });

    describe('updateUserById', () => {
        beforeEach(()=>{
            userService.getUserById = sinon.stub();
            userService.getUserByEmail = sinon.stub();
            userService.getUserByUserName = sinon.stub();
            userService.getUserByIdentityNumber = sinon.stub();
            userService.getUserByAccountNumber = sinon.stub();
        });
        it('should update user successfully', async () =>{
            const mockUserId = "63da3f6914b52b53b40d0d20";
            const mockReqBody = {
                "emailAddress": "newchangedemail@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            }
            const mockUser = {
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            };

            mockUser.save = sinon.stub();
            userService.getUserById.returns(mockUser);
            userService.getUserByEmail.returns(null);

            const result = await userService.updateUserById(mockUserId, mockReqBody);

            sinon.assert.calledOnce(mockUser.save);
            assert.equal(result.emailAddress, mockReqBody.emailAddress);
        });
    });

    describe('deleteUserById', () => {
        it('should delete user successfully', async () => {
            const mockUser = {
                "_id": "63da3f6914b52b53b40d0d20",
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            }
            mockUser.remove = sinon.stub();

            userModelStub.findById.returns(mockUser);

            const res =  await userService.deleteUserById('63da3f6914b52b53b40d0d20');
            
            assert.equal(res.emailAddress, "seef@gmail.com");
            sinon.assert.calledWith(userModelStub.findById, '63da3f6914b52b53b40d0d20');
            sinon.assert.calledOnce(mockUser.remove);
        }); 
    });
})