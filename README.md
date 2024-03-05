# Solace Express App

A super-simple demonstration of an Express app that forwards requests to a Solace broker.

Requests are sent a guaranteed messages on a topic as specified in the URL. If a message body is supplied it is used as the message payload, otherwise, a payload will be constructed from the request query parameters.

### How to Run

Update the connection settings as necessary in `index.js`. 

```
npm install
npm run start
```

This will start a Node process listening on port 3000 by default.

### Simple Test

Use the broker Try Me tab and subscribe to topic `test-topic/>`.

Open a new tab, and navigate to: `http://localhost:3000/test-topic/data-topic?greeting=Hello&audience=World`

The broker will then show a message was received on topic `test-topic/data-topic` with a payload:
```
{"greeting":"Hello","audience":"World"}
```