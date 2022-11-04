import dotenv from 'dotenv';
import knex from 'knex';
import * as bcrypt from 'bcrypt';
import {handleRegister} from "./controllers/register";
import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port:3309,
        user: 'root',
        database: 'db'
    }
});


app.post('/', (req: Request, res: Response) => {
    res.json({message: 'Express + TypeScript Server'});
})

app.post("/register",  (req: Request, res: Response) => {handleRegister(req, res, db, bcrypt)});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
