import time
import json
import random
from kafka import KafkaProducer
import os
from dotenv import load_dotenv

load_dotenv()

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")

def get_producer():
    try:
        return KafkaProducer(
            bootstrap_servers=[KAFKA_BROKER],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    except Exception as e:
        print(f"Failed to connect to Kafka: {e}")
        return None

def simulate_metrics():
    producer = get_producer()
    if not producer:
        return

    metrics = ["cpu_usage", "memory_usage", "request_latency", "error_rate"]
    
    while True:
        metric_name = random.choice(metrics)
        if metric_name == "error_rate":
            value = random.uniform(0, 5) if random.random() > 0.9 else random.uniform(0, 0.5)
        elif metric_name == "request_latency":
            value = random.uniform(50, 500)
        else:
            value = random.uniform(10, 90)

        data = {
            "name": metric_name,
            "value": value,
            "timestamp": time.time()
        }
        
        producer.send("system_metrics", data)
        print(f"Produced: {data}")
        time.sleep(1)

if __name__ == "__main__":
    simulate_metrics()
