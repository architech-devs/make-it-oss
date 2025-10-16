---

The API follows standard HTTP status codes and returns clear JSON responses for all errors.

---

## 🔹 Common Error Codes

| Code | Type | Description |
|------|------|-------------|
| 400 | Bad Request | The request body or parameters are invalid. |
| 401 | Unauthorized | Missing or invalid authentication (if required). |
| 403 | Forbidden | Insufficient permission to access resource. |
| 404 | Not Found | The requested endpoint or resource does not exist. |
| 429 | Too Many Requests | Rate limit exceeded. |
| 500 | Internal Server Error | Unexpected server-side error. |

---

## 🔹 Error Response Format

All errors return a consistent JSON structure:

```json
{
  "error": "ErrorType",
  "message": "Detailed error description"
}
### Example: Bad Request
```json
{
  "error": "BadRequest",
  "message": "repo_url is required"
}