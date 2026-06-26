/**
 * Kafka Admin Client
 *
 * This file creates and exports the Kafka Admin Client.
 *
 * Just like `kafka.ts` only creates the Kafka client,
 * this file only creates the Admin client without connecting.
 *
 * The Admin Client is responsible for:
 * - Creating topics
 * - Deleting topics
 * - Listing topics
 * - Describing topics (configuration, partitions, replicas)
 * - Altering topic configurations
 * - Managing partitions and replication
 *
 * Why Separate from Regular Client?
 *
 * The Admin API is a privileged interface with special permissions.
 * By separating it:
 * - We don't expose admin capabilities to all components
 * - Only the admin module has permission to modify topics
 * - Better separation of concerns
 * - Clearer code intent (admin operations are explicit)
 *
 * Important: The Admin Client does NOT connect until you call:
 * admin.connect()
 *
 * Think of it like:
 * const admin = new DatabaseAdmin();
 * The connection hasn't been established yet.
 *
 * The actual connection happens when you call admin.connect(),
 * usually in an initialization or setup function.
 *
 * Example Usage:
 *
 * import { admin } from './kaftka/admin';
 *
 * // Connect to Kafka
 * await admin.connect();
 *
 * // Create a topic
 * await admin.createTopics({
 *   topics: [
 *     {
 *       name: 'order-events',
 *       numPartitions: 3,
 *       replicationFactor: 1,
 *     }
 *   ]
 * });
 *
 * // Disconnect when done
 * await admin.disconnect();
 */

import { kaftka } from "./kaftka";

/**
 * Admin Client Instance
 *
 * Derived from the main Kafka client instance, this admin client
 * inherits the same broker configuration and connection settings.
 *
 * Configuration inherited from kaftka:
 * - bootstrap.servers: The Kafka brokers to connect to
 * - client.id: Used with an "-admin" suffix for identification
 *
 * Example broker identification:
 * If client.id is "order-service", the admin client appears as:
 * "order-service-admin"
 *
 * This helps with:
 * - Monitoring which service performed admin operations
 * - Auditing topic creation and modification
 * - Debugging admin-related issues
 */
export const admin = kaftka.admin();
