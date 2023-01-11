import dotenv from 'dotenv';
import knex from 'knex';
import * as bcrypt from 'bcrypt';
import {handleRegister} from "./controllers/register";
import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import {handleLogin} from "./controllers/login";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.CUSTOMER_LOGIN_DB_HOST ? `${process.env.CUSTOMER_LOGIN_DB_HOST}` : `127.0.0.1`,
        port: process.env.CUSTOMER_LOGIN_DB_PORT ? parseInt(`${process.env.CUSTOMER_LOGIN_DB_PORT}`) : 3309,
        user: process.env.CUSTOMER_LOGIN_DB_USER ? `${process.env.CUSTOMER_LOGIN_DB_USER}` : `root`,
        database: process.env.CUSTOMER_LOGIN_DB ? `${process.env.CUSTOMER_LOGIN_DB}` : 'db'
    }
});


app.post('/', (req: Request, res: Response) => {
    res.json({message: 'Express + TypeScript Server'});
})

app.post("/register",  (req: Request, res: Response) => {handleRegister(req, res, db, bcrypt)});

app.post("/login",  (req: Request, res: Response) => {handleLogin(req, res, db, bcrypt)});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
