# Make-It-OSS API Guide

## Overview
The Make-It-OSS API analyzes repositories and provides reports about missing open-source essentials.

### Base URL
- Production: `https://api.make-it-oss.architech.dev`
- Local: `http://localhost:3000`

---

## Authentication
Currently, no authentication is required. Future versions may include token-based access.

---

## Endpoints

### **POST /scan**
Analyzes a repository.

**Request Body:**
```json
{
  "repo_url": "https://github.com/user/repo"
}