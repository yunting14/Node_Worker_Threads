import express from "express";
import config from "./config";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Waiting for notifications');
});

app.post('/:userId', (req, res) => {
    console.log('Received notification with:', req.body.result);
    res.status(200).end();
});

app.listen(config.userPort);
console.log(`Test server started on http://localhost:${config.userPort}`); 