import {Knex} from "knex";
import {Request, Response} from 'express';
import {RequestInfo, RequestInit} from 'node-fetch';

export interface Registration {
    email: string,
    name: string,
    password: string,
    description: string,
    address: Address
}

export interface Address {
    streetName: string,
    houseNumber: number,
    zipCode: number,
    city: string,
    floor?: number
}

export interface RegistrationDataObject {
    id: number,
    email: string,
    name: string,
    description: string,
    address: Address
}

export interface RestaurantApiObjectResponse {
    email: string;
    name: string;
    description: string;
    address: AddressApiObjectResponse;
    image?: string;
    restaurantId?: number;
    menu?: RestaurantMenuApiObjectResponse;
}

export interface AddressApiObjectResponse {
    restaurantId: number,
    streetName: string,
    houseNumber: number,
    zipCode: number,
    city: string
    floor?: number
}

export interface RestaurantMenuApiObjectResponse {
    id: number;
    categories?: RestaurantMenuCategoryApiObjectResponse[];
}

export interface RestaurantMenuCategoryApiObjectResponse {
    id: number;
    title: string;
    items: RestaurantMenuCategoryItemApiObjectResponse[]
}

export interface RestaurantMenuCategoryItemApiObjectResponse {
    name: string,
    description: string,
    price: number,
    image: string
}

export const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));

export const handleRegister = (req: Request, res: Response, db: Knex, bcrypt: any) => {
    const registration: Registration = req.body;
    if (!registration.email || !registration.name || !registration.password) {
        return res.status(400).json('empty fields');
    }
    if (registration.password.length > 20) {
        return res.status(400).json('password is too long. Maximum is 49 characters');
    }

    db.transaction(trx => {
        trx.select('email').from('login').where('email', registration.email )
            .then(email => {
                if (email.length) {
                    res.status(400).json('Email already exists')
                    return;
                }
                const hash = bcrypt.hashSync(registration.password, 10);

                trx.insert({hash: hash, email: registration.email})
                    .into('login')
                    .then(affectedRows => {
                        trx.select('id').from('login').where('email', registration.email).then(returnedId => {
                            const id: number = returnedId[0];
                            const finalRegistration: RegistrationDataObject = {
                                id,
                                name: registration.name,
                                email: registration.email,
                                description: registration.description,
                                address: registration.address
                            }
                            fetch('http://localhost:5000/createRestaurant', ({
                                method: 'post',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(finalRegistration)
                            })).then((response) => {
                                response.json()
                                    .then(data => {
                                        trx.commit();
                                        return res.status(200).json(data);
                                })
                                    .catch(error => {
                                        console.log(error);
                                        return res.status(400).json('Unable to register');
                                    })
                            })
                        })
                    })
            })
    })
}
