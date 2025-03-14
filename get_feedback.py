import requests

url = "http://localhost:3001/api/feedback/"
access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNzQwNDkyLCJpYXQiOjE3NDE3MzQ2MzcsImp0aSI6IjlmMzUxZGYwNTEwMjQyOWE4NzI0YTU5NDhhMjdkNTE2IiwidXNlcl9pZCI6MX0.Ci0BItkenyI3SigmHh6n3Fnw8mWwu4UVRRkDEu89QjM"  

headers = {
    "Authorization": f"Bearer {access_token}",
}

response = requests.get(url, headers=headers)

print(response.status_code)  
print(response.json()) 