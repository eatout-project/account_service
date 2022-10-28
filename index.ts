import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import knex from 'knex';
import * as bcrypt from 'bcrypt';
import {handleSignin} from "./controllers/signin";
import {handleRegister} from "./controllers/register";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(bodyParser.json());
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

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.post("/signin",  handleSignin(db, bcrypt));
app.post("/register",  (req, res) => {handleRegister(req, res, db, bcrypt)});
app.post("/test",  (req, res) => {
    console.log(req.body);
    res.status(200).json('Success');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});


/*import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
//import * as register from './controllers/register';
import * as signin from './controllers/signin';
//import * as profile from './controllers/profile';

dotenv.config();
const app = express();

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port:3309,
        user: 'root',
        database: 'db'
    }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json('Server is up and running');
})

app.post("/signin",  signin.handleSignin(db, bcrypt));

//app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});

//app.get("/profile/:id", profile.handleGet(db));

let port = process.env.PORT;
if (port == null || port == "") {
    port = '5000';
}
app.listen(port);
 */

