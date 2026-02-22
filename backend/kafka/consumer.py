import json
from kafka import KafkaConsumer
import os
from dotenv import load_dotenv
import redis
import asyncio
from ws.metrics_ws import manager

load_dotenv()

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# Sync redis for initial implementation
r = redis.from_url(REDIS_URL)

async def consume_metrics():
    consumer = None
    while not consumer:
        try:
            consumer = KafkaConsumer(
                "system_metrics",
                bootstrap_servers=[KAFKA_BROKER],
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest'
            )
        except Exception as e:
            print(f"Waiting for Kafka... {e}")
            await asyncio.sleep(5)

    print("Started consuming metrics...")
    for message in consumer:
        data = message.value
        # 1. Update Redis cache for latest values
        r.set(f"latest_metric:{data['name']}", data['value'])
        
        # 2. Broadcast via WebSocket
        await manager.broadcast(json.dumps(data))
        
        # Note: Historical persistence to DB could happen here in batches
        # for simplicity in this version, we stick to WebSocket + Redis

if __name__ == "__main__":
    asyncio.run(consume_metrics())
