import requests

# Test POST with movie title
response = requests.post("http://127.0.0.1:5000/recommend", json={"movie": "Toy Story (1995)"})
print("POST /recommend with movie 'Toy Story':")
print(response.json())

# Test GET with user_id and top_n
response = requests.get("http://127.0.0.1:5000/recommend", params={"user_id": 1, "top_n": 5})
print("\nGET /recommend with user_id=1 and top_n=10:")
print(response.json())
