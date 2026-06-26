# Kaftka Configuration Flow

This document explains the startup flow for the Kaftka project.

## Flow Overview

1. `.env` values are loaded in `src/config/kaftka.config.ts`
2. `src/kaftka/kaftka.ts` creates the main Kafka client using that config
3. `src/kaftka/admin.ts` creates the Kafka Admin client from the Kafka client
4. `src/kaftka/topics.ts` is the topic manager that uses `admin` to create and describe topics
5. `src/kaftka/producer.ts` creates the producer client
6. `src/kaftka/producer-manager.ts` wraps `producer.ts` and exposes publish/flush functions

## Mermaid Diagram

```mermaid
flowchart TD
  A[.env values] --> B[kaftka.config.ts<br/>loads env]
  B --> C[kaftka.ts<br/>create Kafka client]
  C --> D[admin.ts<br/>create Admin client]
  D --> E[topics.ts<br/>TopicManager uses Admin]
  C --> F[producer.ts<br/>create Producer client]
  F --> G[producer-manager.ts<br/>ProducerManager wrapper]

  classDef config fill:#f9f,stroke:#333,stroke-width:1px;
  classDef client fill:#9cf,stroke:#333,stroke-width:1px;
  classDef admin fill:#cfc,stroke:#333,stroke-width:1px;
  classDef topic fill:#ffc,stroke:#333,stroke-width:1px;
  classDef producer fill:#fc9,stroke:#333,stroke-width:1px;

  class B config;
  class C client;
  class D admin;
  class E topic;
  class F producer;
  class G producer;
```
