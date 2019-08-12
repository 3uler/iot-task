#!/usr/bin/env python

import pika 
import sys
import os
import json
import numpy as np

averageBatch = np.array([[]])
weightVector = np.array([])
numTimeseries = 5
batchSize = 10
exchangeNamePiped = 'com.datatroniq.iot-task.piped.exchange'
queueNameCollector = 'com.datatroniq.iot-task.collector.queue'
queueNamePipedBase = 'com.datatroniq.iot-task.piped.'
queuePipedSuffix = ['view', 'db']
count = 0
rabbitHost = os.getenv('RABBIT_HOST' ,'localhost')

def main_method():
    global averageBatch
    global weightVector
    global rabbitHost
    averageBatch = np.array([[0.0 for _ in range(batchSize)] for _ in range(numTimeseries)])
    weightVector = initWeightVector(batchSize)
    connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=rabbitHost))
    channel = connection.channel()
    channel.exchange_declare(exchange=exchangeNamePiped,
                         exchange_type='fanout')

    for suffix in queuePipedSuffix:
        queueName = queueNamePipedBase + suffix
        channel.queue_declare(queueName)
        channel.queue_bind(exchange=exchangeNamePiped, queue=queueName, routing_key='piped')

    channel.basic_consume(
        queue=queueNameCollector, on_message_callback=callback, auto_ack=True)

    channel.start_consuming()

def callback(ch, method, properties, body):
    global averageBatch
    global weightVector
    global count
    global batchSize
    timestamp, datapoints = parseJsonData(body)
    np.roll(averageBatch, 1, axis=1)
    for i in range(len(datapoints)):
        averageBatch[i, 0] = datapoints[i]
    if (count < batchSize):
        movingAverages = [None for _ in range(batchSize)]
    else:
        movingAverages = np.dot(averageBatch, weightVector).tolist()
    emitData(dataToJson(timestamp, datapoints, movingAverages))
    count += 1


def emitData(jsonData):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=rabbitHost))
    channel = connection.channel()
    channel.exchange_declare(exchange=exchangeNamePiped, exchange_type='fanout')
    channel.basic_publish(exchange=exchangeNamePiped, routing_key='piped', body=jsonData)
    connection.close()
    
def dataToJson(timestamp, datapoints, movingAvgs):
    data = {
        'timestamp': timestamp,
        'datapoints': datapoints,
        'movingAverages': movingAvgs
    }
    return json.dumps(data)

def initWeightVector(bs):
    normalizationFactor = bs/2. * (bs+1)
    return np.arange(1, bs+1, dtype= float)[::-1] / normalizationFactor


def parseJsonData(jsonString):
    data = json.loads(jsonString)
    timestamp = data['timestamp']
    datapoints = data['datapoints']
    return (timestamp, datapoints)

if __name__ == "__main__":
    if (len(sys.argv) > 1):
        batchSize = int(sys.argv[1])
    
    main_method()