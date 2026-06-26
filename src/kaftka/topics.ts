import { ITopicConfig } from "@confluentinc/kafka-javascript/types/kafkajs";
import { admin } from "./admin";

/**
 * TopicManager
 *
 * Handles Kafka topic administration using the admin client.
 * It connects to Kafka, checks for existing topics, and creates
 * new topics when needed.
 */
export class TopicManager {
  /**
   * Connect the Kafka admin client.
   */
  async connect() {
    console.log("Connecting Admin Client...");

    await admin.connect();

    console.log("Admin Client Connected");
  }

  /**
   * Disconnect the Kafka admin client.
   */
  async disconnect() {
    console.log("Disconnecting Admin Client...");

    await admin.disconnect();

    console.log("Admin Client Disconnected");
  }

  /**
   * Create a topic if it does not already exist.
   */
  async createTopic(config: ITopicConfig) {
    console.log(`Checking topic '${config.topic}'...`);

    // Get the current topic list from Kafka
    const topics = await admin.listTopics();
    const topicExists = topics.includes(config.topic);

    if (topicExists) {
      console.log(`Topic '${config.topic}' already exists.`);
      return;
    }

    // Create the topic only when it does not exist
    console.log(`Creating topic '${config.topic}'...`);

    const created = await admin.createTopics({
      topics: [config],
    });

    if (created) {
      console.log(`Topic '${config.topic}' created successfully.`);
    } else {
      console.log(
        `Topic '${config.topic}' was not created, it may already exist or the broker returned no topics.`,
      );
    }
  }

  async listTopics() {
    // Fetch metadata for all available topics
    const topics = await admin.fetchTopicMetadata();
    console.log("\nAvailable Topics\n");

    for (const topic of topics) {
      console.log("Topic name:", topic.name);
      console.log("Topic id:", topic.name);
    }
  }

  /**
   * Describe a Topic
   */
  async describeTopic(topicName: string): Promise<void> {
    console.log(`\nFetching metadata for topic '${topicName}'...\n`);

    // Fetch metadata only for the requested topic
    const topics = await admin.fetchTopicMetadata({
      topics: [topicName],
    });

    if (topics.length === 0) {
      console.log(`Topic '${topicName}' not found.`);
      return;
    }

    const topic = topics[0];
    console.log("=================================================");
    console.log(`Topic Name     : ${topic.name}`);
    console.log(`Topic Id       : ${(topic.topicId as any)?.base64}`);
    console.log(`Internal Topic : ${topic.isInternal}`);
    console.log(`Partitions     : ${topic.partitions.length}`);
    console.log("=================================================");

    for (const partition of topic.partitions) {
      console.log(`\nPartition ${partition.partitionId}`);
      console.log("---------------------------------------------");
      console.log(`Leader Broker      : ${partition.leader}`);
      console.log(`Partition Error    : ${partition.partitionErrorCode}`);
      console.log(`Replicas           : ${partition.replicas.join(", ")}`);
      console.log(`ISR                : ${partition.isr.join(", ")}`);

      if (partition.offlineReplicas?.length) {
        console.log(
          `Offline Replicas  : ${partition.offlineReplicas.join(", ")}`,
        );
      }

      if (partition.leaderNode) {
        console.log(
          `Leader Endpoint   : ${partition.leaderNode.host}:${partition.leaderNode.port}`,
        );
      }
    }

    console.log("\n=================================================\n");
  }
}
