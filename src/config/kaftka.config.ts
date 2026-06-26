//Bootstrap servers, client id, etc.
import { KafkaConfig } from "@confluentinc/kafka-javascript/types/kafkajs";
import dotenv from "dotenv";
dotenv.config();
export const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID!,
  brokers: process.env.KAFKA_BROKERS!.split(","),
  topic: process.env.KAFKA_TOPIC!,
};

/**
 * clientId
clientId: process.env.KAFKA_CLIENT_ID!

This uniquely identifies your application when it connects to Kafka.

Example:

movie-service
payment-service
booking-service
notification-service
---------------------------------------------------------------------
* brokers
brokers: process.env.KAFKA_BROKERS!.split(",")

Reads:

localhost:9095,localhost:9096

and converts it into:

[
    "localhost:9095",
    "localhost:9096"
]

These are the bootstrap brokers.

The producer initially connects to one of these brokers to fetch cluster metadata.

------------------------------------------------------------------------------
* topic
topic: process.env.KAFKA_TOPIC!

Stores the default topic name.

Instead of writing:

"order-events"

everywhere in the project, we read it from the configuration.


--------------------------------------------------------------------
Why Use Environment Variables?

Suppose today you're running locally:

localhost:9095
localhost:9096

Tomorrow you deploy to Kubernetes:

broker-0.kafka.svc.cluster.local:9092
broker-1.kafka.svc.cluster.local:9092

You only need to change the .env file.

No TypeScript code changes are required.
 */
