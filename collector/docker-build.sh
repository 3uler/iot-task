#!/bin/bash
mvn clean package
docker build --build-arg JAR_FILE=target/collector-0.0.1-SNAPSHOT.jar -t iot-collector-app .