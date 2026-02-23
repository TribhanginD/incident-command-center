import requests
import sys

API_URL = "https://tribh-incident-command-center.hf.space"
USERNAME = "admin"
PASSWORD = "admin"

def trigger_incident():
    # 1. Get Token
    print("Authenticating...")
    auth_res = requests.post(f"{API_URL}/token", data={
        "username": USERNAME,
        "password": PASSWORD
    })
    
    if auth_res.status_code != 200:
        print(f"Auth failed: {auth_res.text}")
        return

    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Trigger Incident
    incident_data = {
        "title": "Kafka Broker Partition Under-Replicated",
        "description": "Critical failure detected in Kafka broker 2. Partition replicas are out of sync.",
        "severity": "P0",
        "status": "active"
    }

    print("Triggering Incident...")
    res = requests.post(f"{API_URL}/incidents/", json=incident_data, headers=headers)
    
    if res.status_code == 200:
        print("Successfully triggered incident! Check your dashboard.")
        print(f"Incident ID: {res.json()['id']}")
    else:
        print(f"Failed to trigger incident: {res.text}")

if __name__ == "__main__":
    trigger_incident()
