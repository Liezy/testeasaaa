import requests

url = "http://127.0.0.1:8000/api/releases/sync/"
headers = {
    "Authorization": "Token d82e30e4f7755b885f218d5753b5b3b34217e3b5",
    "Content-Type": "application/json"
}
data = {
    "tag": "v2.0.0",
    "name": "Primeira release",
    "body": "### Added\n- Teste de changelog",
    "published_at": "2026-02-01T12:00:00Z"
}

response = requests.post(url, json=data, headers=headers)
print("Status:", response.status_code)
print("Resposta:", response.text)