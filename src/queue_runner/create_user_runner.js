require('dotenv').config()
const initialize = require("../init");
const assert = require('assert-plus');
const CreateUserProcessor = require('../queue_processors/create_user_processors');
const QUEUE_NAME = 'create_user_runner';
const TOPIC_NAME = 'kafka_seef_betest';

(async () => {
    try {
        const {
            kafkaClient, 
            userService 
        } = await initialize();
        const createUserProcessor = new CreateUserProcessor(userService);
        const consumer = kafkaClient.consumer({ groupId: `${process.env.APP_NAME}-${QUEUE_NAME}` });
        await consumer.connect();
        await consumer.subscribe({ topic: TOPIC_NAME })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const messageData = JSON.parse(message.value.toString());
                    await createUserProcessor.processMessage(messageData);
                } catch (error) {
                    console.log('consumer error',error,topic, partition, message);
                }
            },
        })
    } catch (error) {
        console.log(error);   
    }
})();




