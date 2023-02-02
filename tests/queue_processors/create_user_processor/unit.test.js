const { beforeEach } = require("mocha");
const CreateUserProcessor = require("../../../src/queue_processors/create_user_processors");
const sinon = require("sinon");
const UserService = require("../../../src/services/user.service");
const assert = require("assert");

describe('CreateUserProcessor', () => {
    let createUserProcessor, userServiceStub;
    beforeEach(async () => {
        const userService = new UserService();
        userServiceStub =  sinon.stub(userService);
        createUserProcessor = new CreateUserProcessor(userServiceStub);
    });
    describe('validateMessage', () => {
        it('should throw error due invalid message', async () => {
            try {
                createUserProcessor.validateMessage({
                    "userName": "seef",
                    "accountNumber": "1234567890",
                    "identityNumber": "000000000"
                });
            } catch (error) {
                assert.equal(error.code, 'ERR_ASSERTION');
            }
        });
    });
    describe('processMessage', () => {
        it('should create user', async () => {
            await createUserProcessor.processMessage({
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
            sinon.assert.calledWith(userServiceStub.createUser, {
                "emailAddress": "seef@gmail.com",
                "userName": "seef",
                "accountNumber": "1234567890",
                "identityNumber": "000000000"
            });
        });
    });
});