import { NextPage } from "next";
import moment from "moment";

type FooterProps = {
    showModal() : void
}

export const Footer : NextPage<FooterProps> = ({ showModal}) => {
    return (
        <div className="container-footer">
            <button onClick={showModal}>
                <img src="/add.svg" alt="Adiciona Tarefa"/> Adicionar uma tarefa
            </button>
            <span>© Copyright {moment().year()}. Todos os direitos reservados.</span>
        </div>
    );
}