

# 🐍 Python Examples — Make-It-OSS API

Use the `requests` library to interact with the Make-It-OSS API.

---

## 🔹 POST /scan

Analyze a repository for missing open-source essentials.

```python
import requests

url = "http://localhost:3000/scan"
payload = {"repo_url": "https://github.com/user/repo"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print("Status:", response.status_code)
print("Response:", response.json())
```

### Example Output
```json
{
  "missing": ["LICENSE", "CODE_OF_CONDUCT.md"],
  "suggestions": {
    "LICENSE": "Add a suitable open-source license.",
    "CODE_OF_CONDUCT.md": "Include community behavior guidelines."
  }
}
```

---

## 🔹 Error Example

```python
import requests

url = "http://localhost:3000/scan"
payload = {}  # Missing repo_url
headers = {"Content-Type": "application/json"}

res = requests.post(url, json=payload, headers=headers)
print("Error:", res.status_code, res.json())
```