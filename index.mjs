import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';

// expires on 2022-10-13
const cert = fs.readFileSync('private/fullchain.pem');
const key = fs.readFileSync('private/privkey.pem');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => {
    
});

https.createServer({cert, key}, app).listen(444);