import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import download, { getLibrary } from './youtube.mjs';

// expires on 2022-10-13
const cert = fs.readFileSync('private/fullchain.pem');
const key = fs.readFileSync('private/privkey.pem');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => {
    res.json(getLibrary());
});

app.post('/', async (req, res) => {
    await download(req, res);
});

app.delete('/', (req, res) => {
    // todo later 
});

https.createServer({cert, key}, app).listen(432);