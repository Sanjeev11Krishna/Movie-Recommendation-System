import requests

response = requests.post("http://127.0.0.1:5000/run_pipeline")
print(response.json())
