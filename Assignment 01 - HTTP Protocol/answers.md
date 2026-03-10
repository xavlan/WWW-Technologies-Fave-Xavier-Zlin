# Lab Report: Understanding HTTP Protocol with curl

**Student:** Favé Xavier 
**Topic:** HTTP Status Codes & Response Headers  
**Tools used:** `curl`, JSONPlaceholder API

---

## 🌐 Objectives
- Send HTTP requests using `curl`.
- Interpret HTTP status codes and analyze response headers.
- Understand the difference between request and response.
- Identify common error responses (400, 404, 500).

---

## 🧪 Task 1: Your First GET Request
* **A. What type of content did the server return?** The server returned JSON data.
* **B. Where do you see the resource ID?** The resource ID is visible in the URL path (`/posts/1`) and as the `"id": 1` field within the JSON body.
* **C. Can you see the HTTP status code?** No, by default `curl` only displays the response body.

---

## 📄 Task 2 & 3: Analyzing Response Headers
* **D. What does 200 mean?** It means "OK," indicating the request was successful.
* **E. What category of status code is it?** It is a **2xx** (Success) category code.
* **F. What other codes do you know?** Examples include **201** (Created), **404** (Not Found), and **500** (Internal Server Error).
* **G. What would happen if Content-Type were `text/html` instead?** A client (like a browser) would attempt to render the JSON string as HTML text rather than treating it as structured data.
* **H. Does the content-length match the actual size of the body?** Yes, the `Content-Length` header indicates the size of the response body in bytes.
* **I. Why is Connection important in high-traffic systems?** Headers like `keep-alive` allow the reuse of TCP connections, which reduces latency and saves server resources.

---

## ⚠️ Task 4: Simulating HTTP Errors
* **J. What status code did you receive?** I received a **404** status code.
* **K. Is there a response body?** Yes, though in this case, it was an empty JSON object `{}`.
* **L. How does it differ from the successful case?** The status code indicates a failure to find the resource, and the body does not contain the expected data.

---

## 📤 Task 5 & 6: POST Requests & Custom Headers
* **M. What status code did the server return?** The server returned **201**.
* **N. What does it mean?** It means "Created," which confirms that a new resource was successfully generated on the server.
* **O. What headers appear in this response?** Headers such as `Content-Type`, `Content-Length`, `Date`, and `Location` typically appear.
* **P. Does this API actually validate the token?** No, JSONPlaceholder is a mock API and does not perform real authentication.
* **Q. What status code would a real secure API return if the token were invalid?** It would return a **401 Unauthorized**.
* **R. What is the difference between `401` and `403`?** **401** means the user is not authenticated (unidentified), while **403** means the user is authenticated but lacks permission for that resource.

---

## 🔍 Task 7: Headers Only (Head Request)
* **S. When would this be useful?** It is useful for checking if a resource exists or has been modified without downloading the full content.
* **T. Why might monitoring systems use this approach?** Monitoring tools use it for "Health Checks" to confirm the server is responding while minimizing bandwidth usage.

---

## 📊 Status Code Classification

| Code | Category | Meaning |
| :--- | :--- | :--- |
| **200** | Success | **OK.** The action requested was accepted and completed. |
| **201** | Success | **Created.** A new resource has been successfully created. |
| **400** | Client Error | **Bad Request.** The server cannot process the request due to a client error. |
| **401** | Client Error | **Unauthorized.** Authentication is required or has failed. |
| **403** | Client Error | **Forbidden.** The server understands the request but refuses to authorize it. |
| **404** | Client Error | **Not Found.** The server cannot find the requested resource. |
| **500** | Server Error | **Internal Server Error.** An unexpected error occurred on the server side. |

---

## 💡 Discussion
* **V. Why is it bad practice to always return `200`, even on errors?** It violates HTTP standards and prevents automated systems (browsers, proxies, monitoring tools) from detecting errors properly. It forces developers to parse the response body to determine if a request actually succeeded.