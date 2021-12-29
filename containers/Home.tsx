import { NextPage } from "next";
import { useEffect } from "react";
import { useState } from "react";

import { executeRequest } from "../services/api";
import { Task } from "../types/Task";
import { CrudModal } from '../components/Modal';
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { List } from "../components/List";

type HomeProps = {
    setToken(s: string) : void
}

export const Home : NextPage<HomeProps> = ({setToken}) => {

    // state Filter
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState('0');
    const [tasks, setTasks] = useState<Task[]>([]);

    const sair = () =>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        setToken('');
    }

    const getFilteredList = async () => {
        try{
            let filter = '?status='+status;
            if(previsionDateStart){
                filter += '&previsionDateStart='+previsionDateStart;
            }

            if(previsionDateEnd){
                filter += '&previsionDateEnd='+previsionDateEnd;
            }

            const result = await executeRequest('task'+filter, 'GET');

            if(result && result.data){
                setTasks(result.data as Task[]);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() =>{
        getFilteredList();
    }, [status, previsionDateStart, previsionDateEnd]);

    // state Modal
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [previsionDate, setPrevisionDate] = useState('');

    const closeModal = () => {
        setShowModal(false);
        setErrorMsg('');
        setName('');
        setPrevisionDate('');
    }
    
    const doSave = async () => {
        try{
            if(!name || !previsionDate){
                setErrorMsg('Favor preencher o Nome e Data de Previsão.');
                return;
            }

            const body = {
                name,
                previsionDate
            }

            await executeRequest('task', 'POST', body);
            await getFilteredList();
            closeModal();
        }catch(e){
            if(e?.response?.data?.error){
                console.log(e?.response);
                setErrorMsg(e?.response?.data?.error);
                return;
            }
            console.log(e);
            setErrorMsg('Ocorreu um erro ao cadastrar a tarefa. Tente novamente.');
        }
    }

    return (
    <>
        <Header sair={sair} showModal={() => setShowModal(true)}/>
        <Filter 
            status={status}
            setStatus={setStatus}
            previsionDateStart={previsionDateStart}
            setPrevisionDateStart={setPrevisionDateStart}
            previsionDateEnd={previsionDateEnd}
            setPrevisionDateEnd={setPrevisionDateEnd}
        />
        <List tasks={tasks} getFilteredList={getFilteredList}/>
        <Footer showModal={() => setShowModal(true)}/>
        <CrudModal 
            showModal={showModal}
            closeModal={closeModal}
            errorMsg={errorMsg}
            name={name}
            setName={setName}
            previsionDate={previsionDate}
            setPrevisionDate={setPrevisionDate}
            doSave={doSave}
        />
    </>);
}