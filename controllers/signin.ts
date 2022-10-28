import { Knex } from "knex";
import {Request, Response} from "express";

export const handleSignin = (db: Knex, bcrypt: any) => (req: Request, res: Response) => {
    /*const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('empty fields');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if(isValid){
                return http.get("http://localhost:5000/restaurant", (req, res) => {

                })
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(error => res.status(400).json(error));
            }
        })
        .catch(error => res.status(400).json('Wrong email and password combination'));

     */
}
