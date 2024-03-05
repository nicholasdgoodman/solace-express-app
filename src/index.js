import express from 'express';
import solace from './solace.js';

const broker = solace();
const opts = {
  url: 'tcp://localhost',                                // update to match broker settings
  vpnName: 'default',
  userName: 'default',
  password: ''
};

const app = express();
const port = 3000;

// listen to all routes and all methods
app.use(express.json());
app.use((req, res, next) => {
  const topic = req.path.substring(1);                   // treat the URL path as the topic string
  const payload = JSON.stringify(req.body ||req.query);  // if message body present use it (POST)
                                                         // otherwise make a payload from query (GET)
  broker.send(topic, payload, (err) => {
    err ? next(err) : res.send('OK');
  });
})

broker.connect(opts, (err) => {
  if (err) {
    console.log(`Unable to connect to Solace: ${err}`)
    return;
  }

  console.log(`Connected to Solace broker at ${opts.url}`);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
});