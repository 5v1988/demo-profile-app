import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import scenarios from './routes/profiles.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/profiles", scenarios);

app.listen(PORT, () => {
    console.log(`api is listening on port ${PORT}`);
});