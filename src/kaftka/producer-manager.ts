import { PublishEvent } from "./interfaces";
import { producer } from "./producer";

/**
 * ProducerManager
 *
 * Wraps the Confluent Kafka JS producer and provides a convenient interface
 * for publishing events to Kafka topics.
 *
 * It handles:
 * - Single message publishing
 * - Batch message publishing (optimized by topic)
 * - Connection lifecycle management
 * - Message serialization (JSON)
 * - Flushing pending messages
 *
 * Why a wrapper?
 *
 * The producer from kaftka.ts is a low-level client.
 * This manager adds:
 * - Type safety with generics
 * - Consistent error handling
 * - Batch optimization (group by topic)
 * - Clear semantics for publishing patterns
 *
 * Confluent Kafka JS Note:
 *
 * Unlike KafkaJS, Confluent's kafka-javascript uses librdkafka under the hood,
 * which is more performant and production-ready.
 * It supports async/await patterns for all producer operations.
 */
export class ProducerManager {
  /**
   * Connect to Kafka
   *
   * Establishes the producer connection to the Kafka cluster.
   * Must be called before any publishing operations.
   *
   * This internally:
   * 1. Resolves broker addresses from bootstrap servers
   * 2. Establishes network connections to brokers
   * 3. Initializes the producer buffers
   */
  async connect() {
    await producer.connect();
  }

  /**
   * Disconnect from Kafka
   *
   * Gracefully closes the producer connection.
   * Should be called when shutting down the application.
   *
   * This ensures:
   * 1. All pending messages are flushed
   * 2. Connections are properly closed
   * 3. Resources are cleaned up
   */
  async disconnect() {
    await producer.disconnect();
  }

  /**
   * Publish a single event
   *
   * Sends a single message to the specified Kafka topic.
   *
   * @param topic - The target Kafka topic
   * @param key - Message key (for partitioning and ordering)
   * @param value - Message payload (will be JSON-stringified)
   * @param headers - Optional message headers (metadata)
   *
   * How it works:
   * 1. The message is serialized to JSON
   * 2. Sent to the specified topic
   * 3. Kafka partitions based on the key (if provided)
   * 4. Messages with the same key go to the same partition (ordering guarantee)
   *
   * Key points:
   * - If key is null, the message is sent to a random partition
   * - If key is provided, the message is sent to a consistent partition
   * - This ensures ordering for messages with the same key
   */
  async publish<T>({ topic, key, value, headers }: PublishEvent<T>) {
    await producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          headers,
        },
      ],
    });
  }

  /**
   * Publish multiple events efficiently
   *
   * Sends multiple messages to Kafka in a single batch operation.
   * Messages are grouped by topic for optimized network usage.
   *
   * @param events - Array of events to publish
   *
   * Optimization strategy:
   * 1. Groups events by topic into a Map
   * 2. Sends all messages to the same topic in a single request
   * 3. Reduces network round-trips
   * 4. Improves throughput significantly
   *
   * Example:
   * Events to topics: [A, B, A, C, B, A]
   * Grouped as: { A: [msg1, msg3, msg5], B: [msg2, msg4], C: [msg6] }
   * Sent in one batch request
   *
   * Performance benefit:
   * Without batching: 6 network requests (one per message)
   * With batching: 3 network requests (one per topic)
   *
   * When to use:
   * - Publishing many events at once
   * - High-throughput scenarios
   * - When order within a topic partition is critical
   */
  async publishBatch<T>(events: PublishEvent<T>[]): Promise<void> {
    // Skip if no events provided
    if (events.length === 0) {
      return;
    }

    // Group events by topic for optimized sending
    const topicMap = new Map<string, any[]>();

    for (const event of events) {
      if (!topicMap.has(event.topic)) {
        topicMap.set(event.topic, []);
      }

      topicMap.get(event.topic)!.push({
        key: event.key,
        value: JSON.stringify(event.value),
        headers: event.headers,
      });
    }

    // Send all grouped messages in a single batch operation
    await producer.sendBatch({
      topicMessages: [...topicMap.entries()].map(([topic, messages]) => ({
        topic,
        messages,
      })),
    });
  }

  /**
   * Flush pending messages
   *
   * Forces all buffered messages to be sent immediately to Kafka.
   *
   * Why flush?
   * The producer batches messages in memory for efficiency.
   * Without flushing, messages may not be sent if the process exits.
   *
   * When to call flush():
   * - Before gracefully shutting down the application
   * - When you need guaranteed delivery before proceeding
   * - After publishing critical events
   * - In request-response patterns where you need confirmation
   *
   * Note:
   * In high-throughput scenarios, flush() blocks until all messages are acknowledged.
   * Use this judiciously to avoid performance bottlenecks.
   */
  async flush(): Promise<void> {
    await producer.flush();
  }
}
