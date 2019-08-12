#!/bin/bash
ng build --prod
docker build -t iot-web-client .
