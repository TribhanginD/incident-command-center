import time
import json
import random
import os
from kafka import KafkaProducer
from dotenv import load_dotenv

load_dotenv()

def get_producer():
    # Priority: Env vars for Cloud Kafka
    bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    username = os.getenv("KAFKA_USERNAME")
    password = os.getenv("KAFKA_PASSWORD")
    ca_cert = os.getenv("KAFKA_CA_CERT")
    service_cert = os.getenv("KAFKA_SERVICE_CERT")
    service_key = os.getenv("KAFKA_SERVICE_KEY")

    config = {
        "bootstrap_servers": [bootstrap_servers],
        "value_serializer": lambda v: json.dumps(v).encode('utf-8'),
        "acks": "all",
        "retries": 5
    }

    if service_cert and service_key and ca_cert:
        # Aiven mTLS
        print("Using Aiven mTLS configuration")
        with open("ca.pem", "w") as f: f.write(ca_cert)
        with open("service.cert", "w") as f: f.write(service_cert)
        with open("service.key", "w") as f: f.write(service_key)
        
        config.update({
            "security_protocol": "SSL",
            "ssl_cafile": "ca.pem",
            "ssl_certfile": "service.cert",
            "ssl_keyfile": "service.key",
            "ssl_check_hostname": False
        })
    elif username and password:
        # SASL_SSL (Upstash)
        print("Using SASL_SSL configuration")
        config.update({
            "security_protocol": "SASL_SSL",
            "sasl_mechanism": "SCRAM-SHA-256",
            "sasl_plain_username": username,
            "sasl_plain_password": password
        })
    
    try:
        return KafkaProducer(**config)
    except Exception as e:
        print(f"Failed to initialize Kafka Producer: {e}")
        return None

def run_simulation(duration_seconds=60):
    producer = get_producer()
    if not producer:
        print("Exiting: No producer available")
        return

    print(f"Starting metric simulation for {duration_seconds}s...")
    metrics = ["cpu_usage", "request_latency", "error_rate"]
    
    start_time = time.time()
    try:
        while time.time() - start_time < duration_seconds:
            metric = random.choice(metrics)
            if metric == "request_latency":
                value = random.uniform(80, 250)
            elif metric == "error_rate":
                value = random.uniform(0, 1) if random.random() > 0.95 else random.uniform(0, 0.1)
            else:
                value = random.uniform(20, 70)

            data = {
                "name": metric,
                "value": round(value, 2),
                "timestamp": time.time()
            }
            
            producer.send("system_metrics", data)
            print(f"Sent: {data}")
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("Simulation stopped by user")
    finally:
        producer.close()
        # Clean up certs
        for f in ["ca.pem", "service.cert", "service.key"]:
            if os.path.exists(f):
                os.remove(f)
        print("Simulation finished")

if __name__ == "__main__":
    run_simulation()
