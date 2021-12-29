import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import jwt from 'jsonwebtoken';

import { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import { LoginRequest } from '../../types/LoginRequest';
import { LoginResponse } from '../../types/LoginResponse';
import { UserModel } from '../../models/UserModel';
import { connectDb } from '../../middlewares/connectDb';


const loginEndpoint = async(req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg | LoginResponse>) => {

    const {MY_SECRET_KEY} = process.env;

    if(!MY_SECRET_KEY){
        return res.status(500).json({ error : "Chave JWT não informada no ENV"});
    }

    if(req.method === 'POST'){
        const body = req.body as LoginRequest;

        if(!body || !body.login || !body.password){
            return res.status(400).json({ error : 'Favor informar usuário e senha.'});
        }

        const usersFound = await UserModel.find({ email : body.login, password : md5(body.password)});
        
        if( usersFound && usersFound.length > 0 ){
            const user = usersFound[0];
            const token = jwt.sign({_id : user._id}, MY_SECRET_KEY);
            const result = {
                name : user.name,
                email : user.email,
                token
            }

            return res.status(200).json(result);
        }

        return res.status(400).json({ error : 'Usuário ou senha não encontrado.'});
    }

    return res.status(405).json({ error : 'Método infomado não é válido.'});
}

export default connectDb(loginEndpoint);