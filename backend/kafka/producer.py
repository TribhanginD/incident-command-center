import time
import json
import random
from kafka import KafkaProducer
import os
from dotenv import load_dotenv

load_dotenv()

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
KAFKA_USERNAME = os.getenv("KAFKA_USERNAME")
KAFKA_PASSWORD = os.getenv("KAFKA_PASSWORD")
KAFKA_CA_CERT = os.getenv("KAFKA_CA_CERT")
KAFKA_SERVICE_CERT = os.getenv("KAFKA_SERVICE_CERT")
KAFKA_SERVICE_KEY = os.getenv("KAFKA_SERVICE_KEY")

def get_producer():
    kafka_config = {
        "bootstrap_servers": [KAFKA_BROKER],
        "value_serializer": lambda v: json.dumps(v).encode('utf-8')
    }
    
    if KAFKA_SERVICE_CERT and KAFKA_SERVICE_KEY and KAFKA_CA_CERT:
        # Aiven mTLS (SSL)
        ca_path = "/tmp/ca.pem"
        cert_path = "/tmp/service.cert"
        key_path = "/tmp/service.key"
        
        with open(ca_path, "w") as f: f.write(KAFKA_CA_CERT)
        with open(cert_path, "w") as f: f.write(KAFKA_SERVICE_CERT)
        with open(key_path, "w") as f: f.write(KAFKA_SERVICE_KEY)
        
        kafka_config.update({
            "security_protocol": "SSL",
            "ssl_cafile": ca_path,
            "ssl_certfile": cert_path,
            "ssl_keyfile": key_path
        })
    elif KAFKA_USERNAME and KAFKA_PASSWORD:
        # Upstash / Confluent SASL_SSL
        kafka_config.update({
            "security_protocol": "SASL_SSL",
            "sasl_mechanism": "SCRAM-SHA-256",
            "sasl_plain_username": KAFKA_USERNAME,
            "sasl_plain_password": KAFKA_PASSWORD
        })
        
        if KAFKA_CA_CERT:
            ca_path = "/tmp/ca.pem"
            with open(ca_path, "w") as f: f.write(KAFKA_CA_CERT)
            kafka_config["ssl_cafile"] = ca_path
        
    try:
        return KafkaProducer(**kafka_config)
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
