// Application entry point

import { ITopicConfig } from "@confluentinc/kafka-javascript/types/kafkajs";
import { TopicManager } from "./kaftka/topics";

const manager = new TopicManager();
manager.connect();

const topic: ITopicConfig = {
  topic: "order-events",

  // If omitted, controller defaults are used
  numPartitions: 4,
  replicationFactor: 2,

  // If omitted, broker defaults are used
  configEntries: [
    {
      name: "retention.ms",
      value: "604800000", // logs retetention for 7 days
    },
    {
      name: "cleanup.policy",
      value: "delete",
    },
    {
      name: "min.insync.replicas",
      value: "2", // minimumn ISR
    },
    {
      name: "segment.bytes",
      value: "1073741824", // max segement size
    },
  ],
};
manager.createTopic(topic);

manager.listTopics();

manager.describeTopic(topic.topic);
