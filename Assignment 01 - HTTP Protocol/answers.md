# Assignment 01 - HTTP Protocol
Student: Favé Xavier

## Task 1: First GET Request
* A. The server returned data in JSON format.
* B. The resource ID is in the URL path (`/posts/1`) and also inside the body as `"id": 1`.
* C. No, by default curl only shows the body of the response, not the status code.

---

## Task 2 & 3: Response Headers
* D. 200 means "OK", it shows the request worked.
* E. It's in the 2xx Success category.
* F. I know 201 for created, 404 for not found, and 500 for server errors.
* G. If it was text/html, the browser or client would try to read it as a webpage instead of raw data.
* H. Yes, content-length represents the size of the body in bytes.
* I. Connection is important because "keep-alive" lets you reuse the same connection for more requests, which is better for high traffic.

---

## Task 4: Simulating Errors
* J. I got a 404 status code : NOT FOUND .
* K. There is a body but it's just an empty object `{}`.
* L. The difference is the status code shows a failure and the body doesn't have the post data.

---

## Task 5: POST request
* M. The server returned a 201 code.
* N. 201 means "Created", so the new post was successfully added.
* O. I see headers like Content-Type, Content-Length, and Date.

---

## Task 6: Custom Headers
* P. No, this test API doesn't actually check the token, it just accepts it.
* Q. A real API would return 401 Unauthorized.
* R. 401 is when you aren't logged in (authentication), 403 is when you are logged in but don't have permission (authorization).

---

## Task 7: Headers Only
* S. This is useful to check if a file changed or exists without downloading the whole thing.
* T. Monitoring systems use this to do health checks quickly without using much bandwidth.

---

## Part 8: Status Code Table

| Code | Category | Meaning |
|---|---|---|
| 200 | Success | OK. Request worked. |
| 201 | Success | Created. New resource made. |
| 400 | Client Error | Bad Request. Something is wrong with the request. |
| 401 | Client Error | Unauthorized. Need to log in. |
| 403 | Client Error | Forbidden. No permission. |
| 404 | Client Error | Not Found. Resource doesn't exist. |
| 500 | Server Error | Internal Server Error. Server crashed or had a problem. |

---

## Part 9: Discussion
* V. It's bad practice because it breaks the HTTP standard. If everything is 200, the client has to look inside the body to find errors, which makes coding and debugging much harder.