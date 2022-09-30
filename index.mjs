import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import { getLibrary } from "./library/index.mjs";

// expires on 2022-10-13
const cert = fs.readFileSync('private/fullchain.pem');
const key = fs.readFileSync('private/privkey.pem');

const app = express();
app.use('/library', express.static('library'));
app.use(cors());

app.get('/', async (req, res) => {
    res.json({ movies: await getLibrary("movies"), shows: await getLibrary("shows")});
});

https.createServer({cert, key}, app).listen(444);