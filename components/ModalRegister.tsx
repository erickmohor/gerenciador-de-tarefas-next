import { NextPage } from "next";
import { useState } from "react";
import { Modal } from 'react-bootstrap';

type ModalRegisterProps = {
    showModal : boolean,
    closeModal() : void,
    errorMsg : string,
    msg : string,
    name : string,
    setName(s : string) : void,
    email : string,
    setEmail(s : string) : void,
    createPassword : string,
    setCreatePassword(s : string) : void,
    confirmPassword : string,
    setConfirmPassword(s : string) : void,
    doCreateUser() : void,
}

export const ModalRegister : NextPage<ModalRegisterProps> = ({
    showModal,
    closeModal,
    errorMsg,
    msg,
    name,
    setName,
    email,
    setEmail,
    createPassword,
    setCreatePassword,
    confirmPassword,
    setConfirmPassword,
    doCreateUser
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return(
        <Modal 
            show={showModal}
            onHide={()=>closeModal()}
            className="container-modal"
        >
            <Modal.Body>
            <p>Cadastrar usuário</p>
            {errorMsg && <p className="error">{errorMsg}</p>}
            {msg && <p className="msg">{msg}</p>}
            <input type="text"
                placeholder="Nome"
                value={name}
                onChange={e => setName(e.target.value)}/>
            <input type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}/>

            <div className="modal-register-pass">
                <input type={showPassword ? "text" : "password"} 
                    placeholder="Senha"
                    value={createPassword}
                    onChange={e => setCreatePassword(e.target.value)}/>

                {showPassword ?
                <img src="/hide-pass.svg" alt="Esconder senha" onClick={() => setShowPassword(!showPassword)}/> :
                <img src="/show-pass.svg" alt="Mostrar senha" onClick={() => setShowPassword(!showPassword)}/>
                }
            </div>
            <div className="modal-register-pass">
                <input type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                {showConfirmPassword ?
                <img src="/hide-pass.svg" alt="Esconder confirmar senha" onClick={() => setShowConfirmPassword(!showConfirmPassword)}/> :
                <img src="/show-pass.svg" alt="Mostrar confirmar senha" onClick={() => setShowConfirmPassword(!showConfirmPassword)}/>
                }
            </div>
            </Modal.Body>
        
            <Modal.Footer>
            <div className="button col-12">
                        <button onClick={doCreateUser}>Salvar</button>
                        <span onClick={() => closeModal()}>Cancelar</span>
                    </div>
            </Modal.Footer>
      </Modal>
    );

}