 ---

##  `docs/examples/js_samples.md`

```md
#  JavaScript Examples — Make-It-OSS API

These samples demonstrate how to interact with the Make-It-OSS API using JavaScript (Node.js Fetch API).

---

##  POST /scan

```js
import fetch from "node-fetch";

async function analyzeRepo() {
  const response = await fetch("http://localhost:3000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repo_url: "https://github.com/user/repo"
    })
  });

  const data = await response.json();
  console.log("Response:", data);
}

analyzeRepo();
### Example Output
```json

{
  "missing": ["README", "CONTRIBUTING.md"],
  "suggestions": {
    "README": "Add setup and usage instructions.",
    "CONTRIBUTING.md": "Explain how to contribute to the project."
  }
}
```
##  Error Example
import fetch from "node-fetch";

async function invalidRequest() {
  const res = await fetch("http://localhost:3000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  const data = await res.json();
  console.error("Error:", data);
}

invalidRequest();

---

## 💻 `docs/examples/go_samples.md`

```md
# 💻 Go Examples — Make-It-OSS API

Use the Go `net/http` and `encoding/json` packages to interact with the Make-It-OSS API.

---

## 🔹 POST /scan

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	url := "http://localhost:3000/scan"
	payload := map[string]string{"repo_url": "https://github.com/user/repo"}

	body, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	responseBody, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Status:", resp.Status)
	fmt.Println("Response:", string(responseBody))
}