import { NextPage } from "next";
import { useState } from "react"

import { executeRequest } from "../services/api";
import { LoginResponse } from "../types/LoginResponse";
import { ModalRegister } from "../components/ModalRegister"

type LoginProps = {
    setToken(s: string) : void
}

export const Login : NextPage<LoginProps> = ({setToken}) => {
    
    // Login
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [msg, setMsg] = useState('');

    // Create User
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const closeModal = () => {
        setShowModal(false);
        setErrorMsg('');
        setName('');
        setEmail('');
        setCreatePassword('');
        setConfirmPassword('');
    }

    // Modal
    const clearRegister = () => {
        setName('');
        setEmail('');
        setCreatePassword('');
        setConfirmPassword('');
    }


    const doLogin = async () => {
        try {
            if (!login || !password) {
                setError('Favor preencher os dados.');
                return;
            }

            setError('');

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'POST', body);

            if(result && result.data){
                const loginResponse = result.data as LoginResponse;

                localStorage.setItem('accessToken', loginResponse.token);
                localStorage.setItem('userName', loginResponse.name);
                localStorage.setItem('userEmail', loginResponse.email);

                setToken(loginResponse.token);
            }
        } catch (e : any) {
            if(e?.response?.data?.error){
                console.log(e?.response);
                setError(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setError('Ocorreu um erro ao efetuar o login. Tente novamente.');
        }
    }


    const doCreateUser = async () =>{
        try{

            const password = createPassword;

            if(!name || !email || !password){
                setErrorMsg('Favor preencher os campos corretamente.');
                return;
            }

            if(password !== confirmPassword){
                setErrorMsg('As senhas não conferem');
                return;
            }

            const body = {
                name,
                email,
                password
            }

            await executeRequest('user', 'POST', body);
            await clearRegister();

            setErrorMsg('');
            setMsg('Usuário criado.');
            setTimeout(() => {
                setMsg('');
            }, 2000);
            
        } catch (e) {
            if(e?.response?.data?.error){
                console.log(e?.response);
                setErrorMsg(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setErrorMsg('Ocorreu um erro ao cadastrar o usuário. Tente Novamente.');
        }
    }


    return (
        <>
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {msgError && <p>{msgError}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Informe seu email" />
                    <input type="text" placeholder="Informe seu email"
                        value={login} onChange={evento => setLogin(evento.target.value)} />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Informe sua senha" />
                    <input type={showPassword ? "text" : "password"} placeholder="Informe sua senha"
                        value={password} onChange={evento => setPassword(evento.target.value)} />
                    <div className="pass">{showPassword ?
                        <img src="/hide-pass.svg" alt="Esconder senha" onClick={() => setShowPassword(!showPassword)}/> :
                        <img src="/show-pass.svg" alt="Mostrar senha" onClick={() => setShowPassword(!showPassword)}/> }
                    </div>
                </div>
                <button onClick={doLogin}>Login</button>
                <button className="register" onClick={e => setShowModal(!showModal)}>Cadastre-se</button>
            </div>

        </div>
        <ModalRegister
            showModal={showModal}
            closeModal={closeModal}
            errorMsg={errorMsg}
            msg={msg}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            createPassword={createPassword}
            setCreatePassword={setCreatePassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            doCreateUser={doCreateUser}
            />
        </>
    )
}