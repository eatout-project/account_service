import {Request, Response} from "express";
import {Knex} from "knex";
import {fetch} from "../utilities/dynamic-fetch";

export const handleLogin = (req: Request, res: Response, db: Knex, bcrypt: any) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json('empty fields');
    }

    db.select('*').from('login').where('email', email)
        .then(loginData => {
            const isValid = bcrypt.compareSync(password, loginData[0].hash);
            if (isValid) {
                const emailObject = {
                    email: email
                };
                fetch('http://localhost:5000/getRestaurant', ({
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(emailObject)
                })).then(response => {
                    response.json()
                        .then(data => {
                            return res.status(200).json(data);
                        })
                        .catch(error => {
                            return res.status(400).json(false);
                        })
                })
            } else {
                return res.status(400).json('Invalid password');
            }
        })
        .catch(error => {
            res.status(400).json('Account with following email does not exists')
        })
}
