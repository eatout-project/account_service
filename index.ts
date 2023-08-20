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
const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL ? `${process.env.RESTAURANT_SERVICE_URL}` : 'http://localhost:5000';
console.log('restaurantServiceUrl: ', restaurantServiceUrl);

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.RESTAURANT_LOGIN_DB_HOST ? `${process.env.RESTAURANT_LOGIN_DB_HOST}` : `127.0.0.1`,
        port: process.env.RESTAURANT_LOGIN_DB_PORT ? parseInt(`${process.env.RESTAURANT_LOGIN_DB_PORT}`) : 3306,
        user: process.env.RESTAURANT_LOGIN_DB_USER ? `${process.env.RESTAURANT_LOGIN_DB_USER}` : `root`,
        database: process.env.RESTAURANT_LOGIN_DB ? `${process.env.RESTAURANT_LOGIN_DB}` : 'db'
    }
});

app.post('/', (req: Request, res: Response) => {
    res.json({message: 'Express + TypeScript Server'});
})

app.post("/register",  (req: Request, res: Response) => {handleRegister(req, res, db, bcrypt, restaurantServiceUrl)});

app.post("/login",  (req: Request, res: Response) => {handleLogin(req, res, db, bcrypt, restaurantServiceUrl)});

app.listen(port, () => {
    console.log('⚡️[server]: Server is running');
});
