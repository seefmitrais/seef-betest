# seef_betest
## how to run
```sh
docker-compose up -d
```
API is accessable from localhost:3000

mongodb accessable from localhost:27017

## publish to Kafka to create User
```sh
docker exec --interactive --tty seef-betest_kafka_1 kafka-console-producer --bootstrap-server kafka:29092 --topic kafka_seef_betest
```

message example:
```sh
{"emailAddress": "test1@gmails.com","accountNumber": "12345678902","identityNumber": "0000000002","userName":"test2"}
```
