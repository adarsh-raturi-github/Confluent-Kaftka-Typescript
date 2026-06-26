# Kafka KRaft Cluster Architecture

This document describes the Docker Compose deployment for a Kafka KRaft cluster consisting of two controller nodes and two broker nodes. It includes a visual illustration and a Mermaid diagram for GitHub rendering.

## Architecture Overview

- `controller1` and `controller2` are KRaft controller nodes responsible for cluster metadata and quorum management.
- `broker1` and `broker2` are broker nodes that handle producer and consumer traffic.
- All nodes share a common `CLUSTER_ID`, ensuring they are part of the same KRaft cluster.

## Cluster Illustration

![Kafka KRaft Cluster Diagram](./kafka-architecture.svg)

## Mermaid Diagram

```mermaid
%%{init: {'theme':'base','themeVariables': {'primaryColor':'#1f2937','secondaryColor':'#0f172a','tertiaryColor':'#38bdf8','lineColor':'#60a5fa','textColor':'#f8fafc','clusterBkg':'#0f172a','clusterBorder':'#2563eb'}}}%%
flowchart LR
  subgraph Controllers["Controllers"]
    direction TB
    C1["controller1<br/>9093"]
    C2["controller2<br/>9094"]
  end

  subgraph Brokers["Brokers"]
    direction TB
    B1["broker1<br/>9095"]
    B2["broker2<br/>9096"]
  end

  C1 <--> C2
  C1 -->|Controller quorum| B1
  C1 -->|Controller quorum| B2
  C2 -->|Controller quorum| B1
  C2 -->|Controller quorum| B2

  classDef controller fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#111827;
  classDef broker fill:#22c55e,stroke:#166534,stroke-width:2px,color:#111827;
  class C1,C2 controller;
  class B1,B2 broker;
```

## Deployment Notes

- Both controller nodes are configured in the same controller quorum using `KAFKA_CONTROLLER_QUORUM_VOTERS`.
- Broker nodes advertise `localhost` ports to allow local producer/consumer access.
- The broker configuration sets `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=2`, which provides redundancy for consumer offset storage.
- Listener security is configured using `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,BROKER:PLAINTEXT` for plaintext communication.
- Persistent local log directories are mounted under `/tmp` for each node.

## Summary

This setup demonstrates a minimal KRaft-based Kafka cluster suitable for local development and interview demonstration purposes. It highlights the separation of controller and broker roles while preserving cluster metadata and replication behavior.
