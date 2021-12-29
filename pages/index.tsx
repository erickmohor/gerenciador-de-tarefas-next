import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useState } from 'react';

import { Home } from '../containers/Home';
import { Login } from '../containers/Login';

const Index: NextPage = () => {

  const [accessToken, setToken] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined'){
        const token = localStorage.getItem('accessToken');
        if(token){
          setToken(token);
        }
    }
  }, [])

  return (
    accessToken ? <Home setToken={setToken}/> : <Login setToken={setToken}/>
  )
}

export default Index