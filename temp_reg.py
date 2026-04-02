import urllib.request
import json

data = json.dumps({
    "tc_no": "11111111111",
    "password": "test",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "username": "11111111111"
}).encode('utf-8')

req = urllib.request.Request('http://localhost:8000/api/users/register/patient/', data=data, headers={'Content-Type': 'application/json'})

try:
    response = urllib.request.urlopen(req)
    print("Registered:", response.read().decode())
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
