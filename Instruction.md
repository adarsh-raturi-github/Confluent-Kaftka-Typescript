# Kafka Docker Setup and JavaScript Client

## Overview

This document describes the recommended local development setup for running Apache Kafka in Docker and installing the Confluent JavaScript client. The configuration uses the `apache/kafka:4.3.0` Docker image and a dedicated controller/broker topology.

## Prerequisites

- Docker and Docker Compose (v2+)
- Node.js and npm

## JavaScript client

Initialize the project and install Confluent's JavaScript client:

```bash
npm init -y
npm install @confluentinc/kafka-javascript
```

`@confluentinc/kafka-javascript` is Confluent's official JavaScript client for Apache Kafka and the Confluent Platform.

## Docker image selection

This setup uses the `apache/kafka:4.3.0` image for the following reasons:

- The `bitnami/kafka:latest` image is no longer available for free through Docker Hub.
- The `confluentinc/confluent-local:8.0.0` image does not support running dedicated controllers and brokers separately (it requires combined controller/broker roles), whereas our architecture requires dedicated controller instances.

## Architecture

The target topology for this project is:

- 2 dedicated controllers
- 2 dedicated brokers

This topology helps emulate a production-like environment with separate controller and broker responsibilities.

## Files to create

- `docker-compose.yml` — Docker Compose configuration for the controller and broker services.

## Commands

Start the environment:

```bash
docker compose up -d
```

Stop and remove the environment:

```bash
docker compose down
```

## Steps

1. Create `docker-compose.yml` with the desired controller and broker services.
2. Verify prerequisites (Docker, Node.js, npm) are installed.
3. Start the Kafka environment with `docker compose up -d`.
4. Install the JavaScript client (see section above) and proceed with development.

## Notes

- Use `docker compose logs -f` to follow service logs during startup and troubleshooting.
- Adjust resource limits and network configuration in `docker-compose.yml` as needed for your machine.
