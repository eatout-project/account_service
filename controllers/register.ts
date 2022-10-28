import {Knex} from "knex";
import {Request, Response} from "express";
import { RequestInfo, RequestInit } from 'node-fetch';

export interface Registration {
    email: string,
    name: string,
    password: string,
    address: Address
}

export interface Address {
    streetName: string,
    streetNumber: number,
    zipCode: number,
    city: string,
    floor?: number
}

export interface RegistrationDataObject {
    id: number,
    email: string,
    name: string,
    address: Address
}

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export const handleRegister = (req: Request, res: Response, db: Knex, bcrypt: any) => {
    console.log(req.body);
    const registration: Registration = req.body;
    if (!registration.email || !registration.name || !registration.password) {
        return res.status(400).json('empty fields');
    }
    if (registration.password.length > 20) {
        res.status(400).json('password is too long. Maximum is 49 characters');
    }

    db.transaction(trx => {
        trx.select('email').from('login')
            .then(email => {
                if (email.length) {
                    res.status(400).json('Email already exists')
                    return;
                }
                const hash = bcrypt.hashSync(registration.password, 10);

                return trx.insert({hash: hash, email: registration.email})
                    .into('login')
                    .then(affectedRows => {
                        return trx.select('id').from('login').where('email', registration.email).then(returnedId => {
                            const id: number = returnedId[0];
                            const finalRegistration: RegistrationDataObject = {
                                id,
                                name: registration.name,
                                email: registration.email,
                                address: registration.address
                            }
                            fetch('http://localhost:5000', ({
                                method: 'post',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(finalRegistration)
                            })).then(response => {
                                console.log(response);
                                return res.status(200).json('Success!')
                            }).catch(error => {
                                console.log(error);
                                return res.status(400).json('Unable to register')
                            })
                        })
                    })
            }).then(trx.commit)
            .catch(error => {
                console.log(error);
                trx.rollback;
            })
    })
}
