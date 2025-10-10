# 🧰 cURL Examples — Make-It-OSS API

These examples demonstrate how to use the Make-It-OSS API with simple cURL commands.

---

## 🔹 POST /scan

Analyzes a GitHub repository and returns missing open-source essentials.

### Example
```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/user/repo"
  }'
```

### Example Output
```json
{
  "missing": ["LICENSE", "README"],
  "suggestions": {
    "LICENSE": "Add an MIT License",
    "README": "Include installation steps"
  }
}
```

---

## 🔹 Error Example
```bash
curl -X POST http://localhost:3000/scan \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "error": "BadRequest",
  "message": "repo_url is required"
}
```
