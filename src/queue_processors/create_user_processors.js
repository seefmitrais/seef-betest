const assert = require('assert-plus');

class CreateUserProcessor {
    constructor(userService){
        this.userService = userService;
    }
    validateMessage = (message) => {
        assert.object(message);
        assert.string(message.userName);
        assert.string(message.accountNumber);
        assert.string(message.identityNumber);
        assert.string(message.emailAddress);
    }
    processMessage = async (message) => {
        this.validateMessage(message);
        const user = await this.userService.createUser(message);
        console.log('success created user:',user);
    }
}

module.exports = CreateUserProcessor