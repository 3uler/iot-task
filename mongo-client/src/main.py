import pika
from pymongo import MongoClient
import json
import os

rabbitHost = os.getenv('RABBIT_HOST' ,'localhost')
mongoHost = os.getenv('MONGO_HOST' ,'localhost')
mongoPort = os.getenv('MONGO_PORT' ,'27017')
mongoUser = os.getenv('MONGO_USER', 'root')
mongoPw = os.getenv('MONGO_PW', 'example')
mongoConnectionString = 'mongodb://' + mongoUser + ':' + mongoPw + '@' + mongoHost + ':' + mongoPort
client = MongoClient(mongoConnectionString)
db=client.telemetrydata

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=rabbitHost))
channel = connection.channel()

exchangeName = 'com.datatroniq.iot-task.piped.exchange'
queueName = 'com.datatroniq.iot-task.piped.db'

print(' [*] Writing Data to MongoDB. To exit press CTRL+C')

def callback(ch, method, properties, body):
    data = json.loads(body)
    db.reviews.insert_one(data)

channel.basic_consume(
    queue=queueName, on_message_callback=callback, auto_ack=True)

channel.start_consuming()